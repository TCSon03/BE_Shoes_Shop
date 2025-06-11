import { Router } from "express";
import {
  createCategory,
  deleteCategory,
  getAllCategory,
  getDetailCategory,
  restoreCategory,
  sortDeleteCategory,
  updateCategory,
} from "../controllers/categoryController.js";

const categoryRoutes = Router();

categoryRoutes.post("/", createCategory);
categoryRoutes.get("/", getAllCategory);
categoryRoutes.get("/:id", getDetailCategory);
categoryRoutes.patch("/:id", updateCategory);
categoryRoutes.delete("/:id", deleteCategory);
categoryRoutes.delete("/sort-delete/:id", sortDeleteCategory);
categoryRoutes.patch("/restore/:id", restoreCategory);

export default categoryRoutes;
