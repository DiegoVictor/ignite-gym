export class NotFound extends Error {
  public readonly statusCode = 404;
  constructor() {
    super('Not Found');
  }
}
