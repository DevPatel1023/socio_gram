import express from "express";
import isAuthenticated from "../middlewares/isAuthenticated.js";
import upload from "../middlewares/multer.js";
import { addNewStory, deleteUserStory, getallUsersStory, getStoryViewers, getUserStory, markstoryAsViwed } from "../controllers/story.controller.js";
const router = express.Router();

router.route('/addstory').post(isAuthenticated,upload.single('media'),addNewStory);
router.route('/feed').get(isAuthenticated,getallUsersStory);
router.route('/me').get(isAuthenticated,getUserStory);
router.route('/:id').delete(isAuthenticated,deleteUserStory);
router.route('/:id/view').patch(isAuthenticated,markstoryAsViwed);
router.route('/:id/views').get(isAuthenticated,getStoryViewers);

export default router;