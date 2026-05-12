import express from "express";
import cors from "cors";
import linkedinScraper from "./scrap/linkedin.js";

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
    res.send("LinkedIn Scraper API is Running");
});

app.post("/scrape", async (req, res) => {
    const { email, password, gradYear, limit } = req.body;

    if (!email || !password || !gradYear) {
        return res.status(400).json({ error: "Missing credentials or search criteria" });
    }

    try {
        const results = await linkedinScraper({ email, password }, { gradYear, limit });
        res.json({ success: true, data: results });
    } catch (error) {
        console.error("Scrape error:", error);
        res.status(500).json({ success: false, error: error.message });
    }
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});