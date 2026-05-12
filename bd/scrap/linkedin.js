import { chromium } from "playwright";

async function linkedinLogin() {

    const browser = await chromium.launch({
        headless: false
    });

    const page = await browser.newPage();

    await page.goto("https://www.linkedin.com/login");

    await page.fill("#username", "YOUR_EMAIL");
    await page.fill("#password", "YOUR_PASSWORD");

    await page.click('button[type="submit"]');

    console.log("Logged in");

}

export default linkedinLogin;