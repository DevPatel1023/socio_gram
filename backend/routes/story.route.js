import express from "express";
import isAuthenticated from "../middlewares/isAuthenticated";
import upload from "../middlewares/multer";
import { addNewStory, deleteUserStory, getallUsersStory, getUserStory, markstoryAsViwed } from "../controllers/story.controller";
const router = express.Router();

router.route('/addstory').post(isAuthenticated,upload.single('media'),addNewStory);
router.route('/feed').get(isAuthenticated,getallUsersStory);
router.route('/me').get(isAuthenticated,getUserStory);
router.route('/:id').delete(isAuthenticated,deleteUserStory);
router.route('/:id/view').patch(isAuthenticated,markstoryAsViwed);

export default router;