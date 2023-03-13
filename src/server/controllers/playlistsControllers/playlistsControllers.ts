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
