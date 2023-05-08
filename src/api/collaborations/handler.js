class CollaborationsHandler {
  constructor(usersService, playlistsService, service, validator) {
    this._usersService = usersService;
    this._playlistsService = playlistsService;
    this._service = service;
    this._validator = validator;
  }

  async postCollaborationHandler({ auth, payload }, h) {
    this._validator.validateCollaborationPayload(payload);
    const { id: credentialId } = auth.credentials;
    const { playlistId, userId } = payload;

    await this._usersService.verifyUser(userId);
    await this._playlistsService.verifyPlaylistOwner(playlistId, credentialId);

    const collaborationId = await this._service.addCollaboration(
      playlistId,
      userId
    );

    const response = h.response({
      status: 'success',
      message: 'Kolaborasi berhasil ditambahkan',
      data: { collaborationId },
    });

    response.code(201);
    return response;
  }

  async deleteCollaborationHandler({ auth, payload }) {
    this._validator.validateCollaborationPayload(payload);
    const { id: credentialId } = auth.credentials;
    const { playlistId, userId } = payload;

    await this._playlistsService.verifyPlaylistOwner(playlistId, credentialId);
    await this._service.deleteCollaboration(playlistId, userId);
    return {
      status: 'success',
      message: 'Kolaborasi berhasil dihapus',
    };
  }
}

module.exports = CollaborationsHandler;
