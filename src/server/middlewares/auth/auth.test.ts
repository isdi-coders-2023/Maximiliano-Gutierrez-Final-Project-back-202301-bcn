import { type Request, type NextFunction, type Response } from "express";
import mongoose from "mongoose";
import {
  type CustomRequestPlus,
  type CustomRequest,
} from "../../../types/types";
import auth from "./auth";
import jwt from "jsonwebtoken";

const req: Partial<Request> = {};

const next: NextFunction = jest.fn();
const res: Partial<Response> = {};

describe("Given an auth middleware", () => {
  describe("When it receives a request with an authorization header 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6Im1pcmVpYTQiLCJpZCI6IjYzNmZjMzZjY2IxMDFhM2NkNGJlZGQ4YSIsImlhdCI6MTY2ODI2OTE3OSwiZXhwIjoxNjY4NDQxOTc5fQ.n1WpQo6lzeGiJpfngUzr86iO55218EvdpUAIRSThbUE'", () => {
    test("Then it should add the postedBy property and the token to the request and invoke next", () => {
      const req: Partial<CustomRequest> = {};
      req.header = jest
        .fn()
        .mockReturnValueOnce(
          "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6Im1pcmVpYTQiLCJpZCI6IjYzNmZjMzZjY2IxMDFhM2NkNGJlZGQ4YSIsImlhdCI6MTY2ODI2OTE3OSwiZXhwIjoxNjY4NDQxOTc5fQ.n1WpQo6lzeGiJpfngUzr86iO55218EvdpUAIRSThbUE"
        );
      const userId = new mongoose.Types.ObjectId();
      jwt.verify = jest.fn().mockReturnValueOnce({ sub: userId });

      auth(req as CustomRequestPlus, res as Response, next);

      expect(next).toHaveBeenCalled();
      expect(req).toHaveProperty("userId", userId);
    });
  });

  describe("When it receives a request with an undefined token'", () => {
    test("Then it should add the userId property and the token to the request and invoke next", () => {
      const req: Partial<Request> = {};

      const postedBy = new mongoose.Types.ObjectId();
      jwt.verify = jest.fn().mockReturnValueOnce({ sub: postedBy });

      auth(req as CustomRequest, res as Response, next);

      expect(next).toHaveBeenCalled();
    });
  });
});

describe("Given an auth middleware", () => {
  describe("When it receives a request without an authorization header", () => {
    test("Then it should call next() without adding any properties to the request", () => {
      const req: Partial<CustomRequest> = {};
      req.header = jest.fn().mockReturnValueOnce(undefined);

      auth(req as CustomRequestPlus, res as Response, next);

      expect(next).toHaveBeenCalled();
      expect(req).not.toHaveProperty("userId");
    });
  });
});

describe("Given an auth middleware", () => {
  describe("When it receives a request without an authorization header", () => {
    test("Then it should not add any properties to the request and invoke next", () => {
      const req: Partial<CustomRequest> = {};
      req.header = jest.fn().mockReturnValueOnce(undefined);
      const userId = new mongoose.Types.ObjectId();
      jwt.verify = jest.fn().mockReturnValueOnce({ sub: userId });

      auth(req as CustomRequestPlus, res as Response, next);

      expect(next).toHaveBeenCalled();
      expect(req).not.toHaveProperty("userId");
    });
  });
});
