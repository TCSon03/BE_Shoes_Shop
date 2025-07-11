import Joi from "joi";

export const addToCartSchema = Joi.object({
  variantId: Joi.string().required().messages({
    "string.empty": "ID biến thể không được để trống",
    "any.required": "ID biến thể là bắt buộc",
  }),
  quantity: Joi.number().integer().min(1).required().messages({
    "number.base": "Số lượng phải là số nguyên",
    "number.min": "Số lượng phải lớn hơn hoặc bằng 1",
    "any.required": "Số lượng là bắt buộc",
  }),
});
