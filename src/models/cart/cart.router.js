import { Router } from "express";
import { authenticateToken } from "../../common/middlewares/auth.middleware.js";
import { createCart, deleteCart, getCart, updateCart } from "./cart.controller.js";
import validation from "../../common/middlewares/validatie.middleware.js";
import { addToCartSchema } from "./cart.validation.js";

const cartRouter = Router();

cartRouter.get("/", authenticateToken, getCart);

cartRouter.delete(
  "/delete-cart/:variantId",
  authenticateToken,
  deleteCart
);

cartRouter.post(
  "/create-cart",
  authenticateToken,
  validation(addToCartSchema),
  createCart
);
cartRouter.put(
  "/update-cart",
  authenticateToken,
  validation(addToCartSchema),
  updateCart
);

export default cartRouter;
