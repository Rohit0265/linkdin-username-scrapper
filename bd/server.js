import express from "express";
// import dotenv from "dotenv";
import cors from "cors";
// import {launchBrowser, closeBrowser} from "./browser.js";
import linkedinLogin from "./scrap/linkedin.js";

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.use("/linkedin", linkedinLogin);
app.get("/", (req, res) => {
    res.send("Backend Running");
});


app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});