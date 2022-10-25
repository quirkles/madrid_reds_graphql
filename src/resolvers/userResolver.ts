import { Resolver, Query } from 'type-graphql'

import { UserModel } from '../datalayer/models'

@Resolver()
export class UserResolver {
    @Query(() => [UserModel])
  users () {
    return UserModel.find()
  }
}
