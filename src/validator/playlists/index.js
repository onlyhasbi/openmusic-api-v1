const {
  PostPlaylistPayloadShcema,
  PostPlaylistSongPayloadShcema,
} = require('./schema');
const InvariantError = require('../../exceptions/InvariantError');

const PlaylistsValidator = {
  validatePlaylistPayload: (payload) => {
    const { error } = PostPlaylistPayloadShcema.validate(payload);
    if (error) {
      throw new InvariantError(error.message);
    }
  },
  validatePlaylistSongPayload: (payload) => {
    const { error } = PostPlaylistSongPayloadShcema.validate(payload);
    if (error) {
      throw new InvariantError(error.message);
    }
  },
};

module.exports = PlaylistsValidator;
