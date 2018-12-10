import { Logger, transports, format } from 'winston';
import * as winston from 'winston';

export const logger: Logger = winston.createLogger({
  level: 'info',
  format: format.json(),
  transports: [
    //
    // - Write to all logs with level `info` and below to `combined.log`
    // - Write all logs error (and below) to `error.log`.
    //
    new transports.File({ filename: 'error.log', level: 'error' }),
    new transports.File({ filename: 'combined.log' }),
  ],
});

//
// If we're not in production then log to the `console` with the format:
// `${info.level}: ${info.message} JSON.stringify({ ...rest }) `
//
if (process.env.NODE_ENV !== 'production') {
  logger.add(new transports.Console({
    format: format.combine(
      format.timestamp(),
      format.colorize(),
      format.printf(msg => {
        return `[${msg.level}]  - ${msg.timestamp}    ${msg.message}${msg.response ? '   ' + JSON.stringify(msg.response) : ''}`;
      }),
    ),
  }));
}