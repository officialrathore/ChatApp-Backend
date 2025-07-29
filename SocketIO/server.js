import {Server} from "socket.io";
import http from "http";
import express from "express";

const app = express();
const server = http.createServer(app);

const io = new Server(server,{
    cors:{
        origin:"http://localhost:5173",
        methods:["GET", "POST"],
        credentials: true,
    }
});

export const getReceiverSocketId = (receiverId) => {
    return users[receiverId];
  };

const users={};

io.on("connection", (socket) => {
  console.log("A user connected", socket.id);
  const userId= socket.handshake.query.userId;
  if (userId) {
    users[userId] = socket.id; // Store user ID and socket ID
    console.log(users);
  }

  io.emit("getOnlineUsers", Object.keys(users)); // Emit the list of connected users

  // Handle disconnection
  socket.on("disconnect", () => {
    console.log("A user disconnected", socket.id);
    // Remove user from the users object
    delete users[userId];
    io.emit("getOnlineusers", Object.keys(users)); // Emit the updated list of connected users
  });
});

export {io, server,app};