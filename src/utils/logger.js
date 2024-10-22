
import winston from 'winston';

const customLevels = {
    fatal: 0,
    error: 1,
    warning: 2,
    info: 3,
    http: 4,
    debug: 5,
};

winston.addColors({
    fatal: 'bold red',
    error: 'red',
    warning: 'yellow',
    info: 'green',
    http: 'magenta',
    debug: 'blue',
});

const devLogger = winston.createLogger({
    levels: customLevels,
    level: 'debug',
    format: winston.format.combine(
        winston.format.colorize(),
        winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
        winston.format.printf(
            ({ timestamp, level, message }) =>
                `${timestamp} ${level}: ${message}`
        )
    ),
    transports: [new winston.transports.Console()],
});

const prodLogger = winston.createLogger({
    levels: customLevels,
    level: 'info',
    format: winston.format.combine(
   
        winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
        winston.format.printf(
            ({ timestamp, level, message }) =>
                `${timestamp} ${level}: ${message}`
        )
    ),
    transports: [new winston.transports.Console(),
        new winston.transports.File({
            filename: './src/errorLogs.log',
            level: 'error',
            format: winston.format.combine(
                winston.format.timestamp(),
                winston.format.json()
            ),
        }),
    ],
});

const env = process.env.NODE_ENV || 'development';
export const logger = env === 'development' ? devLogger : prodLogger;

export const middLogger = (req, res, next) => {
    req.logger = logger;
    next();
};