import {Server} from 'socket.io';
import express from 'express';
import http from 'http'

const app = express();

const server = http.createServer(app);//create http server

const io = new Server(server,{
    cors : {
        origin : 'http://localhost:5173',
        methods : ['GET','POST']
    }
});

const userSocketMap = {} ; 
//userid->socket id

// FIX: Added missing return statement
export const getRecieverSocketId = (reciverId) => {
    return userSocketMap[reciverId]; // This was missing!
}

io.on('connection',(socket)=>{
    const userId = socket.handshake.query.userId;
    if(userId && userId !== "undefined") { // Added check for "undefined" string
        userSocketMap[userId] = socket.id;
        console.log('User connected:', userId, 'Socket ID:', socket.id);
        console.log('Current user socket map:', userSocketMap);
    }

    // Emit online users to all connected clients
    io.emit('getOnlineUsers', Object.keys(userSocketMap));

    socket.on('disconnect', () => {
        console.log('User disconnected:', userId, 'Socket ID:', socket.id);
        if(userId && userId !== "undefined") {
            delete userSocketMap[userId];
            console.log('User removed from socket map:', userId);
            console.log('Updated user socket map:', userSocketMap);
        }
        io.emit('getOnlineUsers', Object.keys(userSocketMap));
    });
});

export {app, server, io};