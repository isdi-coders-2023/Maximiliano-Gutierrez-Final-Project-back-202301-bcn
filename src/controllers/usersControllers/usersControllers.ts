import { type UserCredentials } from "../../server/types";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { type NextFunction, type Request, type Response } from "express";
import User from "../../database/models/User.js";
import { CustomError } from "../../CustomError/CustomError";
import { type CustomJwtPayload } from "./types";

export const loginUser = async (
  req: Request<
    Record<string, unknown>,
    Record<string, unknown>,
    UserCredentials
  >,
  res: Response,
  next: NextFunction
) => {
  const { password, email } = req.body;

  const userToFind = email.toString();

  try {
    const user = await User.findOne({ email: userToFind }).exec();

    if (!user) {
      const error = new CustomError(
        "Wrong credentials",
        401,
        "Wrong credentials"
      );

      next(error);

      return;
    }

    if (!(await bcrypt.compare(password, user.password))) {
      const error = new CustomError(
        "Wrong credentials",
        401,
        "Wrong credentials"
      );

      next(error);

      return;
    }

    const jwtPayload: CustomJwtPayload = {
      sub: user?._id.toString(),
      email: user.email,
    };

    const token = jwt.sign(jwtPayload, process.env.JWT_SECRET!, {
      expiresIn: "2d",
    });

    res.status(200).json({ token });
  } catch (error) {
    next(error);
  }
};
