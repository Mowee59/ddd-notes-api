import { Controller, Post, HttpStatus, Res, Body, ValidationPipe, HttpException, UseInterceptors } from '@nestjs/common';
import { LoginUseCase } from '../../../application/use-cases/login/login.usecase';
import { LoginUseCaseErrors } from '../../../application/use-cases/login/login-errors';
import { LoginDTO } from '../../../application/use-cases/login/login-dto';
import { LoginDTOResponse } from 'src/user/application/use-cases/login/login-dto-response';
import { JsonApiResponse } from 'src/shared/api/JsonApiResponse.interface.';
import { ResponseInterceptor } from 'src/shared/infrastructure/interceptors/response.interceptor';
import { LoginRequestDTO } from './login.request.dto';


// TODO : implement response consistent format
@Controller('auth')
@UseInterceptors(ResponseInterceptor)
export class AuthController {
  constructor(private readonly loginUseCase: LoginUseCase) {}


  
  @Post('login')
  public async login( @Body(ValidationPipe) loginDto: LoginRequestDTO) {
    const result = await this.loginUseCase.execute(loginDto);

    if (result.isLeft()) {
      const errorMap = {
        [LoginUseCaseErrors.InvalidCredentialsError.name]: HttpStatus.BAD_REQUEST,
        [LoginUseCaseErrors.UserNotFoundError.name]: HttpStatus.NOT_FOUND,
        [LoginUseCaseErrors.PasswordIncorrectError.name]: HttpStatus.UNAUTHORIZED,
      };


      const statusCode = errorMap[result.value.constructor.name] || HttpStatus.INTERNAL_SERVER_ERROR;
      throw new HttpException(
        result.value.getErrorValue().message,
        statusCode
      );
    }

    return result.value;
  }
}
