import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ResponseInterceptor } from './shared/infrastructure/interceptors/response.interceptor';
import { HttpExceptionFilter } from './shared/infrastructure/filters/http-exception.filter';
import { BadRequestException, ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true,
    exceptionFactory: (errors) => {
      const nonWhitelistedErrors = errors.filter(error => error.constraints?.whitelistValidation);
      if (nonWhitelistedErrors.length) {
        const invalidFields = nonWhitelistedErrors.map(error => error.property).join(', ');
        throw new BadRequestException(`Invalid fields detected: ${invalidFields}`);
      }
    }
  }));
  app.useGlobalInterceptors(new ResponseInterceptor());
  app.useGlobalFilters(new HttpExceptionFilter());
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
