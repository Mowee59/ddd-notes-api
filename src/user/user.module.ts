import { Module } from '@nestjs/common';
import { TempUserRepo } from './infrastructure/persistence/tempUserRepo';
import { LoginUseCase } from './application/use-cases/login/login.usecase';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [AuthModule],
  providers: [
    {
      provide: 'IUserRepo',
      useClass: TempUserRepo,
    },
    LoginUseCase,
  ],
  exports: [LoginUseCase],
})
export class UserModule {}
