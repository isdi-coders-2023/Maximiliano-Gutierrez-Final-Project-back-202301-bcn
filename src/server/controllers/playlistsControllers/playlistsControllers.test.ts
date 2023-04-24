import { type Request, type Response, type NextFunction } from "express";
import { CustomError } from "../../../CustomError/CustomError";
import { Playlist } from "../../../database/models/Playlists/Playlists";
import { type PlaylistData, type PlaylistsData } from "../../../types/types";
import { type CustomRequest } from "../../../types/types";
import {
  getPlaylists,
  getPlaylistById,
  deletePlaylistsById,
  createPlaylist,
  getUserPlaylists,
} from "./playlistsControllers";
import { Readable } from "stream";
import fs from "fs";

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

describe("Given the getUserEvents controller", () => {
  describe("When it receives a response", () => {
    test("Then it should call its status method with 200", async () => {
      const res: Partial<Response> = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn().mockResolvedValue(mockPlaylist),
      };
      const req: Partial<Request> = {};
      const next = jest.fn();
      const expectedStatusCode = 200;
      req.body = { postedBy: "213i21sdgasgg" };

      Playlist.find = jest.fn().mockImplementationOnce(() => ({
        exec: jest.fn().mockReturnValue({ postedBy: "123243afdfasfed" }),
      }));

      await getUserPlaylists(req as CustomRequest, res as Response, next);

      expect(res.status).toHaveBeenCalledWith(expectedStatusCode);
    });

    test("Then it should call its json method", async () => {
      const res: Partial<Response> = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn().mockResolvedValue(mockPlaylist),
      };
      const req: Partial<Request> = {};
      const next = jest.fn();
      req.params = { postedBy: "213i21309213891jkdk" };

      Playlist.find = jest.fn().mockImplementationOnce(() => ({
        exec: jest.fn().mockReturnValue(mockPlaylist),
      }));

      await getUserPlaylists(req as CustomRequest, res as Response, next);

      expect(res.json).toHaveBeenCalledWith({ playlists: mockPlaylist });
    });
  });

  describe("When it receives a bad request", () => {
    test("Then it should call its next function", async () => {
      const res: Partial<Response> = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn().mockResolvedValue({}),
      };
      const req: Partial<Request> = {};
      const next = jest.fn();

      const expectedError = new CustomError(
        "Bad request",
        400,
        "Could not get playlists"
      );

      req.body = {};

      Playlist.find = jest.fn().mockReturnValue(undefined);

      await getUserPlaylists(req as CustomRequest, res as Response, next);

      expect(next).toHaveBeenCalledWith(expectedError);
    });
  });
});

describe("Given a getPlaylists function", () => {
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

describe("Given a getPlaylistById controller", () => {
  describe("When it receives a response", () => {
    test("Then it should call its status method with 200", async () => {
      const res: Partial<Response> = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn().mockResolvedValue(mockPlaylistDriving),
      };
      const req: Partial<CustomRequest> = {
        params: { playlistId: "jkqfeeñbjfeefqw" },
      };
      const next = jest.fn();
      const expectedCode = 200;

      Playlist.findById = jest.fn().mockImplementationOnce(() => ({
        exec: jest.fn().mockReturnValue(mockPlaylistDriving),
      }));

      await getPlaylistById(req as CustomRequest, res as Response, next);

      expect(res.status).toHaveBeenCalledWith(expectedCode);
    });
  });

  describe("When it receives a response", () => {
    test("Then it should call its json method with the playlist", async () => {
      const res: Partial<Response> = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn().mockResolvedValue(mockPlaylistDriving),
      };
      const req: Partial<CustomRequest> = {
        params: { playlistId: "ljkvgeelbjlenlkeg" },
      };
      const next = jest.fn();
      const expectedPlaylist = mockPlaylistDriving;

      Playlist.findById = jest.fn().mockImplementationOnce(() => ({
        exec: jest.fn().mockReturnValue(mockPlaylistDriving),
      }));

      await getPlaylistById(req as CustomRequest, res as Response, next);

      expect(res.json).toHaveBeenCalledWith({
        playlist: expectedPlaylist,
      });
    });
  });

  test("Then it should call its next function with the expected error", async () => {
    const res: Partial<Response> = {};
    const req: Partial<CustomRequest> = {
      params: { playlistId: "ljkvgeelbjlenlkeg" },
    };
    const next = jest.fn();
    const expectedError = new CustomError(
      "Bad request",
      500,
      "Could not get playlist"
    );

    Playlist.findById = jest.fn().mockImplementationOnce(() => ({
      exec: jest.fn().mockRejectedValue(expectedError),
    }));

    await getPlaylistById(req as CustomRequest, res as Response, next);

    expect(next).toHaveBeenCalledWith(expectedError);
  });
});

