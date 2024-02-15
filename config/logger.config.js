import winston from "winston";

const logger = winston.createLogger({
  level: "info",
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.printf((info) => {
      return `${info.timestamp} >> ${info.level}: ${info.message}`;
    }),
    winston.format.prettyPrint()
  ),
  transports: [
    new winston.transports.File({ filename: "app-error.log", level: "error" }),
    new winston.transports.File({ filename: "app-combined.log" }),
  ],
  defaultMeta: { service: "app-logger" },
});

export default logger;
