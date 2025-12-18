import express from "express";
import authRoutes from "./authRoutes.js";
import userRoutes from "./userRoutes.js";
import movieRoutes from "./movieRoutes.js";

const router = express.Router();

// ----------------- AUTH ROUTES -----------------
router.use("/auth", authRoutes);

// ----------------- USER ROUTES -----------------
router.use("/users", userRoutes);

// ----------------- MOVIE ROUTES -----------------
router.use("/movies", movieRoutes);

export default router;
