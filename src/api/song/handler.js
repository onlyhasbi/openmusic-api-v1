class SongHandler {
  constructor(service, validator) {
    this._service = service;
    this._validator = validator;
  }

  async postSongHandler(request, h) {
    this._validator.validateSongPayload(request.payload);
    const { songId } = await this._service.addSong(request.payload);
    const response = h.response({
      status: 'success',
      data: { songId },
    });
    response.code(201);
    return response;
  }

  async getSongsHandler(request, h) {
    const { songs } = await this._service.getSongs(request.query);
    const response = h.response({
      status: 'success',
      data: { songs },
    });
    response.code(200);
    return response;
  }

  async getSongByIdHandler(request, h) {
    const { id } = request.params;
    const { song } = await this._service.getSongById(id);
    const response = h.response({
      status: 'success',
      data: { song },
    });
    response.code(200);
    return response;
  }

  async editSongByIdHandler(request) {
    this._validator.validateSongPayload(request.payload);
    const { id } = request.params;
    await this._service.editSongById(id, request.payload);

    return { status: 'success', message: 'lagu berhasil diperbarui' };
  }

  async deleteSongByIdHandler(request) {
    const { id } = request.params;
    await this._service.deleteSongById(id);

    return { status: 'success', message: 'lagu berhasil dihapus' };
  }
}

module.exports = SongHandler;
