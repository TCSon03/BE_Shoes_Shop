import { z } from "zod";

export const registerValidation = z.object({
  fullName: z
    .string()
    .min(5, "FullName ít nhất 5 ký tự")
    .max(50, "FullName tối đa 50 ký tự"),

  email: z
    .string()
    .email("Email không hợp lệ")
    .min(5, "Email ít nhất 5 ký tự")
    .max(100, "Email tối đa 100 ký tự"),

  password: z
    .string()
    .min(6, "Password ít nhất 6 ký tự")
    .max(100, "Password tối đa 100 ký tự"),

  avatarUrl: z.string().url("Avatar URL không hợp lệ").optional(),

  gender: z.enum(["male", "female", "other"], "Gender không hợp lệ").optional(),

  address: z.array(z.string()).optional(),

  bio: z.string().max(500, "Bio tối đa 500 ký tự").optional(),

  role: z
    .enum(["Admin", "Member", "SuperAdmin", "Manager"], "Role không hợp lệ")
    .default("Member")
    .optional(),

  phoneNumber: z.string().optional(),
});

export const loginValidation = z.object({
  email: z
    .string()
    .email("Email không hợp lệ")
    .min(5, "Email ít nhất 5 ký tự")
    .max(100, "Email tối đa 100 ký tự"),
  password: z
    .string()
    .min(6, "Password ít nhất 6 ký tự")
    .max(100, "Password tối đa 100 ký tự"),
});
