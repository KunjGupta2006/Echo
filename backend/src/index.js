import express from "express";
import cors from "cors";
import connectDB from "../config/db.js";
import cookieParser from "cookie-parser";
import {app,server} from "../config/socket.js";

import authRoutes from "../routes/authroutes.js";
import messageRoutes from "../routes/messageroutes.js";

import path from "path";

import dotenv from "dotenv";
dotenv.config();

const __dirname=path.resolve();

app.use(cors({
    origin:"http://localhost:5173",
    credentials:true,
}));
app.use(express.json());
app.use(cookieParser());

connectDB();
app.get("/",(req,res)=>{
    res.send("running");
});

app.use("/api/auth/",authRoutes);
app.use("/api/messages/",messageRoutes);

if(process.env.NODE_ENV==="production"){
    app.use(express.static(path.join(__dirname,"../frontend/dist")));

    app.get("/*",(req,res)=>{
        res.sendFile(path.join(__dirname,"../frontend","dist","index.html"));
    });
}


server.listen(process.env.PORT,()=>{
    console.log(`server listening on PORT: ${process.env.PORT}`)
});
