import "../loadEnvironment.js";
import type cors from "cors";

const allowedOrigins = [
  process.env.ALLOWED_ORIGINS_LOCAL!,
  process.env.ALLOWED_ORIGINS_PROD!,
];

const options: cors.CorsOptions = {
  origin: allowedOrigins,
};

export default options;
