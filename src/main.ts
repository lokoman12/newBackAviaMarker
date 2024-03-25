import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true, stopAtFirstError: true, skipUndefinedProperties: true, skipNullProperties: true,
    })
  )

  const config = new DocumentBuilder()
    .setTitle('BackAviaMarker')
    .setDescription('Серверная часть АвиаМаркера')
    .setVersion(process.env.API_VERSION)
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup(process.env.API_RELATIVE_PATH, app, document);
  app.enableCors({ origin: true, credentials: true });
  await app.listen(parseInt(process.env.WEB_PORT));
}
bootstrap();