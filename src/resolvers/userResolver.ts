import { Resolver, Query, Mutation, Arg, Ctx } from 'type-graphql'
import { Inject, Service } from 'typedi'
import { Logger } from 'winston'

import { UserModel } from '../datalayer/models'
import { ApolloContext } from '../context'
import { MailerService } from '../mailer'

@Service()
@Resolver()
export class UserResolver {
  @Inject('Logger')
    logger!: Logger

  @Inject('MailerService')
    mailer!: MailerService

    @Query(() => [UserModel])
  users () {
    this.logger.info('test')
    return UserModel.find()
  }

    @Mutation(() => Boolean)
    async signUp (@Arg('emailAddress') emailAddress: string, @Ctx() ctx: ApolloContext): Promise<boolean> {
      try {
        await this.mailer.sendConfirmEmailEmail(emailAddress)
        return true
      } catch (err) {
        this.logger.error('Failed to send email', { error: err })
        return false
      }
    }
}
