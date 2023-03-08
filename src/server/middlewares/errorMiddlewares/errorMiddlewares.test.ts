import { type NextFunction, type Request, type Response } from "express";
import { CustomError } from "../../../CustomError/CustomError";
import { generalError, notFoundError } from "./errorMiddlewares";

const res: Partial<Response> = {
  status: jest.fn().mockReturnThis(),
  json: jest.fn(),
};

const req: Partial<Request> = {};
const next: NextFunction = jest.fn();

beforeEach(() => jest.clearAllMocks());

describe("Given a generalError middleware", () => {
  describe("When it receives an erro with status 500", () => {
    test("Then it sould call its status method with a 500", () => {
      const statusCode = 500;
      const error = new CustomError(
        "There was an error",
        500,
        "Something went wrong"
      );

      generalError(error, req as Request, res as Response, next);

      expect(res.status).toHaveBeenCalledWith(statusCode);
    });
  });

  describe("Given a notFoundError middleware", () => {
    describe("When it receives a request", () => {
      describe("Then it should call its next method", () => {
        notFoundError(req as Request, res as Response, next);

        expect(next).toHaveBeenCalled();
      });
    });
  });
});
