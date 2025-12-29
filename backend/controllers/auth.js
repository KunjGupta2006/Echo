import { generateToken } from "../config/utils.js";
import User from "../models/users.js";
import bcrypt from "bcryptjs";
import cloudinary from "../config/cloudinary.js";

export const usersignup=async (req,res)=>{
    const {username,email,password}=req.body;
    try{
        if(!username || !email || !password ){return res.status(400).json({message:"All fields required"})};
        if(password.length <6){return res.status(400).json({message:"Password must be atleast 6 characters"});}
        const user=await User.findOne({email});
        if(user) {return res.status(400).json({message:"email already exists"});}
        const salt=await bcrypt.genSalt(10);
        const hashPasword=await bcrypt.hash(password,salt);
        
        const newUser=new User({
            username,email,password : hashPasword,
        });
        if(newUser){
            //jwt token
            generateToken(newUser._id,res)
                await newUser.save();
                res.status(201).json({
                    _id:newUser._id,
                    username:newUser.username,
                    email:newUser.email,
                    profilePic:newUser.profilePic,
                });
        }else{
            return res.status(400).json({message:"Invalid user data"});
        }

    }catch(error){
        console.error("ERROR IN SIGNUP ---->",error.message);
        res.status(500).json({message:"internal server error"});
    }
};

export const userlogin=async (req,res)=>{
    const {email,password} =req.body;
    try{
        if(!email || !password) return res.status(400).json({message:"All field are required"});
        const user=await User.findOne({email});
        if(!user) return res.status(400).json({message:"Invalid credentials"});

        const isPasswordCorrect=await bcrypt.compare(password,user.password);
        if(!isPasswordCorrect){return res.status(400).json({message:"Invalid credentials"});}
        generateToken(user._id,res);
        res.status(200).json({
                    _id:user._id,
                    username:user.username,
                    email:user.email,
                    profilePic:user.profilePic,
        });
    }catch(error){
        console.error("Error in login controller ---->",error.message);
        res.status(500).json({message:"internal server error"});
    }
};

export const userlogout=(req,res)=>{
    try{
        res.cookie("jwt","",{maxAge:0});
        res.status(200).json({message:"user logged out.."});
    }catch(error){
        console.error("error logging out ---->",error.message);
        res.status(500).json({message:"internal server error"});
        
    }
};

export const updateProfile=async(req,res)=>{
    try{
        const {profilePic}=req.body;
        const userId=req.user._id;
        
        if(!profilePic){return res.status(400).json({message:"Profile pic is required"})};

        const cloudUploadResponse=await cloudinary.uploader.upload(profilePic,{
            folder:"profile_images",
        });
        const updatedUser=await User.findByIdAndUpdate(userId,{profilePic:cloudUploadResponse.secure_url},{new:true});
        res.status(200).json(updatedUser);
    }catch(error){
        console.log("ERROR UPDATING PROFILE PIC: ",error.message);
        return res.status(500).json("Internal server error");
    }
};

export const checkAuth=(req,res)=>{
    try{
        res.status(200).json(req.user);
    }catch(error){
        console.log("ERROR in checkAuth controller ",error.message);
        return res.status(500).json("Internal server error");
    }
};
