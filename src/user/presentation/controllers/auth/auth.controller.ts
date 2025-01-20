import { Controller, Post, HttpStatus, Res } from '@nestjs/common';
import { LoginUseCase } from '../../../application/use-cases/login/login.usecase';
import { LoginUseCaseErrors } from '../../../application/use-cases/login/login-errors';
import { response } from 'express';

// TODO : implement response consistent format
@Controller('auth')
export class AuthController {
  constructor(private readonly loginUseCase: LoginUseCase) {}

  @Post('login')
  public async login(@Res() response) {
    const result = await this.loginUseCase.execute({
      email: 'test@test.com',
      password: 'password',
    });

    if (result.isLeft()) {
      switch (result.value.constructor) {
        case LoginUseCaseErrors.InvalidCredentialsError:
          return {
            status: HttpStatus.BAD_REQUEST,
            message: result.value.getErrorValue().message,
          };
        case LoginUseCaseErrors.UserNotFoundError:
          return {
            status: HttpStatus.NOT_FOUND,
            message: result.value.getErrorValue().message,
          };
        case LoginUseCaseErrors.PasswordIncorrectError:
          return {
            status: HttpStatus.UNAUTHORIZED,
            message: result.value.getErrorValue().message,
          };
        default:
          return {
            status: HttpStatus.INTERNAL_SERVER_ERROR,
            message: result.value.getErrorValue().message,
          };
      }
    }

    return response.status(HttpStatus.OK).json(result.value);
  }
}
