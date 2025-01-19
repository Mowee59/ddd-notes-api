import { Inject, Injectable } from '@nestjs/common';
import { UseCase } from 'src/shared/core/UseCase';
import { LoginDTO } from './login-dto';
import { IUserRepo } from 'src/user/domain/interfaces/user-repository.interface';
import { User } from 'src/user/domain/entities/user';
import { UserEmail } from 'src/user/domain/value-objects/userEmail';
import { UserPassword } from 'src/user/domain/value-objects/userPassword';
import { Result, Either, left, right } from 'src/shared/core/Result';
import { LoginUseCaseErrors } from './login-errors';
import { AppError } from 'src/shared/core/AppError';

type Response = Either<
  | LoginUseCaseErrors.InvalidCredentialsError
  | LoginUseCaseErrors.UserNotFoundError
  | LoginUseCaseErrors.PasswordIncorrectError
  | AppError.UnexpectedError,
  any
>;

@Injectable()
export class LoginUseCase implements UseCase<LoginDTO, Promise<Response>> {
  constructor(@Inject('IUserRepo') private readonly userRepo: IUserRepo) {}

  async execute(request: LoginDTO): Promise<Response> {
    let user: User;
    let userEmail: UserEmail;
    let password: UserPassword;

    try {
      const userEmailOrError = UserEmail.create(request.email);
      const passwordOrError = UserPassword.create({ value: request.password });
      const result = Result.combine([userEmailOrError, passwordOrError]);

      if (result.isFailure) {
        return left(new LoginUseCaseErrors.InvalidCredentialsError());
      }

      userEmail = userEmailOrError.getValue();
      password = passwordOrError.getValue();

      user = await this.userRepo.getUserByEmail(userEmail);

      const userFound = !!user;

      if (!userFound) {
        return left(new LoginUseCaseErrors.UserNotFoundError());
      }

      const passwordValid = await user.password.comparePassword(password.value);

      if (!passwordValid) {
        console.log('password incorrect');
        return left(new LoginUseCaseErrors.PasswordIncorrectError());
      }

      return right(user);
    } catch (error) {
      return left(new AppError.UnexpectedError(error.toString()));
    }
  }
}
