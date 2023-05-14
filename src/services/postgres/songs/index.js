const { Pool } = require('pg');
const { nanoid } = require('nanoid');
const {
  defaultDataSong,
  defaultDataSongs,
} = require('../../../utils/defaultData');
const InvariantError = require('../../../exceptions/InvariantError');
const NotFoundError = require('../../../exceptions/NotFoundError');

class SongsService {
  constructor() {
    this._pool = new Pool();
  }

  async verifySongId(songId) {
    const query = {
      text: `SELECT * FROM songs WHERE id=$1`,
      values: [songId],
    };

    const { rowCount } = await this._pool.query(query);

    if (!rowCount) {
      throw new NotFoundError('lagu tidak ditemukan');
    }
  }

  async addSong(song) {
    const { title, year, performer, genre, duration, albumId } = song;

    const id = `song-${nanoid(16)}`;
    const query = {
      text: `INSERT INTO songs VALUES($1,$2,$3,$4,$5,$6,$7) RETURNING id`,
      values: [id, title, year, performer, genre, duration, albumId],
    };

    const { rows } = await this._pool.query(query);
    if (!rows[0].id) {
      throw new InvariantError('lagu gagal ditambahkan');
    }

    return { songId: rows[0].id };
  }

  async getSongs({ title, performer }) {
    const baseQuery = 'SELECT * FROM songs';

    let query = baseQuery;

    if (title) {
      query = {
        text: `${baseQuery} WHERE LOWER(title) LIKE LOWER($1)`,
        values: [`%${title}%`],
      };
    }

    if (performer) {
      query = {
        text: `${baseQuery} WHERE LOWER(performer) LIKE LOWER($1)`,
        values: [`%${performer}%`],
      };
    }

    if (title && performer) {
      query = {
        text: `${baseQuery} WHERE LOWER(title) LIKE LOWER($1) AND LOWER(performer) LIKE LOWER($2)`,
        values: [`%${title}%`, `%${performer}%`],
      };
    }

    const { rows } = await this._pool.query(query);
    return { songs: rows?.length ? rows.map(defaultDataSongs) : [] };
  }

  async getSongById(id) {
    const query = {
      text: `SELECT * FROM songs WHERE id=$1`,
      values: [id],
    };

    const { rows } = await this._pool.query(query);

    if (!rows.length) {
      throw new NotFoundError('lagu tidak ditemukan');
    }

    return {
      song: { ...rows.map(defaultDataSong)[0] },
    };
  }

  async editSongById(id, song) {
    const { title, year, genre, performer, duration, albumId } = song;

    const query = {
      text: `UPDATE songs SET title=$1, year=$2, genre=$3, performer=$4, duration=$5, album_id=$6 WHERE id=$7 RETURNING id`,
      values: [title, year, genre, performer, duration, albumId, id],
    };

    const { rows } = await this._pool.query(query);
    if (!rows.length) {
      throw new NotFoundError('gagal memperbarui lagu. id tidak ditemukan');
    }
  }

  async deleteSongById(id) {
    const query = {
      text: `DELETE FROM songs WHERE id=$1 RETURNING id`,
      values: [id],
    };

    const { rows } = await this._pool.query(query);

    if (!rows.length) {
      throw new NotFoundError('gagal menghapus lagu. id tidak ditemukan');
    }
  }
}

module.exports = SongsService;
