import { DataSource, DataSourceOptions } from 'typeorm'
import { appConfig } from '../config'
import { UserModel } from '../datalayer/models'

const {
  DATABASE_USERNAME,
  DATABASE_PASSWORD,
  DATABASE_HOST,
  DATABASE_NAME
} = appConfig

let connectionOptions: DataSourceOptions = {
  type: 'mongodb',
  host: DATABASE_HOST,
  username: DATABASE_USERNAME,
  password: DATABASE_PASSWORD,
  database: DATABASE_NAME,
  entities: [UserModel]
}
if (appConfig.env === 'local') {
  connectionOptions = {
    ...connectionOptions,
    port: 27017,
    authSource: 'admin'
  }
} else {
  connectionOptions = {
    ...connectionOptions,
    ssl: true
  }
}
export const AppDataSource = new DataSource(connectionOptions)
