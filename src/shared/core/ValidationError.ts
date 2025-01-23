interface IValidationError {
  message: string;
}

export abstract class ValidationError implements IValidationError {
  public readonly message: string;

  constructor(message: string) {
    this.message = message;
  }
}