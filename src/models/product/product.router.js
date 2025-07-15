import { Router } from "express";
import {
  createProduct,
  deleteProduct,
  getAllDeletedProducts,
  getAllProduct,
  getProductById,
  restoreProduct,
  sortDeleteProduct,
  updateProduct,
} from "./product.controller.js";
import validation from "./../../common/middlewares/validatie.middleware.js";
import {
  createProductValidation,
  updateProductValidation,
} from "./product.validation.js";
import { authenticateToken } from "../../common/middlewares/auth.middleware.js";
import { authorizeRoles } from "../../common/middlewares/authorization.middleware.js";

const productRouter = Router();

productRouter.get("/", getAllProduct);
productRouter.get("/get-soft", getAllDeletedProducts);
productRouter.get("/:id", getProductById);
productRouter.delete(
  "/delete-pro/:id",
  authenticateToken,
  authorizeRoles("admin", "superAdmin"),
  deleteProduct
);

productRouter.delete(
  "/sort-pro/:id",
  authenticateToken,
  authorizeRoles("admin", "superAdmin"),
  sortDeleteProduct
);
productRouter.put(
  "/restore-pro/:id",
  authenticateToken,
  authorizeRoles("admin", "superAdmin"),
  restoreProduct
);

productRouter.post(
  "/create-pro",
  authenticateToken,
  authorizeRoles("admin", "superAdmin"),
  validation(createProductValidation),
  createProduct
);
productRouter.put(
  "/update-pro/:id",
  authenticateToken,
  authorizeRoles("admin", "superAdmin"),
  validation(updateProductValidation),
  updateProduct
);

export default productRouter;
