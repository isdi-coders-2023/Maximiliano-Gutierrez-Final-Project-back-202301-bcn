import { type NextFunction, type Request, type Response } from "express";
import { CustomError } from "../../../CustomError/CustomError.js";
import { Playlist } from "../../../database/models/Playlists/Playlists.js";

export const getPlaylists = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const playlists = await Playlist.find().exec();

    res.status(200).json({ playlists });
  } catch (error) {
    const customError = new CustomError(
      "Bad request",
      400,
      "Could not get playlists"
    );
    next(customError);
  }
};

export const getPlaylistById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { playlistId } = req.params;
    const playlist = await Playlist.findById(playlistId).exec();

    if (!playlist) {
      const customError = new CustomError(
        "Playist not found",
        404,
        "Could not find playlist"
      );

      next(customError);

      return;
    }

    res.status(200).json({ playlist });
  } catch (error: unknown) {
    const customError = new CustomError(
      "Bad request",
      500,
      "Could not get playlist"
    );
    next(customError);
  }
};
