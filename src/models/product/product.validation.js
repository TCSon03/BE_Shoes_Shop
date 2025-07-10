import Joi from "joi";

export const createProductValidation = Joi.object({
  name: Joi.string().min(3).max(100).required().messages({
    "string.empty": "Product không được để trống",
    "string.min": "Product tối thiểu 3 kí tự",
    "string.max": "Product tối đa 100 kí tự",
  }),
  thumbnail: Joi.string().uri().allow("").messages({
    "string.uri": "Thumbnail phải là một đường dẫn hợp lệ",
  }),
  description: Joi.string().allow(""),
  slug: Joi.string().required().messages({
    "string.empty": "Slug không được để trống",
  }),
  brandId: Joi.string().required().messages({
    "string.empty": "Brand là bắt buộc",
  }),
  categoryId: Joi.string().required().messages({
    "string.empty": "Category là bắt buộc",
  }),
});

export const updateProductValidation = Joi.object({
  name: Joi.string().min(3).max(100).required().messages({
    "string.min": "Product tối thiểu 3 kí tự",
    "string.max": "Product tối đa 100 kí tự",
  }),
  thumbnail: Joi.string().uri().allow("").messages({
    "string.uri": "Thumbnail phải là một đường dẫn hợp lệ",
  }),
  description: Joi.string().allow(""),
  slug: Joi.string().required().messages({
    "string.empty": "Slug không được để trống",
  }),
  brandId: Joi.string().required().messages({
    "string.empty": "Brand là bắt buộc",
  }),
  categoryId: Joi.string().required().messages({
    "string.empty": "Category là bắt buộc",
  }),
});
