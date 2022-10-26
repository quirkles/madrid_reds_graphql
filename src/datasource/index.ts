import { DataSource, DataSourceOptions } from 'typeorm'
import { appConfig } from '../config'
import { UserModel } from '../datalayer/models'
import { logger } from '../logger'

const {
  DATABASE_USERNAME,
  DATABASE_PASSWORD,
  DATABASE_HOST,
  DATABASE_NAME
} = appConfig

let connectionOptions: DataSourceOptions = {
  type: 'mongodb',
  useUnifiedTopology: true,
  entities: [UserModel]
}
if (appConfig.env === 'local') {
  connectionOptions = {
    ...connectionOptions,
    host: DATABASE_HOST,
    username: DATABASE_USERNAME,
    password: DATABASE_PASSWORD,
    database: DATABASE_NAME,
    port: 27017,
    authSource: 'admin'
  }
} else {
  connectionOptions = {
    ...connectionOptions,
    url: `mongodb+srv://${DATABASE_USERNAME}:${DATABASE_PASSWORD}@${DATABASE_HOST}/${DATABASE_NAME}?retryWrites=true&w=majority`,
    ssl: true
  }
}

logger.info('connectionOptions', connectionOptions)

export const AppDataSource = new DataSource(connectionOptions)
