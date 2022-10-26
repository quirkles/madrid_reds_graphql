import { Resolver, Query } from 'type-graphql'

import { UserModel } from '../datalayer/models'
import { logger } from '../logger'

@Resolver()
export class UserResolver {
    @Query(() => [UserModel])
  async users () {
    try {
      const users = await UserModel.find()
      logger.info('users', { users })
      return users
    } catch (err) {
      logger.error(err)
      return []
    }
  }
}
