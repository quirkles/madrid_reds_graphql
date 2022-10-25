import { DataSource } from 'typeorm'
import { appConfig } from '../config'
import { UserModel } from '../datalayer/models'

const {
  DATABASE_USERNAME,
  DATABASE_PASSWORD,
  DATABASE_HOST,
  DATABASE_NAME
} = appConfig

export const AppDataSource = new DataSource({
  type: 'mongodb',
  host: DATABASE_HOST,
  port: 27017,
  username: DATABASE_USERNAME,
  password: DATABASE_PASSWORD,
  database: DATABASE_NAME,
  authSource: 'admin',
  entities: [UserModel]
})
