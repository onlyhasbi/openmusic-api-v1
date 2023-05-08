const { Pool } = require('pg');
const { nanoid } = require('nanoid');
const InvariantError = require('../../exceptions/InvariantError');

class PlaylistSongsService {
  constructor() {
    this._pool = new Pool();
  }

  async addPlaylistSong(payload) {
    const id = `playlist-song-${nanoid(16)}`;
    const { playlistId, songId } = payload;

    const query = {
      text: 'INSERT INTO playlist_songs VALUES($1,$2,$3) RETURNING id',
      values: [id, playlistId, songId],
    };

    const { rowCount } = await this._pool.query(query);

    if (!rowCount) {
      throw new InvariantError('gagal menyimpan lagu ke playlist');
    }
  }

  async getPlaylistSongs(playlistId) {
    let query = {
      text: `SELECT songs.id,songs.title,songs.performer FROM songs 
      LEFT JOIN playlist_songs ON songs.id = playlist_songs.song_id 
      WHERE playlist_songs.playlist_id=$1`,
      values: [playlistId],
    };

    const { rows: songs } = await this._pool.query(query);

    query = {
      text: `SELECT playlists.name, users.username FROM playlists 
      INNER JOIN users ON playlists.owner=users.id 
      WHERE playlists.id=$1`,
      values: [playlistId],
    };

    const { rows: playlist } = await this._pool.query(query);

    return {
      playlist: {
        id: playlistId,
        name: playlist[0].name,
        username: playlist[0].username,
        songs,
      },
    };
  }

  async deletePlaylistSong(playlistId, songId) {
    const query = {
      text: 'DELETE FROM playlist_songs WHERE playlist_id=$1 AND song_id=$2 RETURNING id',
      values: [playlistId, songId],
    };

    const { rowCount } = await this._pool.query(query);

    if (!rowCount) {
      throw new InvariantError('gagal menghapus lagu');
    }
  }
}

module.exports = PlaylistSongsService;
