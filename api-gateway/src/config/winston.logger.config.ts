import { AppSettingType, LoggerSettingType } from './configuration';
import { ConfigService } from '@nestjs/config';
import winston, { transports } from 'winston';
import DailyRotateFile from 'winston-daily-rotate-file';
import { utilities as nestWinstonModuleUtilities } from 'nest-winston';

export function winstonLoggerConfiguration(configService: ConfigService) {
  const appSettings: AppSettingType = configService.get('appSettings', {
    infer: true,
  });
  const serviceName = appSettings.serviceName;
  const loggerSettings: LoggerSettingType = configService.get('loggerSettings', {
    infer: true,
  });

  const timeFormat = 'YYYY-MM-DD HH:mm:ss';

  const { combine, prettyPrint, timestamp, errors } = winston.format;

  const transportFile: DailyRotateFile = new DailyRotateFile({
    filename: 'application-%DATE%.log',
    dirname: loggerSettings.logDir,
    datePattern: 'YYYY-MM-DD',
    maxFiles: '1d',
    maxSize: '20m',
    level: 'warn',
  });

  const transportConsole = new transports.Console({
    format: winston.format.combine(
      winston.format.timestamp(),
      winston.format.ms(),
      nestWinstonModuleUtilities.format.nestLike(serviceName, {
        colors: true,
        prettyPrint: true,
        processId: true,
        appName: true,
      }),
    ),
    level: 'silly',
  });

  return {
    format: combine(timestamp({ format: timeFormat }), errors({ stack: true }), prettyPrint()),
    transports: [transportFile, transportConsole],
    level: loggerSettings.loggerLevel,
  };
}
