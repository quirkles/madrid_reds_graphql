import { Resolver, Query, Mutation, Arg, Ctx } from 'type-graphql'
import { inject, injectable } from 'inversify'
import { Logger } from 'winston'

import { AppContext } from '../context'
import { IMailerService } from '../services'
import { IUserRepository, IVerificationTokenRepository } from '../datalayer'

@Resolver()
@injectable()
export class UserResolver {
  @inject('MailerService')
  private mailer!: IMailerService

  @inject('logger')
  private logger!: Logger

  @inject('UserRepositoryFactory')
  private userRepositoryFactory!: () => IUserRepository

  @inject('VerificationTokenFactory')
  private verificationTokenFactory!: () => IVerificationTokenRepository

  @Mutation(() => Boolean)
  async signUp (@Arg('emailAddress') emailAddress: string, @Ctx() ctx: AppContext): Promise<boolean> {
    try {
      const userRepo = this.userRepositoryFactory()
      const verificationTokenRepo = this.verificationTokenFactory()
      let user = await userRepo.findOne({ where: { email: emailAddress }, relations: { verificationTokens: true } })
      if (user) {
        this.logger.info('User already exists')
      } else {
        user = await userRepo.create({ email: emailAddress, isVerified: false })
        user.verificationTokens = []
        this.logger.info(`Creating user with email: ${emailAddress}`)
      }
      this.logger.debug('user', { user })
      const { verificationToken, initializationVector } = await verificationTokenRepo.createToken(emailAddress)
      await verificationToken.save()
      user.verificationTokens.push(verificationToken)
      await user.save()
      await this.mailer.sendConfirmEmail(emailAddress, verificationToken.token, initializationVector)
      return true
    } catch (err) {
      this.logger.error('Failed to send email', { error: (err as Error).message })
      return false
    }
  }

  @Query(() => String)
  async test (@Arg('input') input: string, @Ctx() ctx: AppContext) {
    this.logger.info(`test before ${input}`)
    await this.mailer.sendConfirmEmail('al.quirk@gmail.com', '', '')
    await new Promise((resolve) => setTimeout(resolve, 1000))
    this.logger.info(`test after ${input}`)
    return input
  }
}
