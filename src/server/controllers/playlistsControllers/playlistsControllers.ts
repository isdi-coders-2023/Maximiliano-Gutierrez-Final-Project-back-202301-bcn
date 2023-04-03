/* eslint-disable @typescript-eslint/no-unsafe-argument */
import { type NextFunction, type Request, type Response } from "express";
import mongoose from "mongoose";
import { CustomError } from "../../../CustomError/CustomError.js";
import { Playlist } from "../../../database/models/Playlists/Playlists.js";
import {
  type Song,
  type CustomRequest,
  type PlaylistStrucutre,
} from "../../../types/types.js";

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

export const getUserPlaylists = async (
  req: CustomRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const playlists = await Playlist.find({ postedBy: req.userId }).exec();

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

export const createPlaylist = async (
  req: CustomRequest,
  res: Response,
  next: NextFunction
) => {
  const { playlistName } = req.body as PlaylistStrucutre;

  const playlistPhoto = req.file?.filename;

  const songs = JSON.parse(req.body.songs) as Song[];

  const { userId } = req;
  try {
    const newPlaylist: PlaylistStrucutre = {
      playlistName,
      playlistPhoto,
      songs,
    };

    const createdPlaylist = await Playlist.create(newPlaylist);

    res.status(201).json({ playlist: createdPlaylist });
  } catch (error) {
    const customError = new CustomError(
      "Bad request",
      400,
      "Could not create playlist"
    );
    next(customError);
  }
};

export const deletePlaylistsById = async (
  req: CustomRequest,
  res: Response,
  next: NextFunction
) => {
  const { id: playlistId } = req.params;
  try {
    const playlist = await Playlist.findByIdAndDelete({
      _id: playlistId,
      postedBy: req.userId,
    }).exec();

    res.status(200).json({ playlist });
  } catch (error) {
    const customError = new CustomError(
      "Bad request",
      400,
      "Could not retrieve playlist"
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
    const { id } = req.params;
    const playlist = await Playlist.findById(id).exec();

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
