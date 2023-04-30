export class MaxDistanceCheckIn extends Error {
  public readonly statusCode = 400;
  constructor() {
    super('Maximum distance from the gym reached');
  }
}
