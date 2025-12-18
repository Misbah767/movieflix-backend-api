import express from "express";
import {
  getUserProfile,
  updateUserProfile,
} from "../controllers/userController.js";
import { userAuth } from "../middleware/index.js";

const router = express.Router();

// GET user profile
router.get("/profile", userAuth, getUserProfile);

// UPDATE user profile
router.put("/profile", userAuth, updateUserProfile);

export default router;
