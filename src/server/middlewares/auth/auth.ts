import { type Response, type NextFunction } from "express";
import { CustomError } from "../../../CustomError/CustomError.js";
import {
  type CustomJwtPayload,
  type CustomRequestPlus,
} from "../../../types/types";
import jwt from "jsonwebtoken";

const auth = (req: CustomRequestPlus, res: Response, next: NextFunction) => {
  try {
    const authorizationHeader = req.header("Authorization");

    if (!authorizationHeader) {
      throw new Error("Authorization header is missing");
    }

    if (!authorizationHeader.startsWith("Bearer")) {
      throw new Error("Authorization header is not a Bearer token");
    }

    const token = authorizationHeader.replace(/^Bearer\s*/, "");

    const { sub: postedBy } = jwt.verify(
      token,
      process.env.JWT_SECRET!
    ) as CustomJwtPayload;

    req.userId = postedBy;

    next();
  } catch (error: unknown) {
    const tokenError = new CustomError(
      (error as Error).message,
      401,
      "Invalid token"
    );
    next(tokenError);
  }
};

export default auth;
