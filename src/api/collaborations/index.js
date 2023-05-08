const CollaborationsHandler = require('./handler');
const routes = require('./routes');

module.exports = {
  name: 'collaborations',
  version: '1.0.0',
  register: async (
    server,
    { usersService, playlistsService, service, validator }
  ) => {
    const collaborationsHandler = new CollaborationsHandler(
      usersService,
      playlistsService,
      service,
      validator
    );
    server.route(routes(collaborationsHandler));
  },
};
