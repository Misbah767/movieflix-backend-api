import {
  registerService,
  loginService,
  verifyAccountOtpService,
  forgotPasswordService,
  verifyResetOtpService,
  resetPasswordService,
  resendAccountOtpService,
  resendResetOtpService,
  refreshAccessTokenService,
  logoutService,
} from "../services/index.js";
import { sendSuccess } from "../utils/response.js";
import { catchAsync } from "../utils/catchAsync.js";

// REGISTER
export const registerUser = catchAsync(async (req, res) => {
  const result = await registerService(req.body);
  sendSuccess(res, 201, "User registered successfully", result);
});

// LOGIN
export const loginUser = catchAsync(async (req, res) => {
  const { user, accessToken, refreshToken } = await loginService(
    req.body,
    req.ip,
    req.headers["user-agent"]
  );

  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
  });

  sendSuccess(res, 200, "Login successful", { user, accessToken });
});

// REFRESH TOKEN
export const refreshAccessToken = catchAsync(async (req, res) => {
  const data = await refreshAccessTokenService(req.cookies.refreshToken);

  res.cookie("refreshToken", data.refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
  });

  sendSuccess(res, 200, "Token refreshed", {
    accessToken: data.accessToken,
  });
});

// LOGOUT
export const logout = catchAsync(async (req, res) => {
  await logoutService(req.cookies.refreshToken);
  res.clearCookie("refreshToken");
  sendSuccess(res, 200, "Logged out successfully");
});

// OTP & PASSWORD
export const verifyAccountOtp = catchAsync(async (req, res) => {
  const data = await verifyAccountOtpService(req.body);
  sendSuccess(res, 200, "Account verified", data);
});

export const resendAccountOtp = catchAsync(async (req, res) => {
  const data = await resendAccountOtpService(req.body);
  sendSuccess(res, 200, "Account OTP resent", data);
});

export const forgotPassword = catchAsync(async (req, res) => {
  const data = await forgotPasswordService(req.body);
  sendSuccess(res, 200, "Reset OTP sent", data);
});

export const verifyResetOtp = catchAsync(async (req, res) => {
  const data = await verifyResetOtpService(req.body);
  sendSuccess(res, 200, "Reset OTP verified", data);
});

export const resetPassword = catchAsync(async (req, res) => {
  const data = await resetPasswordService(req.body);
  sendSuccess(res, 200, "Password reset successful", data);
});

export const resendResetOtp = catchAsync(async (req, res) => {
  const data = await resendResetOtpService(req.body);
  sendSuccess(res, 200, "Reset OTP resent", data);
});
