import { Router } from "express";
import multer from "multer";
import {
  getPlaylists,
  getPlaylistById,
  deletePlaylistsById,
  createPlaylist,
} from "../../controllers/playlistsControllers/playlistsControllers.js";
import auth from "../../middlewares/auth/auth.js";
import { endpoints } from "../enpoints.js";
import path from "path";
import crypto from "crypto";
import supaBase from "../../middlewares/images/supaBase/supaBase.js";

const storage = multer.diskStorage({
  destination: "uploads/",
  filename(req, file, callBack) {
    const suffix = crypto.randomUUID();

    const extension = path.extname(file.originalname);

    const filename = `${suffix}${extension}`;

    callBack(null, filename);
  },
});

const upload = multer({ storage, limits: { fileSize: 8000000 } });

const getPlaylistsRoute = "/";

const playlistsRouter = Router();

playlistsRouter.get(getPlaylistsRoute, getPlaylists);

playlistsRouter.delete(
  `${endpoints.delete}${endpoints.details}`,
  auth,
  deletePlaylistsById
);

playlistsRouter.post(
  `${getPlaylistsRoute}${endpoints.create}`,
  auth,
  upload.single("playlistPhoto"),
  createPlaylist
);

playlistsRouter.get(
  `${getPlaylistsRoute}${endpoints.details}`,
  getPlaylistById
);

export default playlistsRouter;
