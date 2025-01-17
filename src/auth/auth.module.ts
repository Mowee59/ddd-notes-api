import { Module } from '@nestjs/common';
import { Login } from './login/login.usecase';
import { AuthController } from './auth.controller';
import { UserModule } from 'src/user/user.module';

@Module({
  imports: [UserModule],
  providers: [
    Login
  ],
  controllers: [AuthController],
})
export class AuthModule {}
