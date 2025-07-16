import Joi from "joi";
import mongoose from "mongoose";

const objectId = Joi.string().custom((value, helpers) => {
  if (!mongoose.Types.ObjectId.isValid(value)) {
    return helpers.error("any.invalid");
  }
  return value;
}, "ObjectId validation");

export const addItemToCartSchema = Joi.object({
  variantId: objectId.required().messages({
    "any.required": "ID biến thể là bắt buộc.",
    "any.invalid": "ID biến thể không hợp lệ.",
  }),
  quantity: Joi.number().integer().min(1).required().messages({
    "any.required": "Số lượng là bắt buộc.",
    "number.base": "Số lượng phải là số.",
    "number.integer": "Số lượng phải là số nguyên.",
    "number.min": "Số lượng phải lớn hơn hoặc bằng 1.",
  }),
});
export const updateCartItemQuantitySchema = Joi.object({
  variantId: objectId.required().messages({
    "any.required": "ID biến thể là bắt buộc.",
    "any.invalid": "ID biến thể không hợp lệ.",
  }),
  newQuantity: Joi.number().integer().min(0).required().messages({
    // min(0) để cho phép xóa item bằng cách set quantity về 0
    "any.required": "Số lượng mới là bắt buộc.",
    "number.base": "Số lượng mới phải là số.",
    "number.integer": "Số lượng mới phải là số nguyên.",
    "number.min": "Số lượng mới phải lớn hơn hoặc bằng 0.",
  }),
});
