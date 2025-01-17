import { Module } from '@nestjs/common';
import { LoginUseCase } from './application/use-cases/login/login.usecase';
import { AuthController } from './auth.controller';
import { UserModule } from 'src/user/user.module';

@Module({
  imports: [UserModule],
  providers: [
    LoginUseCase
  ],
  controllers: [AuthController],
})
export class AuthModule {}
