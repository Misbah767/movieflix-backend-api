// --------- Auth Controllers ---------
export {
  registerUser,
  loginUser,
  verifyAccountOtp,
  resendAccountOtp,
  forgotPassword,
  verifyResetOtp,
  resendResetOtp,
  resetPassword,
  refreshAccessToken,
  logout,
} from "./authController.js";

// --------- User Controllers ---------
export { getUserProfile, updateUserProfile } from "./userController.js";

// --------- Movie Controllers ---------
export {
  createMovie,
  getMovies,
  getMovieById,
  updateMovie,
  deleteMovie,
} from "./movieController.js";
