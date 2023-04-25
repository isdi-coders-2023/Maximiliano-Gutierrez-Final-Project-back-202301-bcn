/* eslint-disable @typescript-eslint/consistent-type-assertions */
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
  describe("When it receives an error with status 500", () => {
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

    test("Then general error sends json response with error message and status code", () => {
      const req = {} as Request;
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      } as unknown as Response;
      const next = jest.fn() as NextFunction;

      const error = new CustomError(
        "Test error message",
        400,
        "Test public message"
      );

      generalError(error, req, res, next);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        error: "Test public message",
      });
    });
  });

  describe("Given a notFoundError middleware", () => {
    describe("When it receives a request", () => {
      test("Then it should call its next method", () => {
        notFoundError(req as Request, res as Response, next);

        expect(next).toHaveBeenCalled();
      });
    });
  });

  test("Then not found error calls next middleware", () => {
    const req = {} as Request;
    const resp = {} as Response;
    const next = jest.fn();

    notFoundError(req, resp, next);

    expect(next).toBeCalled();
  });

  test("Then not found error has correct status code", () => {
    const req = {} as Request;
    const resp = {} as Response;
    const next = jest.fn();

    notFoundError(req, resp, next);

    expect(next).toBeCalledWith(
      expect.objectContaining({
        statusCode: 404,
      })
    );
  });

  test("Then not found error has correct public message", () => {
    const req = {} as Request;
    const resp = {} as Response;
    const next = jest.fn();

    notFoundError(req, resp, next);

    expect(next).toBeCalledWith(
      expect.objectContaining({
        publicMessage: "Endpoint not found",
      })
    );
  });
});
