import { Router } from "express";
import categoryRoutes from "../modules/category/category.routes.js";
import authRoutes from "../modules/auth/auth.routes.js";
import uploadRouter from "../modules/upload/upload.routes.js";

const router = Router();

router.use("/upload",uploadRouter);

router.use("/auth", authRoutes);

router.use("/categories", categoryRoutes);

export default router;
