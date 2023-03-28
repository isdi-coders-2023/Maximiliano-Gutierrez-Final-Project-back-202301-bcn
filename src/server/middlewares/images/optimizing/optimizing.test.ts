import { type NextFunction, type Response } from "express";
import { CustomError } from "../../../../CustomError/CustomError";
import { type CustomRequest } from "../../../../types/types";
import optimizing from "./optimizing";
import { type PlaylistData } from "../../../../types/types";

beforeEach(() => jest.clearAllMocks());

let mockImageFile = jest.fn();

const mockPlaylist: PlaylistData = {
  playlistName: "Melodic Techno",
  playlistPhoto: "LaytonGiordani.jpg",
  playlistBpm: 0,
  id: "11",
  songs: [
    {
      artistName: "Layton Girodani",
      trackName: "New Generation",
      bpmTrack: 132,
    },
  ],
};

jest.mock("sharp", () => () => ({
  resize: jest.fn().mockReturnValue({
    webp: jest.fn().mockReturnValue({
      toFormat: jest.fn().mockReturnValue({ toFile: mockImageFile }),
    }),
  }),
}));

const next = jest.fn() as NextFunction;

const res: Partial<Response> = {};

const file: Partial<Express.Multer.File> = {
  filename: "LaytonGiordani.jpg",
  originalname: "LaytonGiordani.jpg",
};

const req: Partial<CustomRequest> = {
  body: mockPlaylist,
};

describe("Given an optimizing middleware", () => {
  describe("When it receives a request with an image", () => {
    test("Then it should call its next method and put the optimized image to the request", async () => {
      const expectedImageName = "LaytonGiordani.webp";
      req.file = file as Express.Multer.File;

      await optimizing(req as CustomRequest, res as Response, next);

      expect(req.file.filename).toBe(expectedImageName);
    });
  });

  describe("When it receives a request without an image", () => {
    test("Then it should call its next method with an error", async () => {
      const newError = new CustomError(
        "Error optimizing the provided image",
        400,
        "Error optimizing the provided image"
      );

      mockImageFile = jest.fn().mockRejectedValue(undefined);

      await optimizing(req as CustomRequest, res as Response, next);

      expect(next).toHaveBeenCalledWith(newError);
    });
  });
});
