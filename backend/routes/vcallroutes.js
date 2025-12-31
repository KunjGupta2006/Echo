import express from "express";
import {videoCall } from "../controllers/messages.js"
import { protectRoute } from "../middlewares/auth.middlewares.js";
const router= express.Router();
router.get("/",protectRoute,videoCall);

export default router;