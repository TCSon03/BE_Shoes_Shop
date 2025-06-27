import { Router } from "express";
import {
  createProduct,
  deleteProduct,
  getAllProductByAdmin,
  getAllProductByClient,
  getDetailProduct,
  restoreProduct,
  sortDeleteProduct,
  updateProduct,
} from "./product.controller.js";

const productRoutes = Router();

productRoutes.get("/", getAllProductByAdmin);
productRoutes.get("/", getAllProductByClient);
productRoutes.get("/:id", getDetailProduct);
productRoutes.put("/:id", updateProduct);
productRoutes.delete("/:id", deleteProduct);
productRoutes.patch("/restore/:id", restoreProduct);
productRoutes.post("/", createProduct);
productRoutes.patch("/sort-delete/:id", sortDeleteProduct);
export default productRoutes;
