import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ResponseInterceptor } from './shared/infrastructure/interceptors/response.interceptor';
import { HttpExceptionFilter } from './shared/infrastructure/filters/http-exception.filter';
import { BadRequestException, ValidationPipe } from '@nestjs/common';
import { DocumentBuilder } from '@nestjs/swagger';
import { SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Swagger setup
  const config = new DocumentBuilder()
    .setTitle('DDD Notes API')
    .setDescription('The Notes API description')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);
  
  // Validation pipe
  // TODO : Create a better error handling for validation errors
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true,
    exceptionFactory: (errors) => {
      const nonWhitelistedErrors = errors.filter(error => error.constraints?.whitelistValidation);
      if (nonWhitelistedErrors.length) {
        const invalidFields = nonWhitelistedErrors.map(error => error.property).join(', ');
        throw new BadRequestException(`Invalid fields detected: ${invalidFields}`);
      }

      throw new BadRequestException('Empty fields are not allowed');
    }
  }));
  // Response interceptor
  app.useGlobalInterceptors(new ResponseInterceptor());
  // Exception filter
  app.useGlobalFilters(new HttpExceptionFilter());

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
