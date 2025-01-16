import { Module } from '@nestjs/common';
import { LoginUseCase } from './login/login.usecase';
import { AuthController } from './auth.controller';


@Module({
  providers: [LoginUseCase],
  controllers: [AuthController]
})
export class AuthModule {}
