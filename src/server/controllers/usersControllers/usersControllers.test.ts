import { type NextFunction, type Request, type Response } from "express";
import mongoose from "mongoose";
import { User } from "../../../database/models/User/User";
import {
  type UserCredentials,
  type UserRegisterCredentials,
} from "../../../types/types";
import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";
import { loginUser, registerUser } from "./usersControllers";
import { CustomError } from "../../../CustomError/CustomError";

const res: Partial<Response> = {
  status: jest.fn().mockReturnThis(),
  json: jest.fn(),
};

const req: Partial<
  Request<Record<string, unknown>, Record<string, unknown>, UserCredentials>
> = {};
const next = jest.fn() as NextFunction;

beforeEach(() => jest.clearAllMocks());

describe("Given a loginUser controller", () => {
  const mockUser: UserCredentials = {
    email: "leomatiolli@aol.com",
    password: "balcarce",
  };

  describe("When it receives a request with an email 'leomatiolli@aol.com' and password 'balcarce' and the user is not registered in the database", () => {
    test("Then it should call its next method with a status 401 and the message 'Wrong credentials'", async () => {
      const expectedError = new CustomError(
        "Wrong credentials",
        401,
        "Wrong credentials"
      );
      req.body = mockUser;

      User.findOne = jest.fn().mockImplementationOnce(() => ({
        exec: jest.fn().mockResolvedValue(undefined),
      }));

      await loginUser(
        req as Request<
          Record<string, unknown>,
          Record<string, unknown>,
          UserCredentials
        >,
        res as Response,
        next
      );

      expect(next).toHaveBeenCalledWith(expectedError);
    });
  });

  describe("When it receives a request with an email 'leomatiolli@aol.com' and password 'balcarce' and the user is registered in the database", () => {
    test("Then it should call its next method with a status 200 and its json method with a token", async () => {
      const expectedStatusCode = 200;
      req.body = mockUser;
      const expectedBodyResponse = { token: "985oig29803" };

      User.findOne = jest.fn().mockImplementation(() => ({
        exec: jest.fn().mockResolvedValue({
          ...mockUser,
          _id: new mongoose.Types.ObjectId(),
        }),
      }));

      bcryptjs.compare = jest.fn().mockResolvedValue(true);
      jwt.sign = jest.fn().mockReturnValue("985oig29803");

      await loginUser(
        req as Request<
          Record<string, unknown>,
          Record<string, unknown>,
          UserCredentials
        >,
        res as Response,
        next
      );

      expect(res.status).toHaveBeenCalledWith(expectedStatusCode);
      expect(res.json).toHaveBeenCalledWith(expectedBodyResponse);
    });
  });

  describe("When it receives a request with a email 'leomatiolli@aol.com' and password `balcarce` and the user is registered in the database but the passwords don't match", () => {
    test("Then it should call its next method with a status 401 and the message `Wrong credentials`", async () => {
      const expectedError = new CustomError(
        "Wrong credentials",
        401,
        "Wrong credentials"
      );
      req.body = mockUser;

      User.findOne = jest.fn().mockImplementationOnce(() => ({
        exec: jest.fn().mockResolvedValue({
          ...mockUser,
          _id: new mongoose.Types.ObjectId(),
        }),
      }));

      bcryptjs.compare = jest.fn().mockResolvedValue(false);

      await loginUser(
        req as Request<
          Record<string, unknown>,
          Record<string, unknown>,
          UserCredentials
        >,
        res as Response,
        next
      );

      expect(next).toHaveBeenCalledWith(expectedError);
    });
  });

  describe("When the data base rejects the request and responds with an error", () => {
    test("Then it should call its next method", async () => {
      const error = new Error("Fatal error");

      User.findOne = jest.fn().mockImplementationOnce(() => ({
        exec: jest.fn().mockRejectedValue(error),
      }));

      await loginUser(
        req as Request<
          Record<string, unknown>,
          Record<string, unknown>,
          UserCredentials
        >,
        res as Response,
        next
      );

      expect(next).toHaveBeenCalledWith(error);
    });
  });
});

describe("Given a registerUser controller", () => {
  describe("When it receives a request to register the user correctly", () => {
    test("Then it should call its status method and its json method with the message 'The user has been created'", async () => {
      const mockUser: UserRegisterCredentials = {
        email: "leomatiolli@aol.com",
        password: "12345678",
        name: "balcarce",
      };

      const expectedMessage = { message: "The user has been created" };
      const expectedStatusCode = 201;

      req.body = mockUser;
      bcryptjs.hash = jest.fn().mockResolvedValue("batatamerlo");
      User.create = jest.fn().mockResolvedValue(mockUser);

      await registerUser(
        req as Request<
          Record<string, unknown>,
          Record<string, unknown>,
          UserRegisterCredentials
        >,
        res as Response,
        next
      );

      expect(res.status).toHaveBeenCalledWith(expectedStatusCode);
      expect(res.json).toHaveBeenCalledWith(expectedMessage);
    });
  });
});
