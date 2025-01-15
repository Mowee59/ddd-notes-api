import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { AuthModuleModule } from './auth-module/auth-module.module';
import { AuthModule } from './auth/auth.module';
import { AuthModuleModule } from './auth-module/auth-module.module';

@Module({
  imports: [UserModule, AuthModuleModule, AuthModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
