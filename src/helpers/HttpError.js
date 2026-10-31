// Error con código HTTP, para responder desde los controladores con "throw"
class HttpError extends Error {
  constructor(status, mensaje) {
    super(mensaje);
    this.status = status;
  }
}

module.exports = HttpError;
