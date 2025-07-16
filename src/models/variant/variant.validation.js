// validations/variant.validation.js
import Joi from "joi";

const colors = ["Red", "Blue", "Black", "White", "Green"];
const sizes = [38, 39, 40, 41, 42, 43, 44];

export const variantValidation = Joi.object({
  productId: Joi.string()
    .regex(/^[0-9a-fA-F]{24}$/)
    .required()
    .messages({
      "string.pattern.base": "productId không hợp lệ",
      "any.required": "productId là bắt buộc",
    }),
  color: Joi.string()
    .valid(...colors)
    .required()
    .messages({
      "any.only": `Color phải thuộc một trong: ${colors.join(", ")}`,
      "any.required": "Color là bắt buộc",
    }),
  size: Joi.number()
    .valid(...sizes)
    .required()
    .messages({
      "any.only": `Size phải là một trong: ${sizes.join(", ")}`,
      "any.required": "Size là bắt buộc",
    }),
  price: Joi.number().min(1).required().messages({
    "number.base": "Giá phải là số",
    "number.min": "Giá phải lớn hơn hoặc bằng 1",
    "any.required": "Giá là bắt buộc",
  }),
  stock: Joi.number().integer().min(0).default(0).messages({
    "number.base": "Tồn kho phải là số",
    "number.min": "Tồn kho không được âm",
  }),
  image: Joi.string().uri().optional().messages({
    "string.uri": "URL ảnh không hợp lệ",
  }),
});

export const updateVariantValidation = Joi.object({
  color: Joi.string()
    .valid(...colors)
    .required()
    .messages({
      "any.only": `Color phải thuộc một trong: ${colors.join(", ")}`,
      "any.required": "Color là bắt buộc",
    }),
  size: Joi.number()
    .valid(...sizes)
    .required()
    .messages({
      "any.only": `Size phải là một trong: ${sizes.join(", ")}`,
      "any.required": "Size là bắt buộc",
    }),
  price: Joi.number().min(1).required().messages({
    "number.base": "Giá phải là số",
    "number.min": "Giá phải lớn hơn hoặc bằng 1",
    "any.required": "Giá là bắt buộc",
  }),
  stock: Joi.number().integer().min(0).default(0).messages({
    "number.base": "Tồn kho phải là số",
    "number.min": "Tồn kho không được âm",
  }),
  image: Joi.string().uri().optional().messages({
    "string.uri": "URL ảnh không hợp lệ",
  }),
});
