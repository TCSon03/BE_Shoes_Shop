import { Router } from "express";
import {
  createCategory,
  deleteCategory,
  getAllCategoryByAdmin,
  getAllCategoryByClient,
  getDetailCategory,
  restoreCategory,
  sortDeleteCategory,
  updateCategory,
} from "./category.controller.js";
import { categoryValidation } from "./category.validation.js";
import validBodyRequest from "./../../common/middlewares/validBodyRequest.js";

const categoryRoutes = Router();

categoryRoutes.get("/get-client", getAllCategoryByClient);
categoryRoutes.get("/get-admin", getAllCategoryByAdmin);

categoryRoutes.get("/:id", getDetailCategory);
categoryRoutes.delete("/:id", deleteCategory);
categoryRoutes.delete("/sort-delete/:id", sortDeleteCategory);
categoryRoutes.patch("/restore/:id", restoreCategory);

categoryRoutes.post("/", validBodyRequest(categoryValidation), createCategory);
categoryRoutes.patch(
  "/:id",
  validBodyRequest(categoryValidation),
  updateCategory
);

export default categoryRoutes;
