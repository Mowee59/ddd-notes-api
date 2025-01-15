import { Module } from '@nestjs/common';
import { GetUserByIdUseCase } from './useCases/GetUserById/GetUserById.service';

@Module({
  providers: [GetUserByIdUseCase],
  exports: [GetUserByIdUseCase],
})
export class UserModule {}
