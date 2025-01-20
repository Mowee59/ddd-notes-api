import { Module } from '@nestjs/common';
import { TempUserRepo } from './infrastructure/persistence/tempUserRepo';
import { LoginUseCase } from './application/use-cases/login/login.usecase';
import { AuthService } from './application/services/auth/auth.service';
import { JwtModule } from '@nestjs/jwt';
import { AuthController } from './presentation/controllers/auth/auth.controller';

@Module({
  imports: [
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
  ],
  controllers: [AuthController],
  exports: [LoginUseCase],
})
export class UserModule {}
