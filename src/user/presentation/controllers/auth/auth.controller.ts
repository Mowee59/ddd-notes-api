import { Controller, Post, HttpStatus, Res, Body } from '@nestjs/common';
import { LoginUseCase } from '../../../application/use-cases/login/login.usecase';
import { LoginUseCaseErrors } from '../../../application/use-cases/login/login-errors';
import { LoginDTO } from '../../../application/use-cases/login/login-dto';

// TODO : implement response consistent format
@Controller('auth')
export class AuthController {
  constructor(private readonly loginUseCase: LoginUseCase) {}

  @Post('login')
  public async login(@Res() response, @Body() loginDto: LoginDTO) {
    const result = await this.loginUseCase.execute(loginDto);

    if (result.isLeft()) {
      switch (result.value.constructor) {
        case LoginUseCaseErrors.InvalidCredentialsError:
          return response.status(HttpStatus.BAD_REQUEST).json({
            message: result.value.getErrorValue().message,
          });

        case LoginUseCaseErrors.UserNotFoundError:
          return response.status(HttpStatus.NOT_FOUND).json({
            message: result.value.getErrorValue().message,
          });
        case LoginUseCaseErrors.PasswordIncorrectError:
          return response.status(HttpStatus.UNAUTHORIZED).json({
            message: result.value.getErrorValue().message,
          });

        default:
          return response.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
            message: result.value.getErrorValue().message,
          });
      }
    }

    return response.status(HttpStatus.OK).json(result.value);
  }
}
