import { Router } from "express";
import authRouter from "../models/auth/auth.router.js";
import brandRouter from "../models/brand/brand.router.js";
import categoryRouter from "../models/category/category.router.js";
import productRouter from "../models/product/product.router.js";
import variantRouter from "../models/variant/variant.router.js";
import cartRouter from "../models/cart/cart.router.js";
import orderRouter from "../models/order/order.router.js";
import paymentRouter from "../models/payment/payment.router.js";

const router = Router();

router.use("/auth", authRouter);
router.use("/brand", brandRouter);
router.use("/cate", categoryRouter);
router.use("/products", productRouter);
router.use("/variants", variantRouter);
router.use("/cart", cartRouter);
router.use("/orders", orderRouter);
router.use("/payment", paymentRouter);

export default router;
