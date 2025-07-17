import { Router } from "express";
import { authenticateToken } from "../../common/middlewares/auth.middleware.js";

import { addItemToCart, getCart, removeCartItem, updateCartItemQuantity } from "./cart.controller.js";

const cartRouter = Router();

cartRouter.get("/", authenticateToken, getCart);

cartRouter.post("/add-item", authenticateToken, addItemToCart);

cartRouter.delete("/remove-item/:variantId", authenticateToken, removeCartItem);

cartRouter.put(
  "/update-item",
  authenticateToken,
  updateCartItemQuantity
);

export default cartRouter;
