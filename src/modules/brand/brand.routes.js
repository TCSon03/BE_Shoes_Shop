import { Router } from "express";
import { brandValidation } from "./brand.validation.js";
import {
  createBrand,
  deleteBrand,
  getAllBrandByAdmin,
  getAllBrandByClient,
  getDetailBrand,
  restoreBrand,
  sortDeleteBrand,
  updateBrand,
} from "./brand.controller.js";
import validBodyRequest from "../../common/middlewares/validBodyRequest.js";

const brandRoutes = Router();

brandRoutes.get("/get-client", getAllBrandByClient);
brandRoutes.get("/get-admin", getAllBrandByAdmin);

brandRoutes.get("/:id", getDetailBrand);
brandRoutes.delete("/:id", deleteBrand);
brandRoutes.delete("/sort-delete/:id", sortDeleteBrand);
brandRoutes.patch("/restore/:id", restoreBrand);

brandRoutes.post("/", validBodyRequest(brandValidation), createBrand);
brandRoutes.patch("/:id", validBodyRequest(brandValidation), updateBrand);

export default brandRoutes;
