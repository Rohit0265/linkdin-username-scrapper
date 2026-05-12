import { chromium } from "playwright";

async function linkedinScraper(credentials, searchCriteria) {
    const { email, password } = credentials;
    const { gradYear, limit = 10 } = searchCriteria;

    const browser = await chromium.launch({
        headless: false, // Run in headful mode to see what's happening or handle CAPTCHA
    });

    const context = await browser.newContext();
    const page = await context.newPage();

    try {
        // 1. Login
        await page.goto("https://www.linkedin.com/login");
        await page.fill("#username", email);
        await page.fill("#password", password);
        await page.click('button[type="submit"]');

        // Check if login was successful
        await page.waitForURL("**/feed/**", { timeout: 60000 });
        console.log("Logged in successfully");

        // 2. Search
        const searchQuery = `https://www.linkedin.com/search/results/people/?keywords=student%20${gradYear}`;
        await page.goto(searchQuery);
        await page.waitForSelector(".reusable-search__result-container");

        const results = [];
        const profileLinks = await page.$$eval(".app-aware-link", (links) => 
            links
                .map(l => l.href)
                .filter(href => href.includes("/in/") && !href.includes("/ACoAA"))
        );

        // Deduplicate links
        const uniqueLinks = [...new Set(profileLinks)].slice(0, limit);

        for (const link of uniqueLinks) {
            try {
                await page.goto(link);
                await page.waitForLoadState("domcontentloaded");

                // Get name
                const name = await page.$eval("h1", el => el.innerText.trim()).catch(() => "N/A");

                // Click on Contact Info
                await page.click("#top-card-text-details-contact-info");
                await page.waitForSelector(".pv-contact-info");

                const emailVal = await page.$eval(".pv-contact-info__contact-type--email .pv-contact-info__contact-link", el => el.innerText.trim()).catch(() => "Not Found");
                const phoneVal = await page.$eval(".pv-contact-info__contact-type--phone .pv-contact-info__contact-link", el => el.innerText.trim()).catch(() => "Not Found");

                results.push({
                    name,
                    profile: link,
                    email: emailVal,
                    phone: phoneVal,
                    gradYear
                });

                // Close contact info modal if needed or just navigate away
                await page.keyboard.press("Escape");
                
                // Add a small delay to look human
                await page.waitForTimeout(Math.random() * 2000 + 1000);

            } catch (err) {
                console.error(`Error scraping ${link}:`, err.message);
            }
        }

        await browser.close();
        return results;

    } catch (error) {
        console.error("Scraper failed:", error);
        await browser.close();
        throw error;
    }
}

export default linkedinScraper;