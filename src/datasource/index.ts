import {
  join
} from 'path'
import { DataSource, DataSourceOptions } from 'typeorm'
import { appConfig } from '../config'
import {AuthenticationTokenModel, UserModel, VerificationTokenModel} from '../datalayer'

const {
  DATABASE_USERNAME,
  DATABASE_PASSWORD,
  DATABASE_HOST,
  DATABASE_NAME
} = appConfig

const connectionOptionEntities: Pick<DataSourceOptions, 'entities'> = {
  entities: [UserModel, VerificationTokenModel, AuthenticationTokenModel]
}

let connectionOptions: DataSourceOptions

if (appConfig.env === 'local') {
  connectionOptions = {
    type: 'sqlite',
    synchronize: true,
    database: join(__dirname, '../..', 'myDb.db'),
    ...connectionOptionEntities
  }
} else {
  connectionOptions = {
    type: 'postgres',
    database: DATABASE_NAME,
    username: DATABASE_USERNAME,
    password: DATABASE_PASSWORD,
    host: DATABASE_HOST,
    port: 27017,
    ssl: true,
    ...connectionOptionEntities
  }
}

export const AppDataSource = new DataSource(connectionOptions)
