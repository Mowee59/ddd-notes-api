import { Result } from './Result';
import { UseCaseError } from './UseCaseError';

export namespace AppError {
  export class UnexpectedError extends Result<UseCaseError> {
    public constructor(err: any) {
      super(false, {
        message: `An unexpected error occurred.`
      } as UseCaseError)
      console.log(`[AppError]: An unexpected error occurred`);
      console.error(err);
    }
  }
}

