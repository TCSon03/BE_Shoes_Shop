import { z } from "zod";

export const attributeValidation = z.object({
  name: z
    .string()
    .min(2, "Tên thuộc tính phải có ít nhất 2 ký tự")
    .max(50, "Tên thuộc tính không vượt quá 50 ký tự"),
  slug: z
    .string()
    .min(1, "Slug không được để trống")
    .optional()
});
