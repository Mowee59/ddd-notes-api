import { Module } from '@nestjs/common';
import { TempUserRepo } from './repo/implementations/tempUserRepo';
import { LoginUseCase } from './useCases/login/login.usecase';
@Module({
  providers: [ {
    provide : 'IUserRepo',
    useClass: TempUserRepo
  }, LoginUseCase],
  exports: [ 'IUserRepo', LoginUseCase],
})
export class UserModule {}
