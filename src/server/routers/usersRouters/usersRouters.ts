import { Router } from "express";
import { validate } from "express-validation";
import { loginUser } from "../../controllers/usersControllers/usersControllers.js";
import routes from "../routes.js";
import loginUserSchema from "../../schemas/loginUserSchema.js";

const { login } = routes.users;

const usersRouter = Router();

usersRouter.post(
  login,
  validate(loginUserSchema, {}, { abortEarly: false }),
  loginUser
);

export default usersRouter;
