const AlbumsHandler = require('./handler');
const routes = require('./routes');

module.exports = {
  name: 'albums',
  version: '1.0.0',
  register: async (server, {
    service, storageService, validator, UploadCoverValidator,
  }) => {
    const albumsHandler = new AlbumsHandler(service, storageService,
      validator, UploadCoverValidator);
    server.route(routes(albumsHandler));
  },
};
