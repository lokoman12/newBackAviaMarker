import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';
import * as cookieParser from 'cookie-parser';
// Расширим dayjs
import dayjs from './utils/dayjs';

declare const module: any;
  
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
    .setVersion(process.env.swaggerApiVersion)
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup(process.env.swaggerApiRelativePath, app, document);
  
  // app.use(cors());
  app.use(cookieParser());
  app.enableCors({ origin: true, credentials: true });
  await app.listen(parseInt(process.env.webPort));

  if (module.hot) {
    module.hot.accept();
    module.hot.dispose(() => app.close());
  }
}
bootstrap();