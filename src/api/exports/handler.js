class ExportsHandler {
  constructor(service, playlistsService, validator) {
    this._service = service;
    this._playlistsService = playlistsService;
    this._validator = validator;
  }

  async postExportSongsHandler(request, h) {
    this._validator.validateExportSongsPayload(request.payload);
    const { playlistId } = request.params;
    const { id: credentialsId } = request.auth.credentials;

    await this._playlistsService.verifyPlaylistOwner(playlistId, credentialsId);

    const message = {
      playlistId,
      targetEmail: request.payload.targetEmail,
    };

    await this._service.sendMessage('export:playlistSongs', JSON.stringify(message));

    const response = h.response({
      status: 'success',
      message: 'Permintaan Anda sedang kami proses',
    });
    response.code(201);
    return response;
  }
}

module.exports = ExportsHandler;
