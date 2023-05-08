class PlaylistsHandler {
  constructor(
    playlistActivities,
    playlistSongsService,
    songsService,
    service,
    validator
  ) {
    this._playlistActivities = playlistActivities;
    this._playlistSongsService = playlistSongsService;
    this._songsService = songsService;
    this._service = service;
    this._validator = validator;
  }

  async postPlaylistHandler({ auth, payload }, h) {
    this._validator.validatePlaylistPayload(payload);
    const { name } = payload;
    const { id: owner } = auth.credentials;

    const { playlist_id } = await this._service.addPlaylist({ name, owner });

    const response = h.response({
      status: 'success',
      data: { playlistId: playlist_id },
    });

    response.code(201);
    return response;
  }

  async getPlaylistsHandler({ auth }) {
    const { id } = auth.credentials;
    const playlists = await this._service.getPlaylists(id);

    return {
      status: 'success',
      data: { playlists },
    };
  }

  async deletePlaylistHandler({ auth, params }) {
    const { id: playlistId } = params;
    const { id: userId } = auth.credentials;

    await this._service.verifyPlaylistOwner(playlistId, userId);
    await this._service.deletePlaylist(playlistId);

    return {
      status: 'success',
      message: 'playlist berhasil dihapus',
    };
  }

  async postPlaylistSongHandler({ auth, payload, params }, h) {
    this._validator.validatePlaylistSongPayload(payload);

    const { songId } = payload;
    const { id: playlistId } = params;
    const { id: userId } = auth.credentials;

    await this._songsService.verifySongId(songId);
    await this._service.verifyPlaylistAccess(playlistId, userId);
    await this._playlistSongsService.addPlaylistSong({ playlistId, songId });

    const date = new Date();
    const activity = {
      playlistId,
      songId,
      userId,
      action: 'add',
      time: date.toISOString(),
    };
    await this._playlistActivities.addActivity(activity);

    const response = h.response({
      status: 'success',
      message: 'berhasil menambahkan lagu ke playlist',
    });

    response.code(201);
    return response;
  }

  async getPlaylistsSongHandler({ auth, params }) {
    const { id: playlistId } = params;
    const { id: userId } = auth.credentials;

    await this._service.verifyPlaylistAccess(playlistId, userId);
    const playlistSongs = await this._playlistSongsService.getPlaylistSongs(
      playlistId
    );
    return {
      status: 'success',
      data: playlistSongs,
    };
  }

  async deletePlaylistSongHandler({ auth, payload, params }) {
    this._validator.validatePlaylistSongPayload(payload);

    const { songId } = payload;
    const { id: playlistId } = params;
    const { id: userId } = auth.credentials;

    await this._service.verifyPlaylistAccess(playlistId, userId);
    await this._playlistSongsService.deletePlaylistSong(playlistId, songId);

    const date = new Date();
    const activity = {
      playlistId,
      songId,
      userId,
      action: 'delete',
      time: date.toISOString(),
    };

    await this._playlistActivities.addActivity(activity);

    return {
      status: 'success',
      message: 'lagu berhasil dihapus dari playlist',
    };
  }

  async getPlaylistActivities({ auth, params }) {
    const { id: userId } = auth.credentials;
    const { id: playlistId } = params;

    await this._service.verifyPlaylistOwner(playlistId, userId);
    const playlistActivities = await this._playlistActivities.getActivities(
      playlistId
    );

    return {
      status: 'success',
      data: {
        playlistId,
        activities: playlistActivities,
      },
    };
  }
}

module.exports = PlaylistsHandler;
