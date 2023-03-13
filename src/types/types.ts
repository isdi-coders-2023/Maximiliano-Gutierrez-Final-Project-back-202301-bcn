export interface UserCredentials {
  email: string;
  password: string;
}

export interface Song {
  trackName: string;
  artistName: string;
  bpmTrack: number;
}

export interface Playlist {
  playlistName: string;
  playlistPhoto: string;
  playlistBpm: number;
  songs: Song[];
}

export type PlaylistsData = Playlist[];
