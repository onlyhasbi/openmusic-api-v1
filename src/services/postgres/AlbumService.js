const { Pool } = require('pg');
const { nanoid } = require('nanoid');
const { defaultDataAlbum } = require('../../utils/defaultData');
const NotFoundError = require('../../exceptions/NotFoundError');
const InvariantError = require('../../exceptions/InvariantError');

class AlbumService {
  constructor() {
    this._pool = new Pool();
  }

  async addAlbum({ name, year }) {
    const id = `album-${nanoid(16)}`;

    const query = {
      text: `INSERT INTO album VALUES($1,$2,$3) RETURNING id`,
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
      text: `SELECT * FROM album WHERE id=$1`,
      values: [id],
    };

    const { rows: album } = await this._pool.query(queryAlbum);

    if (!album.length) {
      throw new NotFoundError('album tidak ditemukan');
    }

    const querySongs = {
      text: `SELECT id,title,performer FROM song WHERE "albumId"=$1`,
      values: [id],
    };

    const songResult = await this._pool.query('SELECT * FROM song');
    const { rows: songs } = songResult.rows.length
      ? await this._pool.query(querySongs)
      : songResult;

    return {
      album: {
        ...album.map(defaultDataAlbum)[0],
        songs: [...songs],
      },
    };
  }

  async editAlbumById(id, { name, year }) {
    const query = {
      text: `UPDATE album set name=$1, year=$2 WHERE id=$3 RETURNING id`,
      values: [name, year, id],
    };

    const { rows } = await this._pool.query(query);

    if (!rows.length) {
      throw new NotFoundError('gagal memperbarui album. id tidak ditemukan');
    }
  }

  async deleteAlbumById(id) {
    const query = {
      text: `DELETE FROM album WHERE id=$1 RETURNING id`,
      values: [id],
    };
    const { rows } = await this._pool.query(query);
    if (!rows.length) {
      throw new NotFoundError('gagal menghapus album. id tidak ditemukan');
    }
  }
}

module.exports = AlbumService;
