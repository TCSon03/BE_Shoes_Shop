import { z } from "zod";

export const categorySchema = z.object({
  title: z
    .string()
    .min(3, "Tiêu đề không được để trống")
    .max(100, "Tiêu đề không được quá 100 ký tự"),
  logoCategory: z.string().url("URL ảnh logo không hợp lệ").optional(),
  descriptionCategory: z
    .string()
    .max(500, "Mô tả không được quá 500 ký tự")
    .optional(),
  slugCategory: z
    .string()
    .min(3, "Slug không được để trống")
    .max(100, "Slug không được quá 100 ký tự"),
  isActive: z.boolean().optional(),
  position: z
    .number()
    .int()
    .min(0, "Vị trí phải là số nguyên không âm")
    .optional(),
});
