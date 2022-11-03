import { DataSource, DataSourceOptions } from 'typeorm'
import { appConfig } from '../config'
import { UserModel, VerificationTokenModel } from '../datalayer/models'

const {
  DATABASE_USERNAME,
  DATABASE_PASSWORD,
  DATABASE_HOST,
  DATABASE_NAME
} = appConfig

let connectionOptions: DataSourceOptions = {
  type: 'mongodb',
  useUnifiedTopology: true,
  entities: [UserModel, VerificationTokenModel]
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

export const AppDataSource = new DataSource(connectionOptions)
