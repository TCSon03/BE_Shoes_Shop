import Joi from "joi";

export const orderItemJoiSchema = Joi.object({
  variantId: Joi.string()
    .pattern(/^[0-9a-fA-F]{24}$/)
    .required()
    .messages({
      "string.pattern.base": "Variant ID không hợp lệ.",
      "any.required": "Variant ID là bắt buộc.",
    }),
  quantity: Joi.number().integer().min(1).required().messages({
    "number.base": "Số lượng phải là một số.",
    "number.integer": "Số lượng phải là số nguyên.",
    "number.min": "Số lượng phải ít nhất là 1.",
    "any.required": "Số lượng là bắt buộc.",
  }),
  priceAtOrder: Joi.number().min(0).required().messages({
    "number.base": "Giá tại thời điểm đặt hàng phải là một số.",
    "number.min": "Giá tại thời điểm đặt hàng phải là số không âm.",
    "any.required": "Giá tại thời điểm đặt hàng là bắt buộc.",
  }),
  productName: Joi.string().trim().optional().allow(""), // Cho phép rỗng
  color: Joi.string().trim().optional().allow(""),
  size: Joi.number().integer().optional().allow(null),
  thumbnail: Joi.string().uri().optional().allow(""), // Kiểm tra định dạng URL
});

export const orderJoiSchema = Joi.object({
  shippingAddress: Joi.object({
    street: Joi.string().trim().min(3).max(255).required(),
    ward: Joi.string().trim().min(2).max(100).required(),
    district: Joi.string().trim().min(2).max(100).required(),
    city: Joi.string().trim().min(2).max(100).required(),
  }).required(),

  phoneNumber: Joi.string()
    .pattern(/^(0?)(3[2-9]|5[6|8|9]|7[0|6-9]|8[0-6|8|9]|9[0-4|6-9])[0-9]{7}$/)
    .required(),

  paymentMethod: Joi.string().valid("COD", "Online").required(),

  notes: Joi.string().trim().optional().allow(""),
});