describe("When it receives a request with a playlistId and the user is authorized, but there is no playlist in the database", () => {
  test("Then it should call next with 404 status code and an error", async () => {
    const customError = new CustomError(
      "Playist not found",
      404,
      "Could not find playlist"
    );
    const res: Partial<Response> = {};
    const req: Partial<CustomRequest> = {
      params: { playlistId: "ljkvgeelbjlenlkeg" },
    };
    const next = jest.fn();

    Playlist.findById = jest.fn().mockImplementationOnce(() => ({
      exec: jest.fn().mockResolvedValue(undefined),
    }));

    await getPlaylistById(req as CustomRequest, res as Response, next);

    expect(next).toHaveBeenCalledWith(customError);
  });
});

describe("Given a deletePlaylistById controller", () => {
  describe("When it receives a response", () => {
    test("Then it should call its status method with 200", async () => {
      const res: Partial<Response> = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn().mockResolvedValue(mockPlaylistDriving),
      };
      const req: Partial<CustomRequest> = {
        params: { playlistId: "71785187847" },
      };
      const next = jest.fn();
      const expectedCode = 200;

      Playlist.findByIdAndDelete = jest.fn().mockImplementationOnce(() => ({
        exec: jest.fn().mockReturnValue(mockPlaylistDriving),
      }));

      await deletePlaylistsById(req as CustomRequest, res as Response, next);

      expect(res.status).toHaveBeenCalledWith(expectedCode);
    });
  });

  test("Then it should call its next function with the expected error", async () => {
    const res: Partial<Response> = {};
    const req: Partial<CustomRequest> = {
      params: { playlistId: "71785187847" },
    };
    const next = jest.fn();
    const expectedError = new CustomError(
      "Bad request",
      500,
      "Could not delete playlist"
    );

    Playlist.findByIdAndDelete = jest.fn().mockImplementationOnce(() => ({
      exec: jest.fn().mockRejectedValue(expectedError),
    }));

    await deletePlaylistsById(req as CustomRequest, res as Response, next);

    expect(next).toHaveBeenCalledWith(expectedError);
  });
});

describe("Given a createPlaylist controller", () => {
  const tempFilePath = "uploads/picture.jpg";

  beforeAll(() => {
    if (!fs.existsSync("uploads")) {
      fs.mkdirSync("uploads");
    }

    fs.writeFileSync(tempFilePath, "");
  });

  afterAll(() => {
    fs.unlinkSync(tempFilePath);
  });
  describe("When it receives a response", () => {
    test("Then it should call its status method with 201", async () => {
      const res: Partial<Response> = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn().mockResolvedValue(mockPlaylistDriving),
      };
      const req: Partial<CustomRequest> = {
        body: {
          playlistName: "New Playlist",
          songs: JSON.stringify(mockPlaylistDriving.songs),
        },
        file: {
          filename: "picture.jpg",
          fieldname: "image",
          originalname: "picture.jpg",
          encoding: "7bit",
          mimetype: "image/jpeg",
          size: 1000,
          destination: "uploads/",
          path: "uploads/picture.jpg",
          buffer: Buffer.from(""),
          stream: Readable.from(""),
        },
      };
      const next = jest.fn();
      const expectedStatusCode = 201;

      Playlist.create = jest.fn().mockReturnValue(mockPlaylistDriving);

      await createPlaylist(req as CustomRequest, res as Response, next);

      expect(res.status).toHaveBeenCalledWith(expectedStatusCode);
    });

    test("Then it should call its json method with the created playlist", async () => {
      const res: Partial<Response> = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn().mockResolvedValue(mockPlaylistDriving),
      };
      const req: Partial<CustomRequest> = {
        body: {
          playlistName: "New Playlist",
          songs: JSON.stringify(mockPlaylistDriving.songs),
        },
        file: {
          filename: "picture.jpg",
          fieldname: "image",
          originalname: "picture.jpg",
          encoding: "7bit",
          mimetype: "image/jpeg",
          size: 1000,
          destination: "uploads/",
          path: "uploads/picture.jpg",
          buffer: Buffer.from(""),
          stream: Readable.from(""),
        },
      };
      const next = jest.fn();
      const expectedPlaylist = mockPlaylistDriving;

      Playlist.create = jest.fn().mockReturnValue(mockPlaylistDriving);

      await createPlaylist(req as CustomRequest, res as Response, next);

      expect(res.json).toHaveBeenCalledWith({ playlist: expectedPlaylist });
    });
  });
});
