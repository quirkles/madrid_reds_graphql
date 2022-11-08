import { Config, configBase } from "./config.base";

export const configLocal: Config = {
  ...configBase,
  VERIFY_EMAIL_URL: "http://localhost:8080/verifyEmailHandler",
  AUTHENTICATE_URL: "http://localhost:8080/authenticateHandler",
  FRONTEND_URL: "http://localhost:4444",
};
