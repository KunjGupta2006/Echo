import React, { useState } from 'react'
import { useAuthStore } from '../store/useAuthStore.js';
import {useChatStore} from "../store/useChatStore.js";
import { Camera } from "lucide-react";
import { motion } from "framer-motion";
import { X } from "lucide-react";
import { Link } from 'react-router-dom';


const ProfilePage = () => {
  const {authUser,isUpdatingProfile,updateProfile,onLineUsers}=useAuthStore();
  const defaultImagesrc="/Gemini_Generated_Image_6b6bql6b6bql6b6b.png";
  const [selectedImage,setSelectedImage]=useState(null);

  const handleImageUpload=async(e)=>{
    const file=e.target.files[0];
    if(!file) return;
    const reader=new FileReader();
    reader.readAsDataURL(file);
    reader.onload=async()=>{
      const base64Image=reader.result;
      setSelectedImage(base64Image);
      await updateProfile({profilePic:base64Image});
    }
  }

  return (
<div className="min-h-screen flex justify-center p-6 bg-base-200 text-base-content">
      {/* Close button */}
    <div className="absolute right-24 mx-auto text-red-500" ><Link to="/">  <X /> </Link></div>
  <motion.div
    initial={{ opacity: 0, y: 70 }}
    animate={{ opacity: 1, y: 30 }}
    className="w-full max-w-lg"
  >
    <div className="card bg-base-100 shadow-xl rounded-2xl p-4">
      <div className="card-body">
        <div className="relative w-36 h-36 mx-auto mb-6">
          <img
            src={selectedImage || authUser.profilePic || defaultImagesrc }
            alt="Profile"
            className="w-36 h-36 rounded-full object-cover border-4 border-base-content shadow-md"
          />
          <label htmlFor="avatar-upload" className={`btn btn-primary btn-circle absolute bottom-0 right-0 ${isUpdatingProfile? "animate-pulse":""} `}>
            <Camera size={18} />
            <input type="file" id="avatar-upload" className="hidden" accept="image/*" disabled={isUpdatingProfile} onChange={handleImageUpload}></input>
          </label>
        </div>

        <div className="space-y-4 text-center">
          <div>
            <h2 className="text-2xl font-semibold text-base-content">{authUser.username}</h2>
            <p className=" text-sm text-base-content/70">{authUser.email}</p>
          </div>

          <div className="grid grid-cols-2 gap-4 mt-4">
            <div className="bg-base-200 p-4 rounded-xl shadow-md">
              <p className="text-sm text-base-content/70">Member Since</p>
              <p className="text-lg font-medium text-base-content">{authUser.createdAt.split("T")[0]}</p>
            </div>

            <div className="bg-base-200 p-4 rounded-xl shadow-md">
              <p className="text-sm text-base-content/70">Status</p>
              <p>
                {onLineUsers?.includes(authUser._id) ?
                   <b className="text-lg text-success text-base-content/60">Online</b> : 
                   <b className="text-lg text-warning text-base-content/60">Offline</b>
                  }
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </motion.div>
</div>
  );
}
export default ProfilePage;