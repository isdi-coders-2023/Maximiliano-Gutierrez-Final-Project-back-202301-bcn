import { Router } from "express";
import multer from "multer";
import {
  getPlaylists,
  getPlaylistById,
  deletePlaylistsById,
  createPlaylist,
  updatePlaylist,
} from "../../controllers/playlistsControllers/playlistsControllers.js";
import auth from "../../middlewares/auth/auth.js";
import { endpoints } from "../enpoints.js";
import path from "path";
import crypto from "crypto";

const storage = multer.diskStorage({
  destination: "uploads/",
  filename(req, file, callBack) {
    const suffix = crypto.randomUUID();

    const extension = path.extname(file.originalname);
    const basename = path.basename(file.originalname, extension);

    const filename = `${basename}-${suffix}${extension}`;

    callBack(null, filename);
  },
});

const upload = multer({ storage, limits: { fileSize: 8000000 } });

const getPlaylistsRoute = "/";

const playlistsRouter = Router();

playlistsRouter.get(getPlaylistsRoute, getPlaylists);

playlistsRouter.delete(
  `${getPlaylistsRoute}${endpoints.delete}`,
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

playlistsRouter.patch(
  `${getPlaylistsRoute}${endpoints.edit}`,
  auth,
  upload.single("playlistPhoto"),
  updatePlaylist
);

export default playlistsRouter;
