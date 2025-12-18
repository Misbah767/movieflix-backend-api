import express from "express";
import {
  createMovie,
  getMovies,
  getMovieById,
  updateMovie,
  deleteMovie,
} from "../controllers/index.js";
import { userAuth, roleAuth } from "../middleware/index.js";

const router = express.Router();

// ----------------- PUBLIC -----------------
router.get("/", getMovies);
router.get("/:id", getMovieById);

// ----------------- PROTECTED (Admin Only) -----------------
router.post("/", userAuth, roleAuth(["Admin"]), createMovie);
router.put("/:id", userAuth, roleAuth(["Admin"]), updateMovie);
router.delete("/:id", userAuth, roleAuth(["Admin"]), deleteMovie);

export default router;

// for pagination http://localhost:5000/api/movies?page=2&limit=5
// for sorting Oldest first: /api/movies?sort=-createdAt
// Rating high to low: GET /api/movies?sort=-stats.
// for search http://localhost:5000/api/movies?search=room
// for filteration GET /api/movies?genre=Action ,
// GET /api/movies?genre=Action&language=English&isPublished=true
// combine everything
// GET /api/movies?
// genre=Action
// &language=English
// &sort=-createdAt
// &page=2
// &limit=5
