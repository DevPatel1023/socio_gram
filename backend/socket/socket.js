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

// Added missing return statement
export const getRecieverSocketId = (reciverId) => {
    return userSocketMap[reciverId];
}

io.on('connection',(socket)=>{
    const userId = socket.handshake.query.userId;
    if(userId && userId !== "undefined") { // Added check for "undefined" string
        userSocketMap[userId] = socket.id;
    }

    // Emit online users to all connected clients
    io.emit('getOnlineUsers', Object.keys(userSocketMap));

    socket.on('disconnect', () => {
        console.log('User disconnected:', userId, 'Socket ID:', socket.id);
        if(userId && userId !== "undefined") {
            delete userSocketMap[userId];
        }
        io.emit('getOnlineUsers', Object.keys(userSocketMap));
    });
});

export {app, server, io};