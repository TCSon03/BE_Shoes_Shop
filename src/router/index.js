import { Router } from "express";
import authRouter from "../models/auth/auth.router.js";
import brandRouter from "../models/brand/brand.router.js";
import categoryRouter from "../models/category/category.router.js";
import productRouter from "../models/product/product.router.js";
import variantRouter from "../models/variant/variant.router.js";

const router = Router();

router.use("/auth", authRouter);
router.use("/brand", brandRouter);
router.use("/cate", categoryRouter);
router.use("/products", productRouter);
router.use("/products", variantRouter);

export default router;
