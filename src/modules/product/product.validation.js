import { z } from "zod";

export const productValidation = z.object({
  title: z
    .string()
    .min(1, "Tên sản phẩm không được để trống")
    .max(100, "Tên sản phẩm không vượt quá 100 ký tự"),

  slugPro: z.string().optional(),

  shortDescription: z.string().optional().default(""),

  description: z.string().optional().default(""),

  thumbnail: z
    .string()
    .url("Ảnh đại diện phải là một URL hợp lệ")
    .optional()
    .or(z.literal("")),

  brandId: z.string().optional(),
  subCategoryId: z.string().optional(),
});
