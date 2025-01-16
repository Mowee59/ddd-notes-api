import { Module } from '@nestjs/common';
import { TempUserRepo } from './repo/implementations/tempUserRepo';

@Module({
  providers: [TempUserRepo],
  exports: [TempUserRepo],
})
export class UserModule {}

