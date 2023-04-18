import { model, Schema } from "mongoose";

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

export const Playlist = model("Playlist", playlistSchema, "playlists");
