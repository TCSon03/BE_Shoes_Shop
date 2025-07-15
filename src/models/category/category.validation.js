import Joi from "joi";

export const createCateValidation = Joi.object({
  name: Joi.string().min(3).max(100).required().messages({
    "string.empty": "Category không được để trống",
    "string.min": "Category tối thiểu 3 kí tự",
    "string.max": "Category tối đa 100 kí tự",
  }),
  logo: Joi.string().uri().allow("").messages({
    "string.uri": "Logo phải là một đường dẫn hợp lệ",
  }),
  description: Joi.string().allow(""),
  slug: Joi.string().required().messages({
    "string.empty": "Slug không được để trống",
  }),

});
export const updateCateValidation = Joi.object({
  name: Joi.string().min(3).max(100).required().messages({
    "string.empty": "Category không được để trống",
    "string.min": "Category tối thiểu 3 kí tự",
    "string.max": "Category tối đa 100 kí tự",
  }),
  logo: Joi.string().uri().allow("").messages({
    "string.uri": "Logo phải là một đường dẫn hợp lệ",
  }),
  description: Joi.string().allow(""),
  slug: Joi.string().required().messages({
    "string.empty": "Slug không được để trống",
  }),
});
