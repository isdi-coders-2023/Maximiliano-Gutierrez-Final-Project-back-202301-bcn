import request from "supertest";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";
import connectDataBase from "../../../database/connectDataBase";
import User from "../../../database/models/User/User";
import { type UserCredentials } from "../../../types/types";
import { app } from "../../index.js";
import usersRouters from "./usersRouters.js";

let mongodbServer: MongoMemoryServer;

beforeAll(async () => {
  mongodbServer = await MongoMemoryServer.create();
  const mongodbServerUrl = mongodbServer.getUri();

  await connectDataBase(mongodbServerUrl);
});

afterAll(async () => {
  await mongoose.connection.close();
  await mongodbServer.stop();
});

afterEach(async () => {
  await User.deleteMany();
});

describe("Given a '/users/login' endpoint", () => {
  const loginUrl = "/users/login";
  const mockUser: UserCredentials = {
    email: "leomatiolli@aol.com",
    password: "balcarce",
  };

  describe("When receives a request with email 'leomatiolli@aol.com' an password 'balcarce'", () => {
    test("Then it should to respond with a status 200 and with an object in its body with a property `token`", async () => {
      jwt.sign = jest.fn().mockImplementation(() => ({
        token: "nv3'88t49gwgk¡2g¡99i¡gk9952",
      }));
      const expectedStatus = 200;
      const hashPassword = await bcrypt.hash(mockUser.password, 8);

      await User.create({
        ...mockUser,
        email: "leomatiolli@aol.com",
        password: hashPassword,
      });

      const response = await request(app)
        .post(loginUrl)
        .send(mockUser)
        .expect(expectedStatus);

      expect(response.body).toHaveProperty("token");
    });
  });
});
