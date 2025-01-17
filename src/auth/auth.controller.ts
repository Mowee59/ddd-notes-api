import {
  Controller,
  Post,
  HttpCode,
  HttpStatus,
  NotImplementedException,
} from '@nestjs/common';
import { LoginUseCase } from 'src/user/application/useCases/login/login.usecase';

@Controller('auth')
export class AuthController {
  constructor(private readonly loginUseCase: LoginUseCase) {}

  @Post('login')
  public async login() {
    this.loginUseCase.execute({
      email: 'test@test.com',
      password: 'tzeazeest',
    });
  }
}
