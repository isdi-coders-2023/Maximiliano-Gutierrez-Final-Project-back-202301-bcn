import { Router } from "express";
import { getPlaylists } from "../../controllers/playlistsControllers/playlistsControllers.js";

const getPlaylistsRoute = "/";

const playlistsRouter = Router();

playlistsRouter.get(getPlaylistsRoute, getPlaylists);

export default playlistsRouter;
