export default class HTTPException {
  constructor(statusCode, message) {
    this.statusCode = statusCode;
    this.message = message;
  }
}
