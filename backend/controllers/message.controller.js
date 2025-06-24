import Conversation from "../models/conversation.model.js"
import { Message } from "../models/message.model.js";

// for chat logic
export const sendMesssage = async (req,res) => {
    try {
       const senderId = req.id;
       const receiverId = req.params.id;

       const { message } = req.body;

       let conversation = await Conversation.findOne({
        participants : {$all : [senderId,receiverId]}
       });

    //    establish the convo if not started yet
    if(!conversation){
        conversation = await Conversation.create({
            participants : [senderId,receiverId];
        }) ;
    }
    const newMessage = await Message.create({
        senderId,
        reciverId,
        message
    })
    if(newMessage){
        conversation.messages.push(newMessage._id);
        
        await Promise.all([conversation.save(),newMessage.save()])
    }

    // implement socket.io for real time data transfer
    return res.status(201).json({
        success : true ,
        newMessage
    })
    } catch (error) {
        console.error(error);
    }
}

// get message
export const getMessage = async (req,res) => {
    try {
        const senderId = req.id;
        const receiverId = req.params.id;

        
    } catch (error) {
        console.log(error);
    }
}