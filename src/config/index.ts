import { secretsLocal } from './secrets.local'
import { secretsDev } from './secrets.dev'
import { secretsProd } from './secrets.prod'

import { configLocal } from './config.local'
import { configDev } from './config.dev'
import { configProd } from './config.prod'

export interface Config {
    CLOUD_NAME: string;
    EMAIL_ADDRESS: string;
    PORT: string;
}

export interface Secrets {
    CLOUD_API_KEY: string
    CLOUD_API_SECRET: string
    DATABASE_NAME: string
    DATABASE_HOST: string
    DATABASE_USERNAME: string
    DATABASE_PASSWORD: string
    JWT_PASSWORD: string
    EMAIL_PASSWORD: string
}

type Env = 'local' | 'dev' | 'production'

type AppConfig = Secrets & Config & { env: Env }

const DEFAULT_ENVIRONMENT = 'local' as const

let env: Env = DEFAULT_ENVIRONMENT

switch (process.env.ENVIRONMENT as Env | string) {
  case 'local':
    env = 'local'
    break
  case 'dev':
    env = 'dev'
    break
  case 'production':
    env = 'production'
    break
  default:
    console.log(`Encountered unexpected ENVIRONMENT env var: ${process.env.ENVIRONMENT}, falling back to ${DEFAULT_ENVIRONMENT}`)
}

let config: Config
let secrets: Secrets

switch (env) {
  case 'local':
    config = configLocal
    secrets = secretsLocal
    break
  case 'dev':
    config = configDev
    secrets = secretsDev
    break
  case 'production':
    config = configProd
    secrets = secretsProd
    break
}

export const appConfig: AppConfig = {
  ...config,
  ...secrets,
  env
}
