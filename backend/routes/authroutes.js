import express from "express";
import {usersignup,userlogin,userlogout, updateProfile,checkAuth} from "../controllers/auth.js";
import { protectRoute } from "../middlewares/auth.middlewares.js";
const router=express.Router();

router.post("/signup",usersignup);
router.post("/login",userlogin);
router.post("/logout",userlogout);

router.put("/update-profile",protectRoute,updateProfile);
router.get("/check",protectRoute,checkAuth);
export default router;