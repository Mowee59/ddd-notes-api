import { Either, left, Result, right } from "src/shared/core/Result";
import { CreateUserUseCaseErrors } from "./create-user.errors";
import { AppError } from "src/shared/core/AppError";
import { IUserRepo } from "src/user/domain/interfaces/user-repository.interface";
import { UseCase } from "src/shared/core/UseCase";
import { Inject, Injectable } from "@nestjs/common";
import { CreateUserDTO } from "./create-user.dto";
import { UserEmail } from "src/user/domain/value-objects/userEmail";
import { UserPassword } from "src/user/domain/value-objects/userPassword";
import { User } from "src/user/domain/entities/user";
import { UserMap } from "src/user/mappers/userMap";


type Response = Either<
  CreateUserUseCaseErrors.UserAlreadyExistsError |
  AppError.UnexpectedError|
  Result<any>,
  Result<void> 
  >
  
  @Injectable()
  export class CreateUserUseCase implements UseCase<CreateUserDTO, Promise<Response>> {

    constructor(
      @Inject('IUserRepo') private readonly userRepo: IUserRepo) {}

    public async execute(request: CreateUserDTO): Promise<Response> {

      const emailOrError = UserEmail.create(request.email);
      const passwordOrError = UserPassword.create({ value: request.password });
      const dtoResult = Result.combine([emailOrError, passwordOrError]);

      // TODO : improve this error handling
      if (dtoResult.isFailure) {
        return left(Result.fail<void>(dtoResult.getErrorValue().toString())) ;
      }

      const email = emailOrError.getValue();
      const password = passwordOrError.getValue();

      try{
        const userAlreadyExists = await this.userRepo.exists(email);

        if(userAlreadyExists){
          return left(new CreateUserUseCaseErrors.UserAlreadyExistsError(email.value))
        }

        const userOrError = User.create({
          email,
          password
        })

        if(userOrError.isFailure){
          return left(Result.fail<User>(userOrError.getErrorValue().toString()))
        }

        const user: User = userOrError.getValue();
 
        

        await this.userRepo.save(user);

        return right(Result.ok<void>());

      } catch(error) {
        return left(new AppError.UnexpectedError(error));
      }
      
    }
  }