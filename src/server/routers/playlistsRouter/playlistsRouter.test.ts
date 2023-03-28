import request from "supertest";
import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose from "mongoose";
import { app } from "../../";
import connectDataBase from "../../../database/connectDataBase";
import { Playlist } from "../../../database/models/Playlists/Playlists";
import { type PlaylistData } from "../../../types/types";
import jwt from "jsonwebtoken";

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
  await Playlist.deleteMany();
});

afterEach(() => {
  jest.clearAllMocks();
});

describe("GET /playlists", () => {
  describe("When it receives a request", () => {
    test("Then it should return a 200 status code", async () => {
      const expectedStatus = 200;
      const playlistsUrl = "/playlists";

      await request(app).get(playlistsUrl).expect(expectedStatus);
    });
  });
});

describe("Given a GET /playlists", () => {
  describe("When it receives a request", () => {
    test("Then it should return an empty array of playlists", async () => {
      const expectedStatus = 200;
      const playlistsUrl = "/playlists";

      const response = await request(app).get(playlistsUrl);

      expect(response.body).toEqual({
        playlists: [],
      });
    });
  });
});
