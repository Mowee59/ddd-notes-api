import { Result } from "src/shared/core/Result";
import { UseCaseError } from "src/shared/core/UseCaseError";

export namespace DeleteUserUseCaseErrors {
  export class UserNotFoundError extends Result<UseCaseError> {
    constructor() {
      super(false, {
        message: `User not found`,
      } as UseCaseError);
    }
  }
}