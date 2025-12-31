import express from "express";
import http from "http";
import {Server} from "socket.io";
const app=express();

const server=http.createServer(app);
const io=new Server(server,{
    cors:{
        origin:["http://localhost:5173",process.env.FRONTEND_URL],
        methods: ["GET", "POST"]
    }
});

export function getReceiverSocketId(userId){
    return userSocketMap[userId];
}

//store online users {userId:socketId}
const userSocketMap={};

io.on('connection',(socket)=>{
    console.log("-------user online-----",socket.id);

    const userId=socket.handshake.query.userId;
    if(userId) userSocketMap[userId]=socket.id;
    io.emit("getOnlineUsers",Object.keys(userSocketMap));


    socket.on('disconnect',()=>{
        console.log("-------user disconnected-----",socket.id);
        delete userSocketMap[userId];
        io.emit("getOnlineUsers",Object.keys(userSocketMap));
    });
        
    socket.on('join-room', (room) => {
        socket.join(room);
        console.log(`User ${socket.id} joined room ${room}`);
    });

    // Relay Offer
    socket.on('offer', (offer, room) => {
        socket.to(room).emit('offer', offer, socket.id);
    });

    // Relay Answer
    socket.on('answer', (answer, room) => {
        socket.to(room).emit('answer', answer);
    });
    //call notification
    socket.on("request-video-call", ({ to, from }) => {
        const receiverSocketId = userSocketMap[to]; // Direct check
        console.log("Call Request to User:", to);
        console.log("Found Socket ID:", receiverSocketId);

        if (receiverSocketId) {
            io.to(receiverSocketId).emit("incoming-video-call", { from });
        } else {
            console.log("CRITICAL: Receiver socket not found in map!");
        }
    });

    // Relay ICE Candidates
    socket.on('ice-candidate', (candidate, room) => {
        socket.to(room).emit('ice-candidate', candidate);
    });

    socket.on('end-call', (room) => {
        socket.to(room).emit('end-call');
        socket.leave(room);
    });
    socket.on('ready', (room) => {
        socket.to(room).emit('ready');
    });
    socket.on("reject-call", (room) => {
        socket.to(room).emit("call-rejected");
    });

});

export  {app,io,server};