class AlbumsHandler {
  constructor(service, validator) {
    this._service = service;
    this._validator = validator;
  }

  async postAlbumHandler({ payload }, h) {
    this._validator.validateAlbumPayload(payload);
    const { album_id } = await this._service.addAlbum(payload);
    const response = h.response({
      status: 'success',
      data: { albumId: album_id },
    });
    response.code(201);
    return response;
  }

  async getAlbumByIdHandler({ params }, h) {
    const { id } = params;
    const { album } = await this._service.getAlbumById(id);
    const response = h.response({
      status: 'success',
      data: { album },
    });
    response.code(200);
    return response;
  }

  async editAlbumByIdHandler({ payload, params }) {
    this._validator.validateAlbumPayload(payload);
    const { id } = params;
    await this._service.editAlbumById(id, payload);
    return { status: 'success', message: 'album berhasil diperbarui' };
  }

  async deleteAlbumByIdHandler({ params }) {
    const { id } = params;
    await this._service.deleteAlbumById(id);
    return { status: 'success', message: 'album berhasil dihapus' };
  }
}

module.exports = AlbumsHandler;
