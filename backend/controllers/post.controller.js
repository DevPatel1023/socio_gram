import sharp from 'sharp';
import cloudinary from '../utils/cloudinary.js';
import { Post } from '../models/post.model.js';
import { User } from '../models/user.model';


export const addNewPost = async(req,res)=>{
    try {
        const {caption} = req.body;
        const image = req.file;
        const userId = req.id;

        if(!image){
            return res.status(400).json({
                message  : 'Image required'
            })
        }

        //image optimize and convert into jpeg format by reducing its size and quality then convert from buffer to datauri
        const optimizedImageBuffer = await sharp(image.buffer).resize({width:800,height:800,fit:'inside'}).toFormat('jpeg',{quality:80}).toBuffer();

        //buffer to datauri
        const fileUri = `data:image/jpeg;base64,${optimizedImageBuffer.toString('base64')}`;

        const cloudResponse = await cloudinary.uploader.upload(fileUri);
        const post = await Post.create({
            caption,
            image : cloudResponse.secure_url,
            author : userId,
        });

        const user = await User.findById(userId);

        if(user){
            user.posts.push(post._id);
            await user.save();
        }
        
        await post.populate({path : 'author',select:'-password'});

        return res.status().json({
            message : 'New post added',
            post,
            success : true
        });
    } catch (error) {
        console.log(error);
    }
}

// get all posts
export const getAllPost = async (req,res) =>{
    try {
        const posts = await Post.find().sort({createAt:-1}).populate({path : 'author', select : 'username,profilePicture'}).populate({path:'comments',
            sort : {createAt:-1},
            populate :{
                path : 'author',
                select:'username,profilePicture'
            }
        });

        return res.status(200).json({
            posts,
            success : true
        })
    } catch (error) {
        console.log(error);
    }
};

//get users posts
export const getUserPosts = async (req,res) =>{
    try {
        const authorId = req.id;
        const posts = await Post.find({author:authorId}).sort({createdAt:-1}).populate({
            path:'author',
            select:'username,profilePicture'
        }).populate({
            path : 'comments',
            sort : {createdAt : -1} ,
            populate : {
                path : 'author' ,
                select : 'username,profilePicture'
            }
        });
        return res.status(200).json({
            posts,
            success : true ,
            message : 'user posts getted successfully'
        })
    } catch (error) {
        console.log(error);
        
    }
}

//like posts 
export const likepost = async (req,res) => {
    try {
        const likeuserId = req.id;
        const postId = req.params.id;
        const post = await Post.findById(postId);
        if(!post){
            return res.status(404).json({
                message : 'Post not found',
                success : false
            });
        }   
        //check if user already liked the post
        await post.updateOne({
            $addToSet : {
                likes : likeuserId
            }
        })
        await post.save();

        //implement socket.io for real time notification
        return res.status(200).json({
            message : 'User Liked' ,
            success : true
        })
    } catch (error) {
        console.log(error);
    }
}

//dislike posts 
export const dislikepost = async (req,res) => {
    try {
        const likeuserId = req.id;
        const postId = req.params.id;
        const post = await Post.findById(postId);
        if(!post){
            return res.status(404).json({
                message : 'Post not found',
                success : false
            });
        }   
        //check if user already liked the post
        await post.updateOne({
            $pull : {
                likes : likeuserId
            }
        })
        await post.save();

        //implement socket.io for real time notification
        return res.status(200).json({
            message : 'User DisLiked' ,
            success : true
        })
    } catch (error) {
        console.log(error);
    }
}