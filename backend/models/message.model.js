import mongoose, { mongo } from "mongoose";

const messageSchema = new mongoose.Schema({
    senderId : {
        type : mongoose.Schema.Types.ObjectId,
        ref : 'User'
    },
    reciverId : {
        type : mongoose.Schema.Types.ObjectId,
        ref : 'User'
    },
    messages : {
        type : String,
        required : true
    }
});

export const Message = mongoose.model('Message',messageSchema);