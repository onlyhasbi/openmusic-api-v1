class SongHandler {
  constructor(service, validator) {
    this._service = service;
    this._validator = validator;
  }

  async postSongHandler({ payload }, h) {
    this._validator.validateSongPayload(payload);
    const { songId } = await this._service.addSong(payload);
    const response = h.response({
      status: 'success',
      data: { songId },
    });
    response.code(201);
    return response;
  }

  async getSongsHandler({ query }, h) {
    const { songs } = await this._service.getSongs(query);
    const response = h.response({
      status: 'success',
      data: { songs },
    });
    response.code(200);
    return response;
  }

  async getSongByIdHandler({ params }, h) {
    const { id } = params;
    const { song } = await this._service.getSongById(id);
    const response = h.response({
      status: 'success',
      data: { song },
    });
    response.code(200);
    return response;
  }

  async editSongByIdHandler({ payload, params }) {
    this._validator.validateSongPayload(payload);
    const { id } = params;
    await this._service.editSongById(id, payload);

    return { status: 'success', message: 'lagu berhasil diperbarui' };
  }

  async deleteSongByIdHandler({ params }) {
    const { id } = params;
    await this._service.deleteSongById(id);

    return { status: 'success', message: 'lagu berhasil dihapus' };
  }
}

module.exports = SongHandler;
