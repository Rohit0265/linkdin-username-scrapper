import express from "express";
import { Router } from "express";
import linkedinLogin from "../scrap/linkedin";

const router  = Router();

router.get('/login', async (req,res)=>{
    try {
        await linkedinLogin();
        res.json({
            success: true,
            message: "Login started"
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
})

export default router;