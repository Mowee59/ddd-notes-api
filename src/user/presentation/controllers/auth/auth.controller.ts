import { Controller, Post, HttpStatus, Res, Body, ValidationPipe, HttpException, UseInterceptors } from '@nestjs/common';
import { LoginUseCase } from '../../../application/use-cases/login/login.usecase';
import { LoginUseCaseErrors } from '../../../application/use-cases/login/login-errors';
import { ResponseInterceptor } from 'src/shared/infrastructure/interceptors/response.interceptor';
import { LoginRequestDTO } from './login.request.dto';
import { ApiResponse } from '@nestjs/swagger';
import { LoginResponseDTO } from './Login.response.dto';
import { ApiOperation } from '@nestjs/swagger';



// TODO : implement response consistent format
@Controller('auth')
@UseInterceptors(ResponseInterceptor)
export class AuthController {
  constructor(private readonly loginUseCase: LoginUseCase) {}


  
  @Post('login')
  @ApiOperation({ summary: 'Login user' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'User logged in successfully',
    type: LoginResponseDTO,
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Invalid credentials provided',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'User not found',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Password incorrect',
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description: 'Internal server error',
  })
 // TODO : Add error for excessive fields

  public async login( @Body(ValidationPipe) loginDto: LoginRequestDTO) : Promise<LoginResponseDTO> {
    const result = await this.loginUseCase.execute(loginDto);

    if (result.isLeft()) {
      const error = result.value;
      let statusCode: HttpStatus;

      switch (error.constructor) {
        case LoginUseCaseErrors.InvalidCredentialsError:
          statusCode = HttpStatus.BAD_REQUEST;
          break;
        case LoginUseCaseErrors.UserNotFoundError:
          statusCode = HttpStatus.NOT_FOUND;
          break;
        case LoginUseCaseErrors.PasswordIncorrectError:
          statusCode = HttpStatus.UNAUTHORIZED;
          break;
        default:
          statusCode = HttpStatus.INTERNAL_SERVER_ERROR;
      }

      throw new HttpException(
        error.getErrorValue().message,
        statusCode
      );
    }

    return result.value;
  }
}
