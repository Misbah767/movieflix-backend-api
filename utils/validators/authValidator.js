import Joi from "joi";

// ----------------- REGISTER VALIDATION -----------------
export const registerValidation = Joi.object({
  name: Joi.string().trim().max(100).required().messages({
    "string.empty": "Name is required",
    "string.max": "Name should not exceed 100 characters",
  }),
  email: Joi.string().email().required().messages({
    "string.empty": "Email is required",
    "string.email": "Valid email is required",
  }),
  password: Joi.string().required().messages({
    "string.empty": "Password is required",
  }),
  role: Joi.string().valid("Admin", "User").optional().messages({
    "any.only": "Invalid role",
  }),
});

// ----------------- LOGIN VALIDATION -----------------
export const loginValidation = Joi.object({
  email: Joi.string().email().required().messages({
    "string.empty": "Email is required",
    "string.email": "Valid email is required",
  }),
  password: Joi.string().required().messages({
    "string.empty": "Password is required",
  }),
});
