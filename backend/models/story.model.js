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
    type: {
    type: String,
    enum: ["image", "video"],
    required: true,
  },
    viewers : [{
        type : mongoose.Schema.Types.ObjectId,
        ref : "User",
    }],
}, { timestamps: true });

const Story = mongoose.model("Story",StorySchema);
export default Story;