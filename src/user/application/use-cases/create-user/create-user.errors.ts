import {  Result } from "src/shared/core/Result";
import { UseCaseError } from "src/shared/core/UseCaseError";

export namespace CreateUserUseCaseErrors {
  export class UserAlreadyExistsError extends Result<UseCaseError> {
    constructor(email: string) {
      super(false, {
        message: `User with this email (${email}) already exists`
      } as UseCaseError);
    }
  }
}