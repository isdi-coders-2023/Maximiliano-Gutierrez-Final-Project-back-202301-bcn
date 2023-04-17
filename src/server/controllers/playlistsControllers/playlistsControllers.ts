/* eslint-disable @typescript-eslint/no-unsafe-argument */
import { type NextFunction, type Request, type Response } from "express";
import { createClient } from "@supabase/supabase-js";
import { CustomError } from "../../../CustomError/CustomError.js";
import { Playlist } from "../../../database/models/Playlists/Playlists.js";
import {
  type Song,
  type CustomRequest,
  type PlaylistStrucutre,
  type UpdatedPlaylistData,
} from "../../../types/types.js";
import fs from "fs/promises";
import path from "path";
import { supabaseKey, supabaseUrl } from "../../../loadEnvironment.js";
import { validationResult } from "express-validator";

const supabase = createClient(supabaseUrl!, supabaseKey!);

export const getPlaylists = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const playlists = await Playlist.find().sort({ _id: -1 }).exec();

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

  const imagePath = path.join("uploads", playlistPhoto!);

  const image = await fs.readFile(imagePath);

  await supabase.storage.from("images").upload(playlistPhoto!, image);

  const {
    data: { publicUrl },
  } = supabase.storage.from("images").getPublicUrl(playlistPhoto!);

  const songs = JSON.parse(req.body.songs) as Song[];

  try {
    const newPlaylist: PlaylistStrucutre = {
      playlistName,
      playlistPhoto: publicUrl,
      songs,
      isCreatedByUser: true,
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
    }).exec();

    res.status(200).json({ playlist });
  } catch (error) {
    const customError = new CustomError(
      "Bad request",
      500,
      "The playlist couldn't be deleted"
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

export const updatePlaylist = async (
  req: CustomRequest,
  res: Response,
  next: NextFunction
) => {
  const { id } = req.params;
  const { playlistName, songs } = req.body as PlaylistStrucutre;

  let playlistPhoto;
  if (req.file) {
    const imagePath = path.join("uploads", req.file.filename);
    const image = await fs.readFile(imagePath);

    await supabase.storage.from("images").upload(req.file.filename, image);

    const {
      data: { publicUrl },
    } = supabase.storage.from("images").getPublicUrl(req.file.filename);

    playlistPhoto = publicUrl;
  }

  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const updatedData: UpdatedPlaylistData = { playlistName, songs };
    if (playlistPhoto) {
      updatedData.playlistPhoto = playlistPhoto;
    }

    const playlist = await Playlist.findByIdAndUpdate(id, updatedData, {
      new: true,
    });

    if (!playlist) {
      return res.status(404).json({ error: "Playlist not found" });
    }

    res.status(200).json({ playlist });
  } catch (error: unknown) {
    const customError = new CustomError(
      (error as Error).message,
      500,
      "Internal server error"
    );

    next(customError);
  }
};
