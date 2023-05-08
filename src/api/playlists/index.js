const PlaylistsHandler = require('./handler');
const routes = require('./routes');

module.exports = {
  name: 'playlists',
  version: '1.0.0',
  register: async (
    server,
    {
      playlistActivities,
      playlistSongsService,
      songsService,
      service,
      validator,
    }
  ) => {
    const playlistsHandler = new PlaylistsHandler(
      playlistActivities,
      playlistSongsService,
      songsService,
      service,
      validator
    );
    server.route(routes(playlistsHandler));
  },
};
