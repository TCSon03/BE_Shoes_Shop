import { Router } from "express";
import categoryRoutes from "../modules/category/category.routes.js";
import authRoutes from "../modules/auth/auth.routes.js";

const router = Router();

router.use("/auth", authRoutes);

router.use("/categories", categoryRoutes);

export default router;
