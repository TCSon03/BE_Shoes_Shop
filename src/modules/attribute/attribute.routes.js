import { Router } from "express";
import validBodyRequest from "../../common/middlewares/validBodyRequest.js";
import { attributeValidation } from "./attribute.validation.js";
import {
  createAttribute,
  deleteAttribute,
  getAllAttributeByAdmin,
  getDetailAttribute,
  updateAttribute,
} from "./attribute.controller.js";

const attributeRoutes = Router();

attributeRoutes.get("/", getAllAttributeByAdmin);
attributeRoutes.get("/:id", getDetailAttribute);
attributeRoutes.delete("/:id", deleteAttribute);

attributeRoutes.post(
  "/",
  validBodyRequest(attributeValidation),
  createAttribute
);
attributeRoutes.put(
  "/:id",
  validBodyRequest(attributeValidation),
  updateAttribute
);

export default attributeRoutes;
