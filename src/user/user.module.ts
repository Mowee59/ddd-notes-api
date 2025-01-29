import { Module } from '@nestjs/common';
import { TempUserRepo } from './infrastructure/persistence/tempUserRepo';
import { LoginUseCase } from './application/use-cases/login/login.usecase';
import { AuthService } from './application/services/auth/auth.service';
import { JwtModule } from '@nestjs/jwt';
import { AuthController } from './presentation/controllers/auth/auth.controller';
import { JwtStrategy } from './infrastructure/auth';
import { PassportModule } from '@nestjs/passport';
import * as schema from 'src/drizzle/schemas';
import { CreateUserUseCase } from './application/use-cases/create-user/create-user.usecase';
import { SqlLiteUserRepo } from './infrastructure/persistence/sqlLiteUserRepo';
import { DrizzleModule } from 'src/drizzle/drizzle.module';
// TODO :  Use a secret key from env
@Module({
  imports: [
    DrizzleModule,
    PassportModule,
    JwtModule.register({
      global: true,
      secret: 'secret',
      signOptions: { expiresIn: '1h' },
    }),
  ],
  providers: [
    // Injecting the user repo
    {
      provide: 'IUserRepo',
      useClass: SqlLiteUserRepo,
    },
    // Injecting the user model
    {
      provide: 'USER_MODEL',
      useValue: schema.baseUsers,

    },
    LoginUseCase,
    CreateUserUseCase,
    AuthService,
    JwtStrategy,
  ],
  controllers: [AuthController],
  exports: [],
})
export class UserModule {}
