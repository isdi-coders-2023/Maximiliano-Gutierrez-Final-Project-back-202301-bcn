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

const mockPlaylist: PlaylistData = {
  isCreatedByUser: true,
  playlistName: "Driving",
  playlistPhoto: "Techno Wallpaper 1-7dd0f7ea-1fae-4d58-8012-6578ee56d007.png",
  id: "11",
  playlistBpm: 120,
  postedBy: "John",
  songs: [
    {
      artistName: "Tale of Us",
      trackName: "Abstral",
      bpmTrack: 120,
    },
  ],
};

describe("Given a GET '/events' endpoint", () => {
  describe("When it receives a request", () => {
    test("Then it should respond with status 200", async () => {
      const expectedStatus = 200;
      const playlistsUrl = "/playlists";

      await request(app).get(playlistsUrl).expect(expectedStatus);
    });
  });
});

describe("Given a POST '/create' endpoint", () => {
  describe("When it receives a request", () => {
    test("Then it should respond with status 201", async () => {
      const urlCreate = "/playlists/create";
      const expectedStatus = 201;

      const userId = new mongoose.Types.ObjectId();
      jwt.verify = jest.fn().mockReturnValue({ sub: userId });

      const response: { body: { playlist: PlaylistData } } = await request(app)
        .post(urlCreate)
        .set(
          "Authorization",
          "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI2M2ZiNzNiYWIxNmQ4MzlkNDFiZWMwYzUiLCJlbWFpbCI6ImpvcmRpQGdtYWlsLmNvbSIsImlhdCI6MTY3ODk5Mjc5MSwiZXhwIjoxNjc5MTY1NTkxfQ.yMrSvMa-aN0kozxfKLPBQXO9HfXXa1af7PlZkb71RAE"
        )
        .set("content-type", "multipart/form-data")
        .field("isCreatedByUser", mockPlaylist.isCreatedByUser!)
        .field("playlistName", mockPlaylist.playlistName)
        .attach("playlistPhoto", Buffer.from("uploads"), {
          filename:
            "Techno Wallpaper 1-7dd0f7ea-1fae-4d58-8012-6578ee56d007.png",
        })
        .field("playlistBpm", mockPlaylist.playlistBpm!)
        .field("postedBy", mockPlaylist.postedBy!)
        .field("id", mockPlaylist.id!)
        .field("songs", JSON.stringify(mockPlaylist.songs))
        .expect(expectedStatus);
    });
  });
});
