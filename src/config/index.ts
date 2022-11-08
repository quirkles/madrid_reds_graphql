import { Secrets } from "./secrets.base";
import { secretsLocal } from "./secrets.local";
import { secretsDev } from "./secrets.dev";
import { secretsProd } from "./secrets.prod";

import { Config } from "./config.base";
import { configLocal } from "./config.local";
import { configDev } from "./config.dev";
import { configProd } from "./config.prod";

type Env = "local" | "dev" | "production";

export interface IAppConfig extends Secrets, Config {
  env: Env;
}

const DEFAULT_ENVIRONMENT = "local" as const;

let env: Env = DEFAULT_ENVIRONMENT;

switch (process.env.ENVIRONMENT as Env | string) {
  case "local":
    env = "local";
    break;
  case "dev":
    env = "dev";
    break;
  case "production":
    env = "production";
    break;
  default:
    console.log(
      `Encountered unexpected ENVIRONMENT env var: ${process.env.ENVIRONMENT}, falling back to ${DEFAULT_ENVIRONMENT}`
    );
}

let config: Config;
let secrets: Secrets;

switch (env) {
  case "local":
    config = configLocal;
    secrets = secretsLocal;
    break;
  case "dev":
    config = configDev;
    secrets = secretsDev;
    break;
  case "production":
    config = configProd;
    secrets = secretsProd;
    break;
}

export const appConfig: IAppConfig = {
  ...config,
  ...secrets,
  env,
};
