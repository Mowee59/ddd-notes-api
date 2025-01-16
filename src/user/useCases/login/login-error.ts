import { UseCaseError } from 'src/shared/core/UseCaseError';
import { Result } from 'src/shared/core/Result';

// TODO implemente email not found

export namespace LoginUseCaseErrors {

export class UserNotFoundError extends Result<UseCaseError> {
  constructor () {
    super(false, {
      message: `Username or password incorrect.`
    } as UseCaseError)
  }
}

export class PasswordIncorrectError extends Result<UseCaseError> {
  constructor () {
    super(false, {
      message: `Password incorrect.`
    } as UseCaseError)
  }
}
}
