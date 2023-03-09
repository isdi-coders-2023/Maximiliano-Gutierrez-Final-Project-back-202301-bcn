import "../loadEnvironment.js";
import express from "express";
import cors from "cors";
import morgan from "morgan";
import usersRouter from "./routers/usersRouters/usersRouters.js";
import {
  generalError,
  notFoundError,
} from "./middlewares/errorMiddlewares/errorMiddlewares.js";
import options from "./cors.js";

export const app = express();

app.disable("x-powered-by");

app.use(cors(options));
app.use(morgan("dev"));
app.use(express.json());

app.use("/users", usersRouter);

app.use(notFoundError);
app.use(generalError);
