const { Pool } = require('pg');
const { nanoid } = require('nanoid');
const InvariantError = require('../../exceptions/InvariantError');

class PlaylistActivities {
  constructor() {
    this._pool = new Pool();
  }

  async addActivity(payload) {
    const id = `playlist-activity-${nanoid(16)}`;
    const { playlistId, songId, userId, action, time } = payload;

    const query = {
      text: 'INSERT INTO playlist_song_activities VALUES($1,$2,$3,$4,$5,$6) RETURNING id',
      values: [id, playlistId, songId, userId, action, time],
    };

    const { rowCount } = await this._pool.query(query);

    if (!rowCount) {
      throw new InvariantError('aktivitas gagal ditambahkan');
    }
  }

  async getActivities(playlistId) {
    const query = {
      text: `SELECT 
      users.username,
      songs.title,
      playlist_song_activities.action,
      playlist_song_activities.time 
      FROM playlist_song_activities 
      LEFT JOIN songs ON playlist_song_activities.song_id = songs.id 
      LEFT JOIN users ON playlist_song_activities.user_id = users.id
      WHERE playlist_song_activities.playlist_id=$1`,
      values: [playlistId],
    };

    const { rows } = await this._pool.query(query);

    return rows;
  }
}

module.exports = PlaylistActivities;
