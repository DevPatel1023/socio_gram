// 1. post story
// 2. get story -> the users who follows get the story
// 3. get story for user itself 
import Story from "../models/story.model";
import cloudinary from "../utils/cloudinary";
import getDataUri from "../utils/datauri";

export const addNewStory = async (req,res) => {
    try {
        const userId = req.id;
        const media = req.file;
        if(!media){
            return res.status(400).json({msg : "media is required"});
        }

        // convert to data uri
        const mediaUrl = getDataUri(file);
        // upload to cloudinary
        const result = await cloudinary.uploader.upload(mediaUrl,{
            resource_type : "auto",
        });

        const story = await Story.create({
            user : userId,
            mediaUrl : result.secure_url,
            type: file.mimetype.startsWith("video") ? "video" : "image",
        });

        return res.status(200).json({
            success : true, 
            story
        })

    } catch (error) {
        console.log("error while uploading story",error);      
    }
} 