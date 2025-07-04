// 1. post story
// 2. get story -> the users who follows get the story
// 3. get story for user itself 
import { log } from "console";
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

export const getallUsersStory = async (req,res) => {
    try {
        // fetch the user's following list
        const user = await UserActivation.findById(req.id).select("following");
        // then find stories of those user in the last 24 hrs
        const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);

        const stories = await Story.find({
            user : { $in : user.following},
            createdAt : { $gte: oneDayAgo},
        }).populate("user");

        return res.status(200).json({
            success : true ,
            stories
        })
    } catch (error) {
        console.log("error while fetching user story",error);
    }
} 

export const getUserStory = async(req,res) => {
    try {
        // get current user's id
        const userId = req.id;
        //  fetch the stories of current user
        const myStories = await Story.find({
            user : userId,
            createdAt : { $gte : new Date(Date.now() - 24 * 60 * 60 * 1000)},
        });
        return res.status(200).json({
            success : true ,
            myStories
        });
    } catch (error) {
        console.log(error);
    }
}

export const deleteUserStory = async (req,res) => {
    try {
        const userId = req.id;
        const story = await Story.findById(req.params.id);

        if(!story){
            return res.status(404).json({
                message : "story not found"
            })
        }

        if(story.user.toString() !== userId.toString()){
            return res.status(403).json({
                message : "Not authorized"
            });
        }

        const response = await story.deleteOne();
        return res.status(200).json({
            message : "story deleted"
        });
    } catch (error) {
        console.log(error);
    }
} 

export const markstoryAsViwed = async (req,res) =>{ 
    try {
        const story = await Story.findById(req.params.id);

        if(!story){
            return res.status(404).json({
                message : "story not found"
            });
        }

        // check if user already viewed it
        const alreadyViewed = story.viewers.includes(req.id);

        if(!alreadyViewed){
            story.viewers.push(req.id);
            await story.save();
        }
        return res.status(200).json({
            success : true,
            message : 'view recorded'
        })
    } catch (error) {
        console.log(error);
    }
}