import {create} from "zustand";
import {axiosInstance} from "../lib/axios.js";
import toast from "react-hot-toast";
import {io} from "socket.io-client";

const BASE_URL= import.meta.env.MODE === "development"? "http://localhost:5001" : "/" ;

export const useAuthStore=create((set, get)=>({
    authUser:null,
    isSigningUp:false,
    isLoggingin:false,
    isUpdatingProfile:false,
    isCheckingAuth:true,
    onLineUsers:[],
    socket:null,

    checkAuth:async()=>{
        try{
            const res= await axiosInstance.get("/auth/check");
            set({authUser:res.data});
            get().connectSocket();
        }catch(error){
            console.log("ERROR IN CHECKAUTH...",error);
            set({authUser:null});
        }finally{
            set({isCheckingAuth:false});
        }
    },
    signup:async(data)=>{
        set({isSigningUp:true});
        try{
            const res=await axiosInstance.post("/auth/signup",data);
            set({authUser:res.data});
            toast.success("Account created successfully!");
            get().connectSocket();
        }catch(error){
            toast.error(error.response.data.message);
        }finally{
            set({isSigningUp:false});
        }
    },
    logout:async()=>{
        try{
            await axiosInstance.post("/auth/logout");
            set({authUser:null});
            toast.success("user logged out successfully");
            get().disconnectSocket();
        }catch(error){
            toast.error(error.response.data.message);
        }
    },
    login:async(data)=>{
        set({isLoggingin:true});
        try{
            const res=await axiosInstance.post("/auth/login",data);
            set({authUser:res.data});
            toast.success("Account created successfully!");
            get().connectSocket();
        }catch(error){
            toast.error(error.response.data.message);
        }finally{
            set({isLoggingin:false});
        }
    },
    updateProfile:async(data)=>{
        set({isUpdatingProfile:true});
        try{
            const res=await axiosInstance.put("/auth/update-profile", data);
            set({authUser: res.data});
            toast.success("Profile image updated");
        }catch(error){
            console.dir(error);
            toast.error(error.message);
        }finally{
            set({isUpdatingProfile:false});
        }
    },
connectSocket: () => {
  const { authUser, socket } = get();
  
  // If no user or socket is already alive and connected, do nothing
  if (!authUser || (socket && socket.connected)) return;

  const newSocket = io(BASE_URL, {
    query: {
      userId: authUser._id,
    },
    // Useful for preventing automatic reconnection loops in Dev
    reconnectionAttempts: 5, 
  });

  // Explicitly connect
  newSocket.connect();

  newSocket.on("getOnlineUsers", (userIds) => {
    set({ onLineUsers: userIds });
  });

  set({ socket: newSocket });
},
    disconnectSocket: ()=>{
        if(get().socket?.connected) {get().socket.disconnect(); set({socket:null})}
    }
}));