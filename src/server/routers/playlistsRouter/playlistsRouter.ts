import { Router } from "express";
import {
  getPlaylists,
  getPlaylistById,
  deletePlaylistsById,
  createPlaylist,
} from "../../controllers/playlistsControllers/playlistsControllers.js";
import auth from "../../middlewares/auth/auth.js";
import { endpoints } from "../enpoints.js";

const getPlaylistsRoute = "/";

const playlistsRouter = Router();

playlistsRouter.get(getPlaylistsRoute, getPlaylists);
playlistsRouter.delete(
  `${endpoints.delete}${endpoints.details}`,
  auth,
  deletePlaylistsById
);

playlistsRouter.post(endpoints.create, auth, createPlaylist);

playlistsRouter.get(`${endpoints.details}`, getPlaylistById);

export default playlistsRouter;
