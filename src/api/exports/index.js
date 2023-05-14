const ExportsHandler = require('./handler');
const routes = require('./routes');

module.exports = {
  name: '_exports',
  version: '1.0.0',
  register: async (server, { service, validator, playlistsService }) => {
    const exportsHandler = new ExportsHandler(
      playlistsService,
      service,
      validator
    );
    server.route(routes(exportsHandler));
  },
};
