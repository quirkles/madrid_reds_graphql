import { DataSource } from 'typeorm'
import { appConfig } from '../config'

const urlProtocol = appConfig.env === 'local' ? 'mongodb://' : 'mongodb+srv://'

const {
  DATABASE_USERNAME,
  DATABASE_PASSWORD,
  DATABASE_HOST,
  DATABASE_NAME
} = appConfig

const url = `${urlProtocol}${DATABASE_USERNAME}:${DATABASE_PASSWORD}@${DATABASE_HOST}/${DATABASE_NAME}?retryWrites=true&w=majority`

export const AppDataSource = new DataSource({
  type: "mongodb",
  url
})
