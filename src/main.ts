import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { Logger, LoggerService, ValidationPipe } from '@nestjs/common';
import * as cookieParser from 'cookie-parser';
import * as bodyParser from 'body-parser';
import { WinstonModule, utilities } from 'nest-winston';
import * as path from 'path';
import * as winston from 'winston';
import * as DailyRotateFile from 'winston-daily-rotate-file';
import { PrismaService } from './prisma/prisma.service';
import { ENGINEER_GROUP, ENGINEER_LOGIN, ENGINEER_PASSWORD } from './user/const';

declare const module: any;

export const AUTH_LABEL = 'auth';

const myLogFormat = winston.format.printf(({ level, message, timestamp }) =>
  `${timestamp} ${level?.toUpperCase()} ${message}`);

var commonFileTransport = new DailyRotateFile({
  level: 'info',
  dirname: path.join(__dirname, '../../logs'),
  filename: 'aviamarker-info-%DATE%.log',
  datePattern: 'YYYY-MM-DD',
  zippedArchive: true,
  maxSize: '20m',
  maxFiles: '60d',
  format: winston.format.combine(
    winston.format.timestamp(),
    myLogFormat,
  )
});

var authFileTransport = new DailyRotateFile({
  level: 'info',
  dirname: path.join(__dirname, '../../logs'),
  filename: 'aviamarker-auth-%DATE%.log',
  datePattern: 'YYYY-MM-DD',
  zippedArchive: true,
  maxSize: '20m',
  maxFiles: '60d',
  format: winston.format.combine(
    winston.format((info) => {
      return info.label === AUTH_LABEL ? info : false;
    })(),
    winston.format.timestamp(),
    myLogFormat,
  )
});

async function prepareDefaultUsers(prismaService: PrismaService, logger: LoggerService) {
  let engineer = await prismaService.auth.findUnique({
    where: {
      username: ENGINEER_LOGIN,
    },
  });
  if (!engineer) {
    logger.log('Create user: ' + ENGINEER_LOGIN);
    engineer = await prismaService.auth.create({
      data: {
        username: ENGINEER_LOGIN,
        password: ENGINEER_PASSWORD,
        roles:   ENGINEER_GROUP,
        position: 'system user',
      },
    });
  }
}


async function bootstrap() {
  const logger = WinstonModule.createLogger({
    transports: [
      new winston.transports.Console({
        format: winston.format.combine(
          winston.format.timestamp(),
          winston.format.ms(),
          utilities.format.nestLike('AviaMarker', {
            colors: true,
            prettyPrint: true,
            processId: true,
            appName: true,
          }),
        )
      }),
      commonFileTransport,
      authFileTransport,
    ],
  });
  const app = await NestFactory.create(AppModule, {
    logger,
  });

  const prismaService = app.get(PrismaService);
  await prepareDefaultUsers(prismaService, logger);

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
  app.use(bodyParser.json({ limit: '10mb' }));
  app.use(bodyParser.urlencoded({ limit: '10mb', extended: true }));
  app.use(cookieParser());
  app.enableCors({ origin: true, credentials: true });
  await app.listen(parseInt(process.env.webPort));

  if (module.hot) {
    module.hot.accept();
    module.hot.dispose(() => app.close());
  }
}

bootstrap();
