import {
  getUserProfileService,
  updateUserProfileService,
} from "../services/index.js";
import { sendSuccess } from "../utils/response.js";
import { catchAsync } from "../utils/catchAsync.js";

export const getUserProfile = catchAsync(async (req, res) => {
  const userData = await getUserProfileService(req.user);
  sendSuccess(res, 200, "User profile fetched successfully", userData);
});

export const updateUserProfile = catchAsync(async (req, res) => {
  const { name, password } = req.body;
  const updatedData = await updateUserProfileService(req.user, {
    name,
    password,
  });

  sendSuccess(res, 200, "Profile updated successfully", updatedData);
});
