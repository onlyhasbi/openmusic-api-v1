const { Pool } = require('pg');
const { nanoid } = require('nanoid');
const { defaultDataAlbums } = require('../../utils/defaultData');
const NotFoundError = require('../../exceptions/NotFoundError');
const InvariantError = require('../../exceptions/InvariantError');

class AlbumsService {
  constructor() {
    this._pool = new Pool();
  }

  async addAlbum({ name, year }) {
    const id = `album-${nanoid(16)}`;

    const query = {
      text: `INSERT INTO albums VALUES($1,$2,$3) RETURNING id`,
      values: [id, name, year],
    };
    const { rows } = await this._pool.query(query);

    if (!rows[0].id) {
      throw new InvariantError('album gagal ditambahkan');
    }

    return { album_id: rows[0].id };
  }

  async getAlbumById(id) {
    const queryAlbum = {
      text: `SELECT * FROM albums WHERE id=$1`,
      values: [id],
    };

    const { rows: album } = await this._pool.query(queryAlbum);

    if (!album.length) {
      throw new NotFoundError('album tidak ditemukan');
    }

    const querySongs = {
      text: `SELECT id,title,performer FROM songs WHERE album_id=$1`,
      values: [id],
    };

    const songResult = await this._pool.query('SELECT * FROM songs');
    const { rows: songs } = songResult.rows.length
      ? await this._pool.query(querySongs)
      : songResult;

    return {
      album: {
        ...album.map(defaultDataAlbums)[0],
        songs: [...songs],
      },
    };
  }

  async editAlbumById(id, { name, year }) {
    const query = {
      text: `UPDATE albums set name=$1, year=$2 WHERE id=$3 RETURNING id`,
      values: [name, year, id],
    };

    const { rows } = await this._pool.query(query);

    if (!rows.length) {
      throw new NotFoundError('gagal memperbarui album. id tidak ditemukan');
    }
  }

  async deleteAlbumById(id) {
    const query = {
      text: `DELETE FROM albums WHERE id=$1 RETURNING id`,
      values: [id],
    };
    const { rowCount } = await this._pool.query(query);
    if (!rowCount) {
      throw new NotFoundError('gagal menghapus album. id tidak ditemukan');
    }
  }
}

module.exports = AlbumsService;
