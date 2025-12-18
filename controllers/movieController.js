import {
  createMovieService,
  getMoviesService,
  getMovieByIdService,
  updateMovieService,
  deleteMovieService,
} from "../services/index.js";
import { sendSuccess } from "../utils/response.js";
import { catchAsync } from "../utils/catchAsync.js";

/* ================= CREATE MOVIE ================= */
export const createMovie = catchAsync(async (req, res) => {
  const movie = await createMovieService(req.body, req.user);
  sendSuccess(res, 201, "Movie created successfully", movie);
});

/* ================= GET MOVIES ================= */
export const getMovies = catchAsync(async (req, res) => {
  const movies = await getMoviesService(req.query);
  sendSuccess(res, 200, "Movies fetched successfully", movies);
});

/* ================= GET SINGLE MOVIE ================= */
export const getMovieById = catchAsync(async (req, res) => {
  const movie = await getMovieByIdService(req.params.id);
  sendSuccess(res, 200, "Movie fetched successfully", movie);
});

/* ================= UPDATE MOVIE ================= */
export const updateMovie = catchAsync(async (req, res) => {
  const movie = await updateMovieService(req.params.id, req.body, req.user);
  sendSuccess(res, 200, "Movie updated successfully", movie);
});

/* ================= DELETE MOVIE ================= */
export const deleteMovie = catchAsync(async (req, res) => {
  const result = await deleteMovieService(req.params.id, req.user);
  sendSuccess(res, 200, result.message, null);
});
