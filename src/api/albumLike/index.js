const AlbumLikeHandler = require('./handler');
const routes = require('./routes');

module.exports = {
  name: 'albumLikes',
  version: '1.0.0',
  register: async (server, { albumLikeService, albumService }) => {
    const albumLikeHandler = new AlbumLikeHandler(albumLikeService, albumService);
    server.route(routes(albumLikeHandler));
  },
};
