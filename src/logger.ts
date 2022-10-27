import { LoggingWinston } from '@google-cloud/logging-winston'
import winston, { Logger, loggers, type transport } from 'winston'
import { appConfig } from './config'

const transports: transport[] = [
  new winston.transports.Console()
  // Add Cloud Logging
]

if (appConfig.IS_GCP) {
  transports.push(new LoggingWinston())
}
export function createLogger (params: {
  executionId: string
}): Logger {
  return winston.createLogger({
    defaultMeta: { executionId: params.executionId },
    level: 'info',
    transports
  })
}
