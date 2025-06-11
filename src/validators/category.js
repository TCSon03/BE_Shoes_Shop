import Joi from "joi";

export const categorySchema = Joi.object({
  title: Joi.string().min(3).max(50).required().messages({
    "string.base": "Title must be a string",
    "string.empty": "Title cannot be empty",
    "string.min": "Title must be at least 3 characters long",
    "string.max": "Title must not exceed 50 characters",
    "any.required": "Title is required",
  }),

  description: Joi.string().min(5).max(200).required().messages({
    "string.base": "Description must be a string",
    "string.empty": "Description cannot be empty",
    "string.min": "Description must be at least 5 characters long",
    "string.max": "Description must not exceed 200 characters",
    "any.required": "Description is required",
  }),

  slug: Joi.string().min(3).max(50).required().messages({
    "string.base": "Slug must be a string",
    "string.empty": "Slug cannot be empty",
    "string.min": "Slug must be at least 3 characters long",
    "string.max": "Slug must not exceed 50 characters",
    "any.required": "Slug is required",
  }),
});
