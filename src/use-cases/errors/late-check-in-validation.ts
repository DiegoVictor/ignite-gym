export class LateCheckInValidation extends Error {
  public readonly statusCode = 400;
  constructor() {
    super("You can't validate a check-in after 20 minutes of its creation");
  }
}
