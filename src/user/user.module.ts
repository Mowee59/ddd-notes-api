import { Module } from '@nestjs/common';
import { TempUserRepo } from './infrastructure/persistence/tempUserRepo';
import { LoginUseCase } from './application/use-cases/login/login.usecase';
import { AuthService } from './application/services/auth/auth.service';
import { JwtModule } from '@nestjs/jwt';
import { AuthController } from './presentation/controllers/auth/auth.controller';
import { JwtStrategy } from './infrastructure/auth';
import { PassportModule } from '@nestjs/passport';

// TODO :  Use a secret key from env
@Module({
  imports: [
    PassportModule,
    JwtModule.register({
      global: true,
      secret: 'secret',
      signOptions: { expiresIn: '1h' },
    }),
  ],
  providers: [
    {
      provide: 'IUserRepo',
      useClass: TempUserRepo,
    },
    LoginUseCase,
    AuthService,
    JwtStrategy,
  ],
  controllers: [AuthController],
  exports: [LoginUseCase],
})
export class UserModule {}
