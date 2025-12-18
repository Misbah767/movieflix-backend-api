import bcrypt from "bcryptjs";
import { validatePassword } from "../utils/validators/index.js";
import { auditLogger } from "../utils/auditLogger.js";

// ----------------- GET USER PROFILE -----------------
export const getUserProfileService = async (user) => {
  return {
    id: user._id,
    name: user.name,
    email: user.email, // read-only
    role: user.role, // read-only
    isAccountVerified: user.isAccountVerified,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
  };
};

// ----------------- UPDATE USER PROFILE -----------------
export const updateUserProfileService = async (user, { name, password }) => {
  if (!name && !password) {
    throw new Error("No changes provided");
  }

  //  Allow name update
  if (name) {
    user.name = name.trim();
  }

  // Allow password update with validations
  if (password) {
    if (!validatePassword(password)) {
      throw new Error("Password does not meet complexity requirements");
    }

    const isSamePassword = await bcrypt.compare(password, user.password);
    if (isSamePassword) {
      throw new Error("New password must be different from old password");
    }

    user.password = await bcrypt.hash(password, 10);
  }

  await user.save();
  auditLogger(user._id, "User profile updated");

  return {
    id: user._id,
    name: user.name,
    email: user.email,
  };
};
