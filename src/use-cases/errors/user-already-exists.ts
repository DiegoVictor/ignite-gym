export class UserAlreadyExists extends Error {
  public readonly statusCode = 409;
  constructor() {
    super('User already exists');
  }
}
