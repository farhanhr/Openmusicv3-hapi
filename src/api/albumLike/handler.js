const InvariantError = require('../../exceptions/InvariantError');
const NotFoundError = require('../../exceptions/NotFoundError');

class AlbumLikeHandler {
  constructor(albumLikeService, albumService) {
    this._albumLikeService = albumLikeService;
    this._albumService = albumService;
  }

  async postLikeHandler(request, h) {
    const { id } = request.params;
    const { id: credentialId } = request.auth.credentials;

    await this._albumService.getAlbumById(id);

    const isLiked = await this._albumLikeService.isLiked(credentialId, id);

    if (isLiked) {
      throw new InvariantError('Sudah dilike');
    }

    await this._albumLikeService.addAlbumLike(credentialId, id);

    const response = h.response({
      status: 'success',
      message: 'Liked',
    });
    response.code(201);
    return response;
  }

  async getLikeHandler(request, h) {
    const { id } = request.params;
    const album = await this._albumService.getAlbumById(id);

    if (!album) {
      throw new NotFoundError('ID album tidak ditemukan');
    }

    const { source, likes } = await this._albumLikeService.getLikes(id);

    const response = h.response({
      status: 'success',
      data: {
        likes,
      },
    });
    response.header('X-Data-Source', source);
    return response;
  }

  async deleteLikeHandler(request) {
    const { id } = request.params;
    const { id: userId } = request.auth.credentials;

    await this._albumLikeService.deleteLikes(userId, id);
    return {
      status: 'success',
      message: 'Unliked',
    };
  }
}

module.exports = AlbumLikeHandler;
