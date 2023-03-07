import { CustomError } from "./CustomError";

describe("Given a class CustomError", () => {
  describe("Then when a new error is instancied", () => {
    test("Then it should to create a new Error object with the property 'message'", () => {
      const newError = new CustomError(
        "Connection error",
        500,
        "Connection not found"
      );

      const expectedProperty = "message";

      expect(newError).toHaveProperty(expectedProperty);
    });
  });
});
