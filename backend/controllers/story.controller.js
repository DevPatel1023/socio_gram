// 1. post story
// 2. get story -> the users who follows get the story
// 3. get story for user itself 

import Story from "../models/story.model.js";
import cloudinary from "../utils/cloudinary.js";
import getDataUri from "../utils/datauri.js";
import {User} from "../models/user.model.js";  


export const addNewStory = async (req,res) => {
    try {
        const userId = req.id;
        const media = req.file;
        if(!media){
            return res.status(400).json({msg : "media is required"});
        }

        // convert to data uri
        const mediaUrl = getDataUri(media);
        // upload to cloudinary
        const result = await cloudinary.uploader.upload(mediaUrl,{
            resource_type : "auto",
        });

        const story = await Story.create({
            user : userId,
            mediaUrl : result.secure_url,
            type: media.mimetype.startsWith("video") ? "video" : "image",
        });

        return res.status(200).json({
            success : true, 
            story
        })

    } catch (error) {
        console.log("error while uploading story",error);      
    }
} 

export const getallUsersStory = async (req, res) => {
    try {
        // Fetch the user's following list
        const user = await User.findById(req.id).select("following");
        
        if (!user) {
            console.log(user);
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        // Check if user is following anyone
        if (!user.following || user.following.length === 0) {
            return res.status(200).json({
                success: true,
                stories: [],
                message: "No stories available. Start following users to see their stories."
            });
        }

        // Find stories of followed users in the last 24 hours
        const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);

        const stories = await Story.find({
            user: { $in: user.following },
            createdAt: { $gte: oneDayAgo }
        })
        .populate("user", "username profilePicture _id")
        .sort({ createdAt: -1 }); // Sort by newest first
        
        return res.status(200).json({
            success: true,
            stories,
            count: stories.length
        });

    } catch (error) {
        console.log("Error while fetching user stories:", error);
        return res.status(500).json({
            success: false,
            message: "Internal server error while fetching stories"
        });
    }
};

export const getUserStory = async(req,res) => {
    try {
        // get current user's id
        const userId = req.id;
        //  fetch the stories of current user
        const myStories = await Story.find({
            user : userId,
            createdAt : { $gte : new Date(Date.now() - 24 * 60 * 60 * 1000)},
        }).populate('user','username profilePicture _id');
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
            message : "story deleted",
            response
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

export const getStoryViewers = async(req,res) =>{
    try {
        // pass the story id by params
        const story = await Story.findById(req.params.id);
        // check the story exists
        if(!story){
            return res.status(404).json({
                message : "story not exists"
            });
        }

        // check if the requesting user is story owner
        if(story.user._id.toString() === req.id){
            return res.status(403).json({
                success : false,
                message : "unauthorized access"
            });
        }
       
        return res.status(200).json({
            success : true,
            story : {
                id : story._id,
                owner : story.user.username,
                viewers : story.viewers,
                viewCount : story.viewers.length
            }
        });

    } catch (error) {
        console.log(error);
    }
}