import express from "express";
import {getUsersForSidebar, getMessages ,sendMessage } from "../controllers/messages.js"
import { protectRoute } from "../middlewares/auth.middlewares.js";
const router= express.Router();

router.get("/users",protectRoute , getUsersForSidebar);
router.get("/:id",protectRoute , getMessages);
router.post("/send/:id",protectRoute,sendMessage);

export default router;