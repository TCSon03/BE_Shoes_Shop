import { z } from "zod";

export const categorySchema = z.object({
  title: z.string().min(3).max(50),
  description: z.string().min(5).max(200),
  slug: z.string().min(3).max(50),
});
