// ----------------- Auth Services -----------------
export {
  registerService,
  loginService,
  verifyAccountOtpService,
  forgotPasswordService,
  verifyResetOtpService,
  resetPasswordService,
  refreshAccessTokenService,
  logoutService,
  resendAccountOtpService,
  resendResetOtpService,
} from "./authService.js";

// ----------------- User Services -----------------
export {
  getUserProfileService,
  updateUserProfileService,
} from "./userService.js";

// ----------------- Movie Services -----------------
export {
  createMovieService,
  getMoviesService,
  getMovieByIdService,
  updateMovieService,
  deleteMovieService,
} from "./movieService.js";
