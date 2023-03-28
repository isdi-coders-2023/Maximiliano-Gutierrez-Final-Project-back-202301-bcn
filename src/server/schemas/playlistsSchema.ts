import { Joi } from "express-validation";

const playlistsSchema = {
  body: Joi.object({
    playlistName: Joi.string().required(),
    playlistPhoto: Joi.string().required(),
    songs: Joi.array().items(
      Joi.object({})
        .keys({
          trackName: Joi.string().required(),
          artistName: Joi.string().required(),
          bpmTrack: Joi.number().required(),
        })
        .required()
    ),
  }),
};

export default playlistsSchema;
