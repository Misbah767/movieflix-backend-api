import { User, RefreshToken, Otp } from "../models/index.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { sendEmail } from "../config/nodemailer.js";
import { auditLogger } from "../utils/auditLogger.js";
import { generateTokens } from "../utils/generateToken.js";
import {
  setAccountOtp,
  setResetOtp,
  persistRefreshToken,
} from "../utils/helpers/index.js";
import { validatePassword } from "../utils/validators/index.js";

/* ================= REGISTER ================= */
export const registerService = async ({
  name,
  email,
  password,
  role = "User",
}) => {
  const cleanEmail = email.trim().toLowerCase();

  if (await User.findOne({ email: cleanEmail }))
    throw new Error("User already exists");

  // ❗ Solid rule: Admin cannot be created via public API
  if (role === "Admin") {
    throw new Error("Admin account cannot be created via registration");
  }

  if (!validatePassword(password)) throw new Error("Weak password");

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await User.create({
    name,
    email: cleanEmail,
    password: hashedPassword,
    role: "User",
    isAccountVerified: false,
  });

  const { otp, otpExpiry } = await setAccountOtp(user);

  await sendEmail(
    cleanEmail,
    "Verify Your Account",
    "otp",
    { name, otp },
    true
  );

  auditLogger(user._id, "User registered");

  return {
    message: "Registration successful. OTP sent to email.",
    expiresAt: otpExpiry.getTime(),
  };
};

/* ================= VERIFY ACCOUNT OTP ================= */
export const verifyAccountOtpService = async ({ email, otp }) => {
  if (!email || !otp) throw new Error("Email and OTP required");

  const user = await User.findOne({ email: email.trim().toLowerCase() });
  if (!user) throw new Error("User not found");

  const otpDoc = await Otp.findOne({
    user: user._id,
    otp: String(otp),
    type: "verify",
    used: false,
  });

  if (!otpDoc) throw new Error("Invalid OTP");
  if (otpDoc.expiresAt < Date.now()) throw new Error("OTP expired");

  otpDoc.used = true;
  await otpDoc.save();

  user.isAccountVerified = true;
  await user.save();

  auditLogger(user._id, "Account verified");

  return { message: "Account verified successfully" };
};

/* ================= LOGIN ================= */
export const loginService = async ({ email, password }, ip, userAgent) => {
  const user = await User.findOne({ email: email.trim().toLowerCase() });
  if (!user) throw new Error("Invalid credentials");

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) throw new Error("Invalid credentials");

  if (!user.isAccountVerified)
    throw new Error("Please verify your account first");

  const { accessToken, refreshToken } = generateTokens(user._id);

  await persistRefreshToken({
    token: refreshToken,
    userId: user._id,
    ip,
    userAgent,
  });

  auditLogger(user._id, "User logged in");

  return { user, accessToken, refreshToken };
};

/* ================= LOGOUT ================= */
export const logoutService = async (refreshToken) => {
  if (!refreshToken) throw new Error("Refresh token missing");

  await RefreshToken.findOneAndUpdate(
    { token: refreshToken },
    { revoked: true, revokedAt: new Date() }
  );

  return { message: "Logged out successfully" };
};

/* ================= REFRESH TOKEN ================= */
export const refreshAccessTokenService = async (oldRefreshToken) => {
  if (!oldRefreshToken) throw new Error("No refresh token provided");

  let decoded;
  try {
    decoded = jwt.verify(oldRefreshToken, process.env.JWT_REFRESH_SECRET);
  } catch {
    throw new Error("Invalid refresh token");
  }

  const { accessToken, refreshToken } = generateTokens(decoded.id);

  await RefreshToken.findOneAndUpdate(
    { token: oldRefreshToken },
    {
      revoked: true,
      revokedAt: new Date(),
      replacedByToken: refreshToken,
    }
  );

  await persistRefreshToken({
    token: refreshToken,
    userId: decoded.id,
  });

  auditLogger(decoded.id, "Token refreshed");

  return { accessToken, refreshToken };
};

/* ================= FORGOT PASSWORD ================= */
export const forgotPasswordService = async ({ email }) => {
  const user = await User.findOne({ email: email.trim().toLowerCase() });
  if (!user) throw new Error("User not found");

  const { otp, otpExpiry } = await setResetOtp(user);

  await sendEmail(
    user.email,
    "Reset Password OTP",
    "reset",
    { name: user.name, otp },
    true
  );

  auditLogger(user._id, "Password reset requested");

  return { expiresAt: otpExpiry.getTime() };
};

/* ================= VERIFY RESET OTP ================= */
export const verifyResetOtpService = async ({ email, otp }) => {
  if (!email || !otp) throw new Error("Email and OTP required");

  const user = await User.findOne({ email: email.trim().toLowerCase() });
  if (!user) throw new Error("User not found");

  const otpDoc = await Otp.findOne({
    user: user._id,
    otp: String(otp),
    type: "reset",
    used: false,
  });

  if (!otpDoc) throw new Error("Invalid OTP");
  if (otpDoc.expiresAt < Date.now()) throw new Error("OTP expired");

  auditLogger(user._id, "Reset OTP verified");

  return { message: "OTP verified" };
};

/* ================= RESET PASSWORD ================= */
export const resetPasswordService = async ({ email, otp, password }) => {
  const user = await User.findOne({ email: email.trim().toLowerCase() });
  if (!user) throw new Error("User not found");

  const otpDoc = await Otp.findOne({
    user: user._id,
    otp: String(otp),
    type: "reset",
    used: false,
  });

  if (!otpDoc) throw new Error("Invalid OTP");
  if (otpDoc.expiresAt < Date.now()) throw new Error("OTP expired");

  if (!validatePassword(password)) throw new Error("Weak password");

  user.password = await bcrypt.hash(password, 10);
  await user.save();

  otpDoc.used = true;
  await otpDoc.save();

  auditLogger(user._id, "Password reset successful");

  return { message: "Password updated successfully" };
};

/* ================= RESEND OTPS ================= */
export const resendAccountOtpService = async ({ email }) => {
  const user = await User.findOne({ email: email.trim().toLowerCase() });
  if (!user) throw new Error("User not found");
  if (user.isAccountVerified) throw new Error("Account already verified");

  const { otp, otpExpiry } = await setAccountOtp(user);

  await sendEmail(
    user.email,
    "Resend Account OTP",
    "otp",
    { name: user.name, otp },
    true
  );

  return { expiresAt: otpExpiry.getTime() };
};

export const resendResetOtpService = async ({ email }) => {
  const user = await User.findOne({ email: email.trim().toLowerCase() });
  if (!user) throw new Error("User not found");

  const { otp, otpExpiry } = await setResetOtp(user);

  await sendEmail(
    user.email,
    "Resend Reset OTP",
    "reset",
    { name: user.name, otp },
    true
  );

  return { expiresAt: otpExpiry.getTime() };
};
