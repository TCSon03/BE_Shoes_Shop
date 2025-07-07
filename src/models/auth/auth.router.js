import { Router } from "express";
import { loginUser, registerUser } from "./auth.controller.js";
import { loginValidation, registerValidation } from "./auth.validation.js";
import validation from "./../../common/middlewares/validatie.middleware.js";

const authRouter = Router();

authRouter.post("/register", validation(registerValidation), registerUser);
authRouter.post("/login", validation(loginValidation), loginUser);

export default authRouter;
