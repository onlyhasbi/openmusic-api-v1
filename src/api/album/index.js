const AlbumHandler = require('./handler');
const routesAlbum = require('./routes');

module.exports = {
  name: 'album',
  version: '1.0.0',
  register: async (server, { service, validator }) => {
    const albumHandler = new AlbumHandler(service, validator);
    server.route(routesAlbum(albumHandler));
  },
};
