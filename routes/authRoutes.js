import express from "express";
import {
  registerUser,
  loginUser,
  verifyAccountOtp,
  forgotPassword,
  verifyResetOtp,
  resetPassword,
  resendAccountOtp,
  resendResetOtp,
  refreshAccessToken,
  logout,
} from "../controllers/index.js";

import {
  registerValidation,
  loginValidation,
} from "../utils/validators/authValidator.js";

import { userAuth, validate } from "../middleware/index.js";

const router = express.Router();

// PUBLIC
router.post("/register", validate(registerValidation), registerUser);
router.post("/login", validate(loginValidation), loginUser);
router.post("/verify-account", verifyAccountOtp);
router.post("/resend-account-otp", resendAccountOtp);

router.post("/forgot-password", forgotPassword);
router.post("/verify-reset-otp", verifyResetOtp);
router.post("/resend-reset-otp", resendResetOtp);
router.post("/reset-password", resetPassword);

// AUTH
router.post("/refresh", refreshAccessToken);
router.post("/logout", userAuth, logout);

export default router;
