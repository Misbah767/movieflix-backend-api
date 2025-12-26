import { Movie } from "../models/index.js";
import {
  buildQuery,
  buildOptions,
  checkAdmin,
} from "../utils/helpers/index.js";

/* ================= CREATE MOVIE ================= */
export const createMovieService = async (data, user) => {
  checkAdmin(user); // Admin only

  const movie = await Movie.create({
    ...data,
    createdBy: user._id,
  });

  return movie;
};

/* ================= GET MOVIES (Advanced Query) ================= */
export const getMoviesService = async (queryParams) => {
  const allowedFilters = ["genre", "language", "isPublished"];

  const query = buildQuery(queryParams, allowedFilters);
  const options = buildOptions(queryParams);

  const movies = await Movie.find(query, options.projection)
    .sort(options.sort)
    .skip(options.skip)
    .limit(options.limit)
    .populate("createdBy", "name email role");

  const total = await Movie.countDocuments(query);

  return {
    page: options.page,
    limit: options.limit,
    total,
    totalPages: Math.ceil(total / options.limit),
    data: movies,
  };
};

/* ================= GET SINGLE MOVIE ================= */
export const getMovieByIdService = async (id) => {
  const movie = await Movie.findById(id).populate(
    "createdBy",
    "name email role"
  );

  if (!movie) throw new Error("Movie not found");

  return movie;
};

/* ================= UPDATE MOVIE ================= */
export const updateMovieService = async (id, data, user) => {
  const movie = await Movie.findById(id);
  if (!movie) throw new Error("Movie not found");

  checkAdmin(user); // Admin only

  Object.assign(movie, data);
  await movie.save();

  return movie;
};

/* ================= DELETE MOVIE ================= */
export const deleteMovieService = async (id, user) => {
  const movie = await Movie.findById(id);
  if (!movie) throw new Error("Movie not found");

  checkAdmin(user); // Admin only

  await movie.deleteOne();

  return { message: "Movie deleted successfully" };
};
