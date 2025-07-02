import mongoose from "mongoose";

const StorySchema = new mongoose.Schema({
    user : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "User",
        required : true
    },
    mediaUrl : {
        type : String,
        required : true
    },
    createdAt : {
        type : Date.now,
        required : true
    },
    viewers : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "User",
    },
});

const Story = mongoose.model(StorySchema);
export default Story;