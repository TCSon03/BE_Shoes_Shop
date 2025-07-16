import { Router } from "express";
import { authenticateToken } from "../../common/middlewares/auth.middleware.js";

import { addItemToCart, getCart, removeCartItem } from "./cart.controller.js";

const cartRouter = Router();

cartRouter.get("/", authenticateToken, getCart);

cartRouter.post("/add-item", authenticateToken, addItemToCart);

cartRouter.delete("/remove-item/:variantId", authenticateToken, removeCartItem);

export default cartRouter;
