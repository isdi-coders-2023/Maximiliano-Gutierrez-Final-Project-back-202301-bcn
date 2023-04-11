import { model, Schema } from "mongoose";
import { type Song } from "../../../types/types";

export const playlistSchema = new Schema({
  playlistName: {
    type: String,
    required: true,
  },
  playlistPhoto: {
    type: String,
  },

  postedBy: { type: Schema.Types.ObjectId, ref: "User" },

  isCreatedByUser: {
    type: Boolean,
    default: false,
  },

  songs: [
    {
      trackName: {
        type: String,
        required: true,
      },
      artistName: {
        type: String,
        required: true,
      },
      bpmTrack: {
        type: Number,
        required: true,
      },
    },
  ],
});

playlistSchema.virtual("playlistBpm").get(function () {
  const sum: number = this.songs.reduce(
    (bpm: number, song: Song) => bpm + song.bpmTrack,
    0
  );

  return Math.floor(sum / this.songs.length);
});

export const Playlist = model("Playlist", playlistSchema, "playlists");
