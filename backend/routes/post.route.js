import express from "express";
import upload from "../middlewares/multer.js";
import { addComment, addNewPost, bookmarkPost, deletePost, dislikepost, getAllPost, getCommentOfPost, getUserPosts, likepost } from "../controllers/post.controller.js";
import isAuthenticated from "../middlewares/isAuthenticated.js";
const router = express.Router();

// routes
router.route('/addpost').post(isAuthenticated,upload.single('image'),addNewPost);
router.route('/all').get(isAuthenticated,getAllPost);
router.route('/userpost/all').get(isAuthenticated,getUserPosts);
router.route('/:id/like').get(isAuthenticated,likepost);
router.route('/:id/dislike').get(isAuthenticated,dislikepost);
router.route('/:id/comment').post(isAuthenticated,addComment);
router.route('/:id/comment/all').get(isAuthenticated,getCommentOfPost);
router.route('/delete/:id').delete(isAuthenticated,deletePost);
router.route(':id/bookmark').post(isAuthenticated,bookmarkPost);

export default router;
