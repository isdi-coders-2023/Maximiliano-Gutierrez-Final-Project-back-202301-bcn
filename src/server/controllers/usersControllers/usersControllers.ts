import jwt from "jsonwebtoken";
import bcryptjs from "bcryptjs";
import { type NextFunction, type Request, type Response } from "express";
import { CustomError } from "../../../CustomError/CustomError.js";
import {
  type UserCredentials,
  type CustomJwtPayload,
  type UserRegisterCredentials,
} from "../../../types/types.js";
import User from "../../../database/models/User/User.js";

const requestSucceedStatus = 200;
const hashingPasswordLength = 8;

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
      throw new CustomError("Wrong credentials", 401, "Wrong credentials");
    }

    if (!(await bcryptjs.compare(password, user.password))) {
      throw new CustomError("Wrong credentials", 401, "Wrong credentials");
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

export const registerUser = async (
  req: Request<
    Record<string, unknown>,
    Record<string, unknown>,
    UserRegisterCredentials
  >,
  res: Response,
  next: NextFunction
) => {
  const { email, name, password } = req.body;

  try {
    const hashedPassword = await bcryptjs.hash(password, hashingPasswordLength);

    await User.create({
      email,
      name,
      password: hashedPassword,
    });

    res.status(201).json({ message: "The user has been created" });
  } catch (error) {
    const customError = new CustomError(
      "The user couldn't be created.",
      409,
      "There was a problem creating the user."
    );

    next(customError);
  }
};
