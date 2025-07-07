import Joi from "joi";

export const userValidation = Joi.object({
  name: Joi.string().min(5).max(100).required().message({
    "any.required": "Vui lòng nhập Name",
    "string.empty": "Name không được để trống",
    "string.min": "Name tối thiểu 5 kí tự",
    "string.max": "Name tối đa 100 kí tự",
  }),
  email: Joi.string().email().required().message({
    "any.required": "Vui lòng nhập Email",
    "string.email": "Email không hợp lệ",
  }),
  password: Joi.string()
    .min(6)
    .pattern(/^[A-Z]/, { name: "bắt đầu bằng chữ in hoa" })
    .pattern(/[^A-Za-z0-9]/, { name: "chứa ít nhất một kí tự đặc biệt" })
    .required()
    .message({
      "any.required": "Vui lòng nhập Pass",
      "string.min": "Pass tối thiểu 6 kí tự",
      "string.pattern.name": "Pass phải {#name}",
    }),

  phone: Joi.string()
    .pattern(/^[0-9]{10}$/)
    .required()
    .message({
      "any.required": "Vui lòng nhập Phone",
      "string.pattern.base": "Phone phải có 10 chữ số",
    }),

  address: Joi.object({
    street: Joi.string().allow("").optional(),
    ward: Joi.string().allow("").optional(),
    district: Joi.string().allow("").optional(),
    city: Joi.string().allow("").optional(),
  }).optional(),
  avatar: Joi.string().uri().optional().message({
    "string.uri": "Avatar phải là một đường dẫn hợp lệ",
  }),
  gender: Joi.string().valid("male", "female", "other").optional().message({
    "any.only": "Gioi tính không hợp lệ",
  }),
  role: Joi.string()
    .valid("member", "manager", "admin", "superAdmin")
    .optional()
    .message({
      "any.only": "Vai trò không hợp lệ",
    }),
});

