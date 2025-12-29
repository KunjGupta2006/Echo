import React, { useState } from 'react'
import {Link} from "react-router-dom";
import { useAuthStore } from '../store/useAuthStore';
import { Eye, EyeOff, User, Mail, Lock, MessagesSquare ,CheckCircle, XCircle, Sparkles, Shield, Zap, Users, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';

const SignUpPage = () => {
const [showPassword,setShowPassword]=useState(false);
const [formData,setFormData]=useState({
    username:"",
    email:"",
    password:"",
  });

const [passwordStrength, setPasswordStrength] = useState(0);
const {signup,isSigningUp}=useAuthStore();
const validateForm=()=>{
  if(!formData.username.trim()){return toast.error("Username is required")};
  if(!formData.email.trim()){return toast.error("Email is required")};
  if(!/\S+@\S+\.\S+/.test(formData.email)){return toast.error("Invalid email format")};
  if(!formData.password.trim()){return toast.error("password is required")};
  if(formData.password.length<6){return toast.error("password must contain atleast 6 characters")};
  return true;
};

const handleSubmit=(e)=>{
    e.preventDefault();
    const sucess=validateForm();
    if(sucess==true){signup(formData)}
};

  
  const calculatePasswordStrength = (password) => {
    let strength = 0;
    if (password.length >= 8) strength += 1;
    if (/[a-z]/.test(password)) strength += 1;
    if (/[A-Z]/.test(password)) strength += 1;
    if (/\d/.test(password)) strength += 1;
    if (/[^A-Za-z0-9]/.test(password)) strength += 1;
    return strength;
  };
    const getPasswordStrengthColor = (strength) => {
    if (strength <= 2) return 'bg-red-500';
    if (strength <= 3) return 'bg-yellow-500';
    return 'bg-green-500';
  };
  const handlepassChange=(E)=>{
    setFormData({...formData,password:E.target.value});
    setPasswordStrength(calculatePasswordStrength(E.target.value));
  }


return (
    <div className="min-h-screen bg-gray-900 flex">
      {/* Left Side - Form */}
      <div className="w-full lg:w-1/3 p-6 md:p-12 mr-16 flex flex-col justify-center">
        <div className="max-w-md mx-auto w-full">
          {/* Logo and Header */}
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-linear-to-r from-purple-600 to-violet-600 rounded-xl">
                <MessagesSquare  className="w-7 h-7 text-white" />
                
              </div>
              <h1 className="text-2xl font-bold text-white">Echo</h1>
            </div>
            <h2 className="text-3xl font-bold text-white mb-3">Create your account</h2>
            <p className="text-gray-400">Join thousands of users already connected on Echo</p>
          </div>
        </div>
        {/* FORM */}
        <div className="bg-gray-800/50 backdrop-blur-lg rounded-2xl border border-gray-700/50 p-6 md:p-8">
             <form onSubmit={handleSubmit} className="space-y-5">
               {/* Username Field */}
               <div className="form-control">
                 <label className="label">
                   <span className="label-text text-gray-300 flex items-center gap-2">
                     <User className="w-4 h-4" />
                     Username
                   </span>
                 </label>
                 <div className="relative">
                   <input
                    type="text"
                    name="username"
                    value={formData.username}
                    onChange={(E)=>{setFormData({...formData,username:E.target.value})}}
                    placeholder="Enter a username"
                    className={`input input-bordered w-full bg-gray-900/50 border-gray-700 text-white placeholder-gray-500 `}
                  />
                </div>
              </div>

              {/* Email Field */}
               <div className="form-control">
                 <label className="label">
                   <span className="label-text text-gray-300 flex items-center gap-2"> <Mail className="w-4 h-4" /> Email </span>
                 </label>
                 <div className="relative">
                   <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={(E)=>{setFormData({...formData,email:E.target.value})}}
                    placeholder="your@email.com"
                    className={`input input-bordered w-full bg-gray-900/50 border-gray-700 text-white placeholder-gray-500 `}
                  />
                </div>
              </div>


               {/* Password Field */}
               <div className="form-control">
                 <label className="label">
                   <span className="label-text text-gray-300 flex items-center gap-2">
                     <Lock className="w-4 h-4" />Password
                   </span>
                 </label>
                 <div className="relative">
                   <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={formData.password}
                    onChange={(e)=>{handlepassChange(e)}}
                    placeholder="Create a strong password"
                    className={`input input-bordered w-full bg-gray-900/50 border-gray-700 text-white placeholder-gray-500 `}
                  />
                  <button type="button" onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-3 text-gray-400 hover:text-white transition-colors" >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
                
                {/* Password Strength Indicator */}
                {formData.password && (
                  <div className="mt-2">
                    <div className="flex gap-1 mb-1">
                      {[1, 2, 3, 4, 5].map((i) => (
                        <div
                          key={i}
                          className={`h-2 flex-1 rounded-full transition-all duration-300 ${
                            i <= passwordStrength
                              ? getPasswordStrengthColor(passwordStrength)
                              : 'bg-gray-700'
                          }`}
                        />
                      ))}
                    </div>
                    <div className="flex justify-between text-xs text-gray-400">
                      <span>Weak</span>
                      <span>Strong</span>
                    </div>
                  </div>
                )}
              </div>

               {/* Submit Button */}
               <div className="form-control pt-4">
                 <button
                  type="submit"
                  className={`btn bg-purple-600 w-full`}
                  disabled={isSigningUp}
                >
                  {isSigningUp ? <Loader2 className="size-5 animate-spin" /> : 'Create Account'}
                </button>
              </div>

               {/* Login Link */}
               <div className="text-center pt-6">
                 <p className="text-gray-400">
                   Already have an account?{' '}
                   <Link to="/login" className="text-purple-400 hover:text-purple-300 font-medium transition-colors">
                     login
                   </Link>
                 </p>
               </div>
            </form>
        </div>

      </div>
            {/*Right Side - Grid Pattern Design */}
            <div className="hidden lg:flex lg:w-1/2 bg-gray-900 flex-col justify-center items-center p-12 relative overflow-hidden">
              {/* Background Grid Pattern */}
              <div className="absolute inset-0">
                {/* Main Grid Lines */}
                <div className="absolute inset-0" style={{
                  backgroundImage: `
                    linear-gradient(to right, rgba(168, 85, 247, 0.05) 1px, transparent 1px),
                    linear-gradient(to bottom, rgba(168, 85, 247, 0.05) 1px, transparent 1px)
                  `,
                  backgroundSize: '50px 50px'
                }}></div>
                
                {/* Subtle Dots at Grid Intersections */}
                <div className="absolute inset-0" style={{
                  backgroundImage: 'radial-gradient(circle at 50px 50px, rgba(168, 85, 247, 0.1) 1px, transparent 1px)',
                  backgroundSize: '50px 50px'
                }}></div>
                
                {/* Animated Gradient Orbs */}
                <div className="absolute top-1/4 -left-32 w-96 h-96 bg-linear-to-r from-purple-900/20 to-transparent rounded-full blur-3xl animate-pulse"></div>
                <div className="absolute bottom-1/4 -right-32 w-96 h-96 bg-linear-to-l from-violet-900/20 to-transparent rounded-full blur-3xl animate-pulse"></div>
              </div>

              {/* Floating Grid Elements */}
              <div className="relative z-10 w-full max-w-2xl">
                {/* Grid Container */}
                <div className="grid grid-cols-4 grid-rows-4 gap-8 opacity-30">
                  {[...Array(16)].map((_, i) => (
                    <div
                      key={i}
                      className="aspect-square rounded-lg border border-purple-500/20 bg-linear-to-br from-purple-900/10 to-violet-900/10 backdrop-blur-sm"
                      style={{
                        animationDelay: `${i * 0.1}s`,
                        animation: 'pulse 4s infinite ease-in-out'
                      }}
                    ></div>
                  ))}
                </div>

                {/* Center Content */}
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <div className="text-center">
                    {/* Animated Echo Logo */}
                    <div className="relative mb-8">
                      <div className="absolute inset-0 bg-linear-to-r from-purple-600 to-violet-600 rounded-2xl blur-xl opacity-50 animate-pulse"></div>
                      <div className="relative p-6 bg-linear-to-r from-purple-600 to-violet-600 rounded-2xl shadow-2xl">
                        <MessagesSquare className="w-20 h-16 text-white" />
                      </div>
                      
                      {/* Floating Particles */}
                      <div className="absolute -top-4 -left-4 w-8 h-8 bg-purple-400/30 rounded-full blur-sm animate-bounce"></div>
                      <div className="absolute -bottom-4 -right-4 w-8 h-8 bg-violet-400/30 rounded-full blur-sm animate-bounce" style={{animationDelay: '0.5s'}}></div>
                    </div>

                    {/* Minimal Text */}
                    <h1 className="text-7xl font-bold text-white mb-4">
                      <span className="bg-linear-to-r from-purple-400 to-violet-400 bg-clip-text text-transparent">
                        Echo
                      </span>
                    </h1>
                    
                    <div className="space-y-2">
                      <p className="text-gray-300 text-xl font-light tracking-wide">
                        Where conversations
                      </p>
                      <div className="relative">
                        <p className="text-gray-300 text-xl font-light tracking-wide">
                          come alive
                        </p>
                        <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-24 h-0.5 bg-linear-to-r from-transparent via-purple-500 to-transparent"></div>
                      </div>
                    </div>

                    {/* Minimal Stats */}
                    <div className="flex justify-center gap-6 mt-8 opacity-70">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-purple-300">∞</div>
                        <div className="text-xs text-gray-400 uppercase tracking-wider">Connections</div>
                      </div>
                      <div className="w-px bg-gray-700"></div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-purple-300">⚡</div>
                        <div className="text-xs text-gray-400 uppercase tracking-wider">Instant</div>
                      </div>
                      <div className="w-px bg-gray-700"></div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-purple-300">🔒</div>
                        <div className="text-xs text-gray-400 uppercase tracking-wider">Secure</div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Animated Grid Highlights */}
                <div className="absolute top-0 left-0 w-full h-1 bg-linear-to-r from-transparent via-purple-500/50 to-transparent animate-slide"></div>
                <div className="absolute bottom-0 left-0 w-full h-1 bg-linear-to-r from-transparent via-violet-500/50 to-transparent animate-slide" style={{animationDelay: '1s'}}></div>
              </div>

              {/* Subtle Corner Accents */}
              <div className="absolute top-0 left-0 w-64 h-64">
                <div className="absolute top-0 left-0 w-32 h-1 bg-linear-to-r from-purple-500 to-transparent"></div>
                <div className="absolute top-0 left-0 w-1 h-32 bg-linear-to-b from-purple-500 to-transparent"></div>
              </div>
              <div className="absolute bottom-0 right-0 w-64 h-64">
                <div className="absolute bottom-0 right-0 w-32 h-1 bg-linear-to-l from-violet-500 to-transparent"></div>
                <div className="absolute bottom-0 right-0 w-1 h-32 bg-linear-to-t from-violet-500 to-transparent"></div>
              </div>
            </div>

            {/* Mobile View Grid Pattern */}
            <div className="lg:hidden absolute inset-0 -z-10 opacity-10">
              <div style={{
                backgroundImage: `
                  linear-gradient(to right, rgba(168, 85, 247, 0.1) 1px, transparent 1px),
                  linear-gradient(to bottom, rgba(168, 85, 247, 0.1) 1px, transparent 1px)
                `,
                backgroundSize: '30px 30px'
              }}>

            </div>
          </div>
    </div>
);

}

export default SignUpPage;