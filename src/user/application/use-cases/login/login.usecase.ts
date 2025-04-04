import { Inject, Injectable } from '@nestjs/common';
import { UseCase } from 'src/shared/core/UseCase';
import { LoginDTO } from './login-dto';
import { IUserRepo } from 'src/user/domain/interfaces/user-repository.interface';
import { User } from 'src/user/domain/entities/user';
import { UserEmail } from 'src/user/domain/value-objects/userEmail';
import { UserPassword } from 'src/user/domain/value-objects/userPassword';
import { Result, Either, left, right } from 'src/shared/core/Result';
import { LoginUseCaseErrors } from './login.errors';
import { AppError } from 'src/shared/core/AppError';
import { AuthService } from 'src/user/application/services/auth/auth.service';
import { LoginDTOResponse } from './login-dto-response';

// TODO : See if need for try catch to handle unexpected errors

type Response = Either<
  LoginUseCaseErrors.InvalidCredentialsError |
  LoginUseCaseErrors.UserNotFoundError |
  LoginUseCaseErrors.PasswordIncorrectError |
  AppError.UnexpectedError,
  LoginDTOResponse
>;

@Injectable()
export class LoginUseCase implements UseCase<LoginDTO, Promise<Response>> {
  constructor(
    @Inject('IUserRepo') private readonly userRepo: IUserRepo,
    private readonly authService: AuthService,
  ) {}

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

      // TODO rename this error for something more understandable and remove the console.log
      if (!passwordValid) {
        console.log('password incorrect');
        return left(new LoginUseCaseErrors.PasswordIncorrectError());
      }

      // TODO add isEmailVerified
      const accessToken = await this.authService.signJWT({
        sub: user.id.toString(),
        email: user.email.value,
      });

      // TODO : Handle refresh token
      user.setAccessToken(accessToken);

      // TODO : Add a metod to save authenticated user for session 

      return right({
        accessToken,
        userEmail: user.email.value,
      });
    } catch (error) {
      return left(new AppError.UnexpectedError(error.toString()));
    }
  }
}
