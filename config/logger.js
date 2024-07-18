const fs = require('fs');
const path = require('path')
const { createLogger, format, transports } = require('winston');
const { combine, timestamp, printf } = format;
require("winston-daily-rotate-file");


const winston = require('winston');


winston.addColors({
  error: 'red',
  warn: 'yellow',
  info: 'green',
  http: 'magenta',
  debug: 'white'
});

/* CREATE LOGS DIRECTORY */
const logsDir = path.join(__dirname,'../public/logs') 


if (!fs.existsSync(logsDir)) {
    fs.mkdirSync(logsDir);
}

// Define log format
const logFormat = printf(({ level, message, timestamp }) => {
    return `${timestamp} ${level}: ${message}`;
});


/* CREATE A LOG FILE FOR DAILY FORMAT */
 const err = new winston.transports.DailyRotateFile({
    filename: `./public/logs/error/${'error'}-%DATE%.log`,
    maxsize: 5242880, // 5MB
    maxFiles: 5,
  datePattern: "YYYY-MM-DD",
  maxFiles: "30d",
  level: "error",
})
const alert =new winston.transports.DailyRotateFile({
      filename: `./public/logs/alerts/${'alerts'}-%DATE%.log`,
    maxsize: 5242880, // 5MB
    maxFiles: 5,
  datePattern: "YYYY-MM-DD",
  maxFiles: "30d",
  level: "alerts",
})
const info = new winston.transports.DailyRotateFile({
    filename: `./public/logs/info/${'info'}-%DATE%.log`,
    maxsize: 5242880, // 5MB
    maxFiles: 5,
  datePattern: "YYYY-MM-DD",
  maxFiles: "30d",
  level: "info",
})


// Create a logger instance
const logger = createLogger({
    format: combine(
        timestamp(),
        logFormat(),
        // printf(({ level, message, timestamp }) => {
        //     return `${timestamp} ${level}: ${message}`;
        // })
    ),
    transports: [
        err,
        alert,
        info
    ]
});


module.exports = logger;