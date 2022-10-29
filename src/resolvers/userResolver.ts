import { Resolver, Query, Mutation, Arg, Ctx } from 'type-graphql'
import { inject, injectable } from 'inversify'

import { AppContext } from '../context'
import { MailerService } from '../mailer'
import { Logger } from 'winston'

@Resolver()
@injectable()
export class UserResolver {
  @inject('MailerService')
  private mailer!: MailerService

  @inject('Logger')
  private logger!: Logger

    @Query(() => String)
  async test (@Arg('input') input: string, @Ctx() ctx: AppContext) {
    this.logger.info(`test before ${input}`)
    await this.mailer.sendConfirmEmailEmail('al.quirk@gmail.com')
    await new Promise((resolve) => setTimeout(resolve, 2000))
    this.logger.info(`test after ${input}`)
    return input
  }

    @Mutation(() => Boolean)
    async signUp (@Arg('emailAddress') emailAddress: string, @Ctx() ctx: AppContext): Promise<boolean> {
      try {
        await this.mailer.sendConfirmEmailEmail(emailAddress)
        return true
      } catch (err) {
        ctx.logger.error('Failed to send email', { error: err })
        return false
      }
    }
}
