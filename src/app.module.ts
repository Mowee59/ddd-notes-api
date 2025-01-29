import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { DrizzleModule } from './drizzle/drizzle.module';

@Module({
  imports: [UserModule, DrizzleModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
