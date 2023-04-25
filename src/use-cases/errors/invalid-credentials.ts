export class InvalidCredentials extends Error {
  public readonly statusCode = 400;
  constructor() {
    super('Invalid credentials');
  }
}
