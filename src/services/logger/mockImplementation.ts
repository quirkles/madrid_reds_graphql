import { createLogger } from "./logger";

// Logger is a huge thing to mock, only do what is needed here
class LoggerMock {
  info(...args: any) {
    return this as any;
  }

  debug(...args: any) {
    return this as any;
  }

  warn(...args: any) {
    return this as any;
  }
}

export function createLoggerMock(
  ...args: Parameters<typeof createLogger>
): Partial<ReturnType<typeof createLogger>> {
  return new LoggerMock();
}
