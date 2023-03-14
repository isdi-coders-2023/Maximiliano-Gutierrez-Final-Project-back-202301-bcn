import { type Request, type Response } from "express";
import { type Query } from "mongoose";
import { CustomError } from "../../../CustomError/CustomError";
import { Playlist } from "../../../database/models/Playlists/Playlists";
import { type PlaylistData, type PlaylistsData } from "../../../types/types";
import { CustomRequest } from "../../../types/types";
import { getPlaylists } from "./playlistsControllers";

const mockPlaylistDriving: PlaylistData = {
  playlistName: "Driving",
  playlistPhoto: "picture.jpg",
  playlistBpm: 120,
  songs: [
    {
      artistName: "Tale Of Us",
      trackName: "Astral",
      bpmTrack: 120,
    },
  ],
};

const mockPlaylist: PlaylistsData = [mockPlaylistDriving];

beforeEach(() => jest.resetAllMocks());

describe("Given a getPlaylists function", () => {
  describe("When it receives a response", () => {
    test("Then it should call its status method with 200", async () => {
      const res: Partial<Response> = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn().mockResolvedValue(mockPlaylist),
      };
      const req: Partial<Request> = {};
      const next = jest.fn();
      const expectedCode = 200;

      Playlist.find = jest.fn().mockImplementationOnce(() => ({
        exec: jest.fn().mockReturnValue(mockPlaylist),
      }));

      await getPlaylists(req as Request, res as Response, next);

      expect(res.status).toHaveBeenCalledWith(expectedCode);
    });
  });

  test("Then it should call its json method with the playlists", async () => {
    const res: Partial<Response> = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockResolvedValue(mockPlaylist),
    };
    const req: Partial<Request> = {};
    const next = jest.fn();
    const expectedPlaylists = mockPlaylist;

    Playlist.find = jest.fn().mockImplementationOnce(() => ({
      exec: jest.fn().mockReturnValue(mockPlaylist),
    }));

    await getPlaylists(req as Request, res as Response, next);

    expect(res.json).toHaveBeenCalledWith({
      playlists: expectedPlaylists,
    });
  });

  describe("And there is an error", () => {
    test("Then it should call next with a custom error", async () => {
      const res: Partial<Response> = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn().mockResolvedValue(mockPlaylist),
      };
      const req: Partial<Request> = {};
      const next = jest.fn();

      Playlist.find = jest.fn().mockImplementationOnce(() => ({
        exec: jest.fn().mockRejectedValueOnce(new Error("Error")),
      }));

      await getPlaylists(req as Request, res as Response, next);

      expect(next).toHaveBeenCalledWith(
        new CustomError("Bad request", 400, "Could not get playlists")
      );
    });
  });

  describe("And there is an error", () => {
    test("Then it should call its next function with the expected error", async () => {
      const res: Partial<Response> = {};
      const req: Partial<Request> = {};
      const next = jest.fn();
      const expectedError = new CustomError(
        "Bad request",
        400,
        "Could not get playlists"
      );

      Playlist.find = jest.fn().mockImplementationOnce(() => ({
        exec: jest.fn().mockRejectedValue(expectedError),
      }));

      await getPlaylists(req as Request, res as Response, next);

      expect(next).toHaveBeenCalledWith(expectedError);
    });
  });
});
