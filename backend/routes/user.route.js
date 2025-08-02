import express from 'express';
import { editProfile, findSearchedUsers, followOrUnfollow, getInboxUsers, getProfile, getSuggestedUsers, login, logout, register } from '../controllers/user.controller.js';
import isAuthenticated from '../middlewares/isAuthenticated.js';
import upload from '../middlewares/multer.js';

const router = express.Router();

router.route('/register').post(register);
router.route('/login').post(login);
router.route('/logout').get(logout);
router.route('/:id/profile').get(isAuthenticated,getProfile);
router.route('/profile/edit').patch(isAuthenticated,upload.single('profilePicture'),editProfile);
router.route('/suggesteduser').get(isAuthenticated,getSuggestedUsers);
router.route('/followorunfollow/:id').post(isAuthenticated,followOrUnfollow);
router.route('/inbox').get(isAuthenticated,getInboxUsers);
router.route('/users').get(isAuthenticated,findSearchedUsers);


export default router;