import { Module } from '@nestjs/common';
import { TempUserRepo } from './infrastructure/persistence/tempUserRepo';
import { LoginUseCase } from '../auth/application/use-cases/login/login.usecase';

@Module({
  providers: [ {
    provide : 'IUserRepo',
    useClass: TempUserRepo
  }, LoginUseCase],
  exports: [ 'IUserRepo', LoginUseCase],
})
export class UserModule {}
