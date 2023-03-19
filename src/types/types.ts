import { type Request } from "express";
import { type JwtPayload } from "jsonwebtoken";
import type * as core from "express-serve-static-core";

export interface UserCredentials {
  email: string;
  password: string;
}

export interface Song {
  trackName: string;
  artistName: string;
  bpmTrack: number;
}

export interface PlaylistData {
  playlistName: string;
  playlistPhoto: string;
  playlistBpm?: number;
  songs: Songs;
}

export type PlaylistsData = PlaylistData[];
export type Songs = Song[];

export interface CustomRequest extends Request {
  userId: string;
  createBy: string;
}

export interface CustomJwtPayload extends JwtPayload {
  sub: string;
}

export interface CustomRequestPlus<
  P = core.ParamsDictionary,
  ResBody = any,
  ReqBody = any
> extends Request<P, ResBody, ReqBody> {
  userId: string;
}
