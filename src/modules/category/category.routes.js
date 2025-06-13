import { Router } from "express";
import {
  createCategory,
  deleteCategory,
  getAllCategory,
  getDetailCategory,
  restoreCategory,
  sortDeleteCategory,
  updateCategory,
} from "./category.controller.js";
import validBodyRequest from "../../common/middlewares/validBodyRequest.js";
import { categorySchema } from "./category.validation.js";

const categoryRoutes = Router();

categoryRoutes.get("/", getAllCategory);

categoryRoutes.get("/:id", getDetailCategory);
categoryRoutes.delete("/:id", deleteCategory);
categoryRoutes.delete("/sort-delete/:id", sortDeleteCategory);
categoryRoutes.patch("/restore/:id", restoreCategory);

categoryRoutes.use(validBodyRequest(categorySchema))
categoryRoutes.post("/", createCategory);
categoryRoutes.patch("/:id", updateCategory);

export default categoryRoutes;
