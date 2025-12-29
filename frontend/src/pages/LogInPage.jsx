import React, { useState } from 'react'
import {Link} from "react-router-dom";
import { useAuthStore } from '../store/useAuthStore';
import { Eye, EyeOff, User, Mail, Lock, MessagesSquare , Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';



const LogInPage = () => {

const [showPassword,setShowPassword]=useState(false);
const [formData,setFormData]=useState({
    email:"",
    password:"",
  });
const handleSubmit=(e)=>{
    e.preventDefault();
      const sucess=validateForm();
      if(sucess==true){login(formData)}
};

const {login,isLoggingin}=useAuthStore();
const validateForm=()=>{
  if(!formData.email.trim()){return toast.error("Email is required")};
  if(!/\S+@\S+\.\S+/.test(formData.email)){return toast.error("Invalid email format")};
  if(!formData.password.trim()){return toast.error("password is required")};
  if(formData.password.length<6){return toast.error("password must contain atleast 6 characters")};
  return true;
};


  return (
    <div className="flex justify-center">
      <div className="w-1/2 p-6  md:p-12 flex flex-col justify-center">
        <div className="max-w-md mx-auto w-full">
          {/* Logo and Header */}
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-linear-to-r  rounded-xl">
                <MessagesSquare  className="w-7 h-7" />
                
              </div>
              <h1 className="text-2xl font-bold">Echo</h1>
            </div>
            <h2 className="text-3xl font-bold mb-3">Login your account</h2>
            <p >Continue where you left</p>
          </div>
        </div>
        {/* FORM */}
        <div className=" backdrop-blur-lg rounded-2xl border  p-6 md:p-8">
          <div className="flex justify-center px-4 py-8 sm:px-6 sm:py-12">
            <form onSubmit={handleSubmit} className="w-full max-w-md space-y-5">

              {/* Email Field */}
              <div className="form-control">
                <label className="label">
                  <span className="label-text flex items-center gap-2 text-sm sm:text-base"> 
                    <Mail className="w-4 h-4 shrink-0" /> Email 
                  </span>
                </label>
                <div className="relative">
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={(E)=>{setFormData({...formData,email:E.target.value})}}
                    placeholder="your@email.com"
                    className={`input input-bordered w-full text-sm sm:text-base`}
                  />
                </div>
              </div>

              {/* Password Field */}
              <div className="form-control">
                <label className="label">
                  <span className="label-text flex items-center gap-2 text-sm sm:text-base">
                    <Lock className="w-4 h-4 shrink-0" />Password
                  </span>
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={formData.password}
                    onChange={(e)=>{setFormData({...formData,password:e.target.value})}}
                    placeholder="Create a strong password"
                    className={`input input-bordered w-full text-sm sm:text-base`}
                  />
                  <button type="button" onClick={() => setShowPassword(!showPassword)}
                    className="absolute right--2 top-3  transition-colors" >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
                {/* Added responsive text size for password strength/hints if you add them */}
                <p className="mt-2 text-xs sm:text-sm">Password must be at least 6 characters.</p>
              </div>

              {/* Submit Button */}
              <div className="form-control pt-4">
                <button
                  type="submit"
                  className={`btn btn-primary w-full`}
                  disabled={isLoggingin}
                >
                  {isLoggingin ? <><Loader2 className="size-5 animate-spin" />Loading... </>: 'LogIn'}
                </button>
              </div>

              {/* Signup Link */}
              <div className="text-center pt-6">
                <p className="text-sm sm:text-base">
                  Don't have an account?{' '}
                  <Link to="/signup" className="hover:text-purple-700 font-medium transition-colors">
                    signup
                  </Link>
                </p>
              </div>
            </form>
          </div>
        </div>

      </div>
    </div>
  );
}

export default LogInPage