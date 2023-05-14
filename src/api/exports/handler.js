class ExportsHandler {
  constructor(playlistsService, service, validator) {
    this._playlistsService = playlistsService;
    this._service = service;
    this._validator = validator;
  }

  async postExportPlaylistSongsHandler({ auth, params, payload }, h) {
    this._validator.validateExportPlaylistSongsPayload(payload);

    const { id: playlistId } = params;
    const { id: userId } = auth.credentials;
    const { targetEmail } = payload;

    await this._playlistsService.verifyPlaylistOwner(playlistId, userId);

    const message = {
      data: {
        playlistId,
        userId,
      },
      targetEmail,
    };

    await this._service.sendMessage('export:playlist', JSON.stringify(message));

    const response = h.response({
      status: 'success',
      message: 'Permintaan anda dalam antrian',
    });

    response.code(201);
    return response;
  }
}

module.exports = ExportsHandler;
