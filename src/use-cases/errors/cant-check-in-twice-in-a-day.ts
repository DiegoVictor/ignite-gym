export class CantCheckInTwiceInADay extends Error {
  public readonly statusCode = 400;
  constructor() {
    super('You can not check in twice in a day');
  }
}
