import { type Request } from "express";
import { type JwtPayload } from "jsonwebtoken";

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
  createBy: string;
}

export interface CustomJwtPayload extends JwtPayload {
  sub: string;
}
