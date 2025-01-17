import {
  Controller,
  Post,
  HttpCode,
  HttpStatus,
  NotImplementedException,
  HttpException,
  NotFoundException,
  UnauthorizedException,
  InternalServerErrorException,
} from '@nestjs/common';
import { LoginUseCase } from './application/use-cases/login/login.usecase';
import { LoginUseCaseErrors } from './application/use-cases/login/login-error';

@Controller('auth')
export class AuthController {
  constructor(private readonly loginUseCase: LoginUseCase) {}

  @Post('login')
  public async login() {
    const result = await this.loginUseCase.execute({
      email: 'tessdt.com',
      password: 'pqassword',
    });

    if (result.isLeft()) {
      switch(result.value.constructor) {
        case LoginUseCaseErrors.InvalidCredentialsError:
          return {
            status: HttpStatus.BAD_REQUEST,
            message: result.value.getErrorValue().message
          };
        case LoginUseCaseErrors.UserNotFoundError:
          return {
            status: HttpStatus.NOT_FOUND,
            message: result.value.getErrorValue().message
          };
        case LoginUseCaseErrors.PasswordIncorrectError:
          return {
            status: HttpStatus.UNAUTHORIZED,
            message: result.value.getErrorValue().message
          };
        default:
          return {
            status: HttpStatus.INTERNAL_SERVER_ERROR,
            message: result.value.getErrorValue().message
          };
      }
    } else if (result.isRight()) {
      return {
        status: HttpStatus.OK,
        message: result.value
      };
    }
  }
}
