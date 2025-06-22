import { Router } from "express";
import validBodyRequest from "../../common/middlewares/validBodyRequest.js";
import { loginValidation, registerValidation } from "./auth.validation.js";
import { authLogin, authRegister } from "./auth.controller.js";

const authRoutes = Router();

authRoutes.post(
  "/register",
  validBodyRequest(registerValidation),
  authRegister
);
authRoutes.post("/login", validBodyRequest(loginValidation), authLogin);

export default authRoutes;
