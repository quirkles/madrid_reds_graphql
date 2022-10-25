import { LoggingWinston } from '@google-cloud/logging-winston'
import winston, { type transport } from 'winston'
import { appConfig } from './config'

// Imports the Google Cloud client library for Winston

// Create a Winston logger that streams to Cloud Logging
// Logs will be written to: "projects/YOUR_PROJECT_ID/logs/winston_log"
const transports: transport[] = [
  new winston.transports.Console()
  // Add Cloud Logging
]

if (appConfig.env !== 'local') {
  transports.push(new LoggingWinston())
}

export const logger = winston.createLogger({
  level: 'info',
  transports
})
