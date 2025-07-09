import Joi from "joi";

export const createValidation = Joi.object({
  name: Joi.string().min(3).max(100).required().messages({
    "string.empty": "Brand không được để trống",
    "string.min": "Brand tối thiểu 3 kí tự",
    "string.max": "Brand tối đa 100 kí tự",
  }),
  logo: Joi.string().uri().allow("").messages({
    "string.uri": "Logo phải là một đường dẫn hợp lệ",
  }),
  description: Joi.string().allow(""),
  slug: Joi.string().required().messages({
    "string.empty": "Slug không được để trống",
  }),
  isActive: Joi.boolean().default(true),
  position: Joi.number().default(0),
});
export const updateValidation = Joi.object({
  name: Joi.string().min(3).max(100).required().messages({
    "string.empty": "Brand không được để trống",
    "string.min": "Brand tối thiểu 3 kí tự",
    "string.max": "Brand tối đa 100 kí tự",
  }),
  logo: Joi.string().uri().allow("").messages({
    "string.uri": "Logo phải là một đường dẫn hợp lệ",
  }),
  description: Joi.string().allow(""),
  slug: Joi.string().required().messages({
    "string.empty": "Slug không được để trống",
  }),
  isActive: Joi.boolean(),
  position: Joi.number(),
});
