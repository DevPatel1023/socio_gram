import sharp from 'sharp';
import cloudinary from '../utils/cloudinary.js';
import { Post } from '../models/post.model.js';
import { User } from '../models/user.model.js';
import { Comment } from '../models/comment.model.js';

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

        return res.status(201).json({
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
        const posts = await Post.find().sort({createAt:-1}).populate({path : 'author', select : 'username profilePicture'}).populate({path:'comments',
            sort : {createAt:-1},
            populate :{
                path : 'author',
                select:'username profilePicture'
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
            post,
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
            post,
            success : true
        })
    } catch (error) {
        console.log(error);
    }
}

// comment 
export const addComment = async (req,res) => {
    try {
        const postId = req.params.id;
        const commentUserId = req.id;
        
        const { text } = req.body ;
        const post = await Post.findById(postId);

        if(!text) { 
            return res.status(400).json({
                msg : 'text should not be empty!',
                success : false
            })
        }

        const comment = await Comment.create({
            text,
            author : commentUserId,
            post : postId
        }).populate({
            path : 'author',
            select : 'username , profilePicture'
        });

        // save comment's id in post -> model relationship and then save the post 
        post.comments.push(comment._id);
        await post.save();

        return res.status(201).json({
            message : 'comment added',
            comment,
            success : true
        })
    } catch (error) {
        console.error(error);
    }
}

// get post comment

export const getCommentOfPost = async (req,res) => {
    try {
        const postId = req.params.id;
        const comments = await Comment.find({post : postId}).populate('comment','username','profilePicture');

        if(!comments){
            return res.status(404).json({
                message : 'No comments found for this post' ,
                success : false
            })
        }

        return res.status(200).json({
            success : true,
            comments
        })
    } catch (error) {
        console.error(error);
    }
}

// delete post
export const deletePost = async (req,res) => {
    try {
        const postId = req.params.id ;
        const authorId = req.id;

        const post = await Post.findById(postId);
        // post not found check
        if(!post){
            return res.status(404).json({
                msg : 'Post not found',
                success : false
            })
        }
        // check if the login user is owner of the post
        if(post.author.toString() !== authorId){
            return res.status(403).json({
                msg : 'unauthorized user'
            })
        }

        // delete post
        await Post.findByIdAndDelete(postId);
        
        // remove user model post id also
        let user = await User.findById(authorId);
        user.posts = user.posts.filter(id => id.toString() !== postId );
        await user.save();

        // delete associated comments of post
        await Comment.deleteMany({post : postId});
        return res.status(200).json({
            msg : "post deleted",
            success : true
        })
    } catch (error) {
        console.error(error);
    }
}

// bookmark post
export const bookmarkPost = async (req,res) => {
    try {
        // find post id and user who save that post
        const postId = req.params.id;
        const authorId = req.id;

        const post = await Post.findById(postId);
        if(!post){
            return res.status(404).json({
                msg : "Post not found",
                success : false
            });
        }
        const user = await User.findById(authorId);
        
        if(user.bookmarks.includes(post._id)){
            // post already bookmark so remove it
            user.bookmarks.pull(post._id); //removes if exists
            await user.save();
            return res.status(200).json({
                type : 'unsaved',
                msg : "post removed from bookmark",
                success : true
            });
        }else{
            // bookmark the post
             await user.bookmarks.updateOne({$addToSet : {bookmarks : post._id}});
            await user.save();
            return res.status(200).json({
                type : 'unsaved',
                msg : "post saved to bookmark",
                success : true
            });
        }
    } catch (error) {
        console.error(error);
    }
}