// validations/attributeValue.validation.js
import { z } from "zod";

export const attributeValueSchema = z.object({
  value: z
    .string()
    .min(1, "Giá trị không được để trống")
    .max(100, "Giá trị quá dài"),

  slugAttriValue: z.string().optional(),
  attributeId: z
    .string()
    .regex(/^[0-9a-fA-F]{24}$/, "ID thuộc tính không hợp lệ"),
});
