import { left, Result, right } from "src/shared/core/Result";
import { Either } from "src/shared/core/Result";
import { AppError } from "src/shared/core/AppError";
import { DeleteUserUseCaseErrors } from "./delete-user.error";
import { Inject, Injectable, NotImplementedException } from "@nestjs/common";
import { DeleteUserDTO } from "./delete-user.dto";
import { IUserRepo } from "src/user/domain/interfaces/user-repository.interface";
import { UseCase } from "src/shared/core/UseCase";
import { UserId } from "src/user/domain/value-objects/userId";

type Response = Either<
  DeleteUserUseCaseErrors.UserNotFoundError |
  AppError.UnexpectedError,
  Result<void>
>

@Injectable()
export class DeleteUserUseCase implements UseCase<DeleteUserDTO, Promise<Response>> {

  constructor(
    @Inject('IUserRepo') private readonly userRepo: IUserRepo
  ) {}

  public async execute(request: DeleteUserDTO): Promise<Response> {
    try {
      const user = await this.userRepo.getUserById(request.userId);
      const userFound = !!user;

      if (!userFound) {
        return left(new DeleteUserUseCaseErrors.UserNotFoundError());
      }

      // TODO : Do not forget to implement user detelete method
      user.delete();
      // TODO : Refactor this to ensur consistency
      await this.userRepo.delete(user.id.toString());

      return right(Result.ok<void>());
    } catch (error) {
      return left(new AppError.UnexpectedError(error));
    }
  }
}