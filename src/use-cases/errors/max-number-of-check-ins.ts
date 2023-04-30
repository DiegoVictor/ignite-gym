export class MaxNumberOfCheckIns extends Error {
  public readonly statusCode = 400;
  constructor() {
    super('Maximum number of check-ins reached');
  }
}
