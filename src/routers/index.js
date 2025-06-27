import { Router } from "express";
import categoryRoutes from "../modules/category/category.routes.js";
import authRoutes from "../modules/auth/auth.routes.js";
import uploadRouter from "../modules/upload/upload.routes.js";
import attributeRoutes from "../modules/attribute/attribute.routes.js";
import subCategoryRoutes from "../modules/subCategory/subCategory.routes.js";
import brandRoutes from "../modules/brand/brand.routes.js";

const router = Router();

router.use("/upload", uploadRouter);

router.use("/auth", authRoutes);

router.use("/categories", categoryRoutes);
router.use("/sub-cate", subCategoryRoutes);
router.use("/brand", brandRoutes);

router.use("/attribute", attributeRoutes);

export default router;
