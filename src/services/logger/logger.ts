import { LoggingWinston } from "@google-cloud/logging-winston";
import winston, { Logger, type transport } from "winston";

export function createLogger(
  isCloudLogger: boolean,
  meta: Record<string, string | number | boolean>
): Logger {
  const transports: transport[] = [
    new winston.transports.Console(),
    // Add Cloud Logging
  ];
  if (isCloudLogger) {
    transports.push(new LoggingWinston());
  }
  return winston.createLogger({
    defaultMeta: meta,
    level: "silly",
    transports,
  });
}
