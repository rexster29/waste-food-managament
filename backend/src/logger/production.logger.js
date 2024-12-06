const { createLogger, format, transports } = require('winston');

const { combine, timestamp, label, printf } = format;
const DailyRotateFile = require('winston-daily-rotate-file');

const myFormat = printf(({ level, message, label, timestamp }) => {
    return `${timestamp} ${label} [${level}]: ${message}`;
});

const productionLogger = () => {
    return createLogger({
        level: 'warn',
        format: combine(
            label({ label: 'production' }),
            timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
            myFormat
        ),
        transports: [
            new DailyRotateFile({
                filename: 'logs/error.log',
                level: 'error',
                datePattern: 'YYYY-MM-DD',
                maxFiles: '30d' // Retain files for 30 days
            }),
            new DailyRotateFile({
                filename: 'logs/combined.log',
                datePattern: 'YYYY-MM-DD',
                maxFiles: '40d' // Retain files for 40 days
            })
            // new transports.File({ filename: 'error.log', level: 'error' }),
            // new transports.File({ filename: 'combined.log' }),
            // new transports.Console()
        ]
    });
};   

module.exports = productionLogger;