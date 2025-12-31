import User from "../models/users.js";
import Message from "../models/messages.js";
import cloudinary from "../config/cloudinary.js";
import { getReceiverSocketId,io } from "../config/socket.js";

export const getUsersForSidebar=async (req,res)=>{
    try{
        const loggedInUserId=req.user._id;
        const users=await User.find({ _id: { $ne:loggedInUserId } }).select("-password");

        res.status(200).json({users});
    }catch(error){
        console.log("Error in finding users--->",error.message);
        res.status(500).json({message:"Internal server error"});
    }
};

export const getMessages=async(req,res)=>{
    try{
        const {id:usertochat}=req.params;
        const myId=req.user._id;
        const messages=await Message.find({
            $or:[
            {senderId: myId, receiverId: usertochat},
            {senderId: usertochat, receiverId: myId}
            ]
        });
        res.status(200).json({messages});
    }catch(error){
        console.log("error in getMessages controller --->",error.message);
        res.status(500).json({message:"Internal server error"});
    }
};

export const sendMessage=async(req,res)=>{
    try{
        const {text,image}= req.body;
        const { id: receiverId } = req.params;
        const myId=req.user._id;

    if (!text && !image) {
      return res.status(400).json({ message: "Text or image is required" });
    }
        let imageUrl;
        if(image){
            const uploadimage= await cloudinary.uploader.upload(image);
            imageUrl=uploadimage.secure_url;
        }

        const newMessage=new Message({
            senderId:myId,
            receiverId:receiverId,
            text,
            image:imageUrl,
            
        });
        await newMessage.save();
        // real time functionality -->socketio
        const receiverSocketId=getReceiverSocketId(receiverId);
        if(receiverSocketId){
            io.to(receiverSocketId).emit("newMessage",newMessage);
        }

        res.status(201).json(newMessage);
    }catch(error){
        console.log("error in sendMessage controller --->",error);
        res.status(500).json({message:"Internal server error"});
    }
};
export const videoCall=async (req,res)=>{
    try{
        const {id:usertocall}=req.params;
        const myId=req.user._id;
        const callData={myId,usertocall};
        res.status(200).json({callData});

    }catch(error){
        console.log("error in video calling controller--->",error.message);
        res.status(500).json({message:"iNTERNAL SERVER ERROR"});
    }
};