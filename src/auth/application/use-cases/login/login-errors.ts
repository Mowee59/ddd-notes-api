import { UseCaseError } from 'src/shared/core/UseCaseError';
import { Result } from 'src/shared/core/Result';

// TODO implemente email not found

export namespace LoginUseCaseErrors {
  export class InvalidCredentialsError extends Result<UseCaseError> {
    constructor() {
      super(false, {
        message: `Invalid credentials.`,
      } as UseCaseError);
    }
  }

  export class UserNotFoundError extends Result<UseCaseError> {
    constructor() {
      super(false, {
        message: `No user found with this email.`,
      } as UseCaseError);
    }
  }

  export class PasswordIncorrectError extends Result<UseCaseError> {
    constructor() {
      super(false, {
        message: `Password incorrect.`,
      } as UseCaseError);
    }
  }
}
