import "../loadEnvironment.js";
import express from "express";
import cors from "cors";
import morgan from "morgan";

export const app = express();

const allowedOrigins = [
  process.env.ALLOWED_ORIGINS_LOCAL!,
  process.env.ALLOWED_ORIGINS_PROD!,
];

const options: cors.CorsOptions = {
  origin: allowedOrigins,
};

app.disable("x-powered-by");

app.use(cors(options));
app.use(morgan("dev"));
app.use(express.json());
