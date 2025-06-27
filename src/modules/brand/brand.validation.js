import { z } from "zod";

export const brandValidation = z.object({
  title: z
    .string()
    .min(3, "Tên danh mục phải có ít nhất 3 ký tự")
    .max(100, "Tên danh mục không vượt quá 100 ký tự"),

  logoBrand: z
    .string()
    .url("Logo phải là một URL hợp lệ")
    .optional()
    .or(z.literal("")), // Cho phép rỗng

  descriptionBrand: z
    .string()
    .max(1000, "Mô tả không vượt quá 1000 ký tự")
    .optional()
    .or(z.literal("")),

  slugBrand: z.string().min(1, "Slug phải có ít nhất 1 ký tự").optional(),

  position: z
    .number()
    .int("Vị trí phải là số nguyên")
    .min(0, "Thứ tự không được âm")
    .optional(),

  isActive: z.boolean().optional(),
});
