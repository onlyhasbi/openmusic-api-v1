const Joi = require('joi');

const PostPlaylistPayloadShcema = Joi.object({
  name: Joi.string().required(),
});

const PostPlaylistSongPayloadShcema = Joi.object({
  songId: Joi.string().required(),
});

module.exports = { PostPlaylistPayloadShcema, PostPlaylistSongPayloadShcema };
