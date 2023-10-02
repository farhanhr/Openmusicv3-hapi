const { Pool } = require('pg');
const { nanoid } = require('nanoid');
const InvariantError = require('../../exceptions/InvariantError');
const NotFoundError = require('../../exceptions/NotFoundError');

class AlbumLikeService {
  constructor(cacheService) {
    this._pool = new Pool();
    this._cacheService = cacheService;
  }

  async addAlbumLike(userId, albumId) {
    const id = `like-${nanoid(16)}`;
    const query = {
      text: 'INSERT INTO user_album_likes VALUES($1, $2, $3) RETURNING id',
      values: [id, userId, albumId],
    };

    const result = await this._pool.query(query);

    if (!result.rows[0].id) {
      throw new InvariantError('Like gagal');
    }

    await this._cacheService.delete(`albums:likes:${albumId}`);

    return result.rows[0].id;
  }

  async getLikes(albumId) {
    try {
      const result = await this._cacheService.get(`albums:likes:${albumId}`);

      return {
        source: 'cache',
        likes: Number(result),
      };
    } catch (error) {
      const query = {
        text: `SELECT * FROM user_album_likes
        WHERE album_id = $1`,
        values: [albumId],
      };
      const result = await this._pool.query(query);

      await this._cacheService.set(`albums:likes:${albumId}`, result.rowCount);

      return {
        source: 'postgres',
        likes: result.rowCount,
      };
    }
  }

  async isLiked(userId, albumId) {
    const query = {
      text: 'SELECT * FROM user_album_likes WHERE user_id = $1 AND album_id = $2',
      values: [userId, albumId],
    };

    const { rows } = await this._pool.query(query);

    return rows.length > 0;
  }

  async deleteLikes(userId, albumId) {
    const query = {
      text: 'DELETE FROM user_album_likes WHERE user_id = $1 AND album_id = $2 RETURNING id',
      values: [userId, albumId],
    };

    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new NotFoundError('fail');
    }

    await this._cacheService.delete(`albums:likes:${albumId}`);
  }
}

module.exports = AlbumLikeService;
