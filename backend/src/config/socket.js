import {Server} from "socket.io";
import http from "http";
import express from "express";
import dotenv from "dotenv";

dotenv.config();
const app = express();
const server = http.createServer(app);

const io = new Server(server,{
    cors:{
        origin: [process.env.FE_DOMAIN],
    },
});

const userSocketMap = {};

export function getReceiverSocketId(userid){
    return userSocketMap[userid];
}

io.on("connection", (socket) =>{
    console.log("a user connected : ",socket.id);
    const userid = socket.handshake.query.userid;
    if(userid) {
        userSocketMap[userid] = socket.id;
    }

    io.emit("getOnlineUsers",Object.keys(userSocketMap));
    socket.on("disconnect",()=>{
        console.log("a user connected : ",socket.id);
        delete userSocketMap[userid];
        io.emit("getOnlineUsers",Object.keys(userSocketMap));
    });

});

export {io,app,server};