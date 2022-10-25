import { AppDataSource } from './datasource'

export async function startServer () {
  try {
    await AppDataSource.initialize()
    console.log('Connected to database')
  } catch (e) {
    console.error(`Failed to connect to data source: ${(e as Error).message}`)
  }
}
