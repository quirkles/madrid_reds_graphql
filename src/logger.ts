import { LoggingWinston } from "@google-cloud/logging-winston";
import winston, { Logger, type transport } from "winston";
import { appConfig } from "./config";

const transports: transport[] = [
  new winston.transports.Console(),
  // Add Cloud Logging
];

if (appConfig.IS_GCP) {
  transports.push(new LoggingWinston());
}
export function createLogger(
  meta: Record<string, string | number | boolean>
): Logger {
  return winston.createLogger({
    defaultMeta: meta,
    level: "silly",
    transports,
  });
}
