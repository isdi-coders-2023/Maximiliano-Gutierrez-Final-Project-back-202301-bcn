import { Router } from "express";
import {
  getPlaylists,
  getPlaylistById,
} from "../../controllers/playlistsControllers/playlistsControllers.js";

const getPlaylistsRoute = "/";

const playlistsRouter = Router();

playlistsRouter.get(getPlaylistsRoute, getPlaylists);

export default playlistsRouter;
