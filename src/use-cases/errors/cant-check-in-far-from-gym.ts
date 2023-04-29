export class CantCheckInFarFromGym extends Error {
  public readonly statusCode = 400;
  constructor() {
    super('You can not check in far from the gym');
  }
}
