import { Controller, Post, HttpStatus, Res, Body, ValidationPipe, HttpException, UseInterceptors, NotImplementedException } from '@nestjs/common';
import { LoginUseCase } from '../../../application/use-cases/login/login.usecase';
import { LoginUseCaseErrors } from '../../../application/use-cases/login/login.errors';
import { ResponseInterceptor } from 'src/shared/infrastructure/interceptors/response.interceptor';
import { LoginRequestDTO } from './login.request.dto';
import { ApiResponse } from '@nestjs/swagger';
import { LoginResponseDTO } from './login.response.dto';
import { ApiOperation } from '@nestjs/swagger';
import { RegisterRequestDTO } from './register.request.dto';
import { CreateUserUseCase } from '../../../application/use-cases/create-user/create-user.usecase';
import { CreateUserUseCaseErrors } from 'src/user/application/use-cases/create-user/create-user.errors';

// TODO : implement response consistent format
@Controller('auth')
@UseInterceptors(ResponseInterceptor)
export class AuthController {
  constructor(
    private readonly loginUseCase: LoginUseCase, 
    private readonly createUserUseCase: CreateUserUseCase) {}


  
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

  @Post('register')
  @ApiOperation({ summary: 'Register user' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'User registered successfully',
  })
  public async register(@Body(ValidationPipe) registerDto: RegisterRequestDTO) : Promise<void> { 
    console.log(registerDto)
    const result = await this.createUserUseCase.execute(registerDto);

    if (result.isLeft()) {
      const error = result.value;
      let statusCode: HttpStatus;

      switch (error.constructor) {
        case CreateUserUseCaseErrors.UserAlreadyExistsError:
          statusCode = HttpStatus.BAD_REQUEST;
          break;
      }
      throw new HttpException(result.value.getErrorValue().message, HttpStatus.BAD_REQUEST);
    }

    return;

  }
  
}
