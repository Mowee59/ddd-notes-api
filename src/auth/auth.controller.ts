import { Controller, HttpCode, HttpStatus, NotImplementedException, Post } from '@nestjs/common';
import { LoginUseCase } from './login/login.usecase';
@Controller('auth')
export class AuthController {

  constructor(private readonly loginUseCase: LoginUseCase){}

  @HttpCode(HttpStatus.OK)
  @Post('login')
  login(){
    throw new NotImplementedException('not implemented yet');
  }
}
