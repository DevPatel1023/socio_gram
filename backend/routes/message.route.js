import express from "express";
import isAuthenticated from "../middlewares/isAuthenticated.js";
import { getMessage, sendMesssage } from "../controllers/message.controller.js";
const router = express.Router();

// routes
router.route('/send/:id').post(isAuthenticated,sendMesssage);
router.route('/all/:id').get(isAuthenticated,getMessage);

export default router;
