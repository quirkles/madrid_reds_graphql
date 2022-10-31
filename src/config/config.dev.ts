import { Config, configBase } from './config.base'

export const configDev: Config = {
  ...configBase,
  VERIFY_EMAIL_URL: 'https://mr-dev-verify-email-wgvygz45ba-uc.a.run.app/',
  FRONTEND_URL: 'http://localhost:4444'
}
