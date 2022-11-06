import { Resolver, Query, Mutation, Arg, Ctx } from 'type-graphql'
import { inject, injectable } from 'inversify'
import { Logger } from 'winston'

import { AppContext } from '../../context'
import { ICryptoService, IMailerService } from '../../services'
import {IAuthenticationTokenRepository, IUserRepository, IVerificationTokenRepository, UserModel} from '../../datalayer'
import { VerifyTokenResponse } from './responseTypes'

@Resolver()
@injectable()
export class UserResolver {
  @inject('MailerService')
  private mailer!: IMailerService

  @inject('logger')
  private logger!: Logger

  @inject('cryptoService')
    cryptoService!: ICryptoService

  @inject('UserRepositoryFactory')
  private userRepositoryFactory!: () => IUserRepository

  @inject('VerificationTokenFactory')
  private verificationTokenRepositoryFactory!: () => IVerificationTokenRepository

  @inject('AuthenticationTokenFactory')
  private authenticationTokenRepositoryFactory!: () => IAuthenticationTokenRepository

  @Mutation(() => Boolean)
  async signUp (@Arg('emailAddress') emailAddress: string, @Ctx() ctx: AppContext): Promise<boolean> {
    try {
      const userRepo = this.userRepositoryFactory()
      const verificationTokenRepo = this.verificationTokenRepositoryFactory()
      let user = await userRepo.findOne({ where: { email: emailAddress }, relations: { verificationTokens: true } })
      if (user) {
        this.logger.info('User already exists')
      } else {
        user = await userRepo.create({ email: emailAddress, isVerified: false })
        user.verificationTokens = []
        this.logger.info(`Creating user with email: ${emailAddress}`)
      }
      this.logger.debug('user', { user })
      const { verificationToken, initializationVector, token } = await verificationTokenRepo.createToken(emailAddress)
      await verificationToken.save()
      user.verificationTokens.push(verificationToken)
      await user.save()
      await this.mailer.sendConfirmEmail(emailAddress, token, initializationVector)
      return true
    } catch (err) {
      this.logger.error('Failed to send email', { error: (err as Error).message })
      return false
    }
  }

  @Mutation(() => Boolean)
  async sendLoginLink (@Arg('emailAddress') emailAddress: string, @Ctx() ctx: AppContext): Promise<boolean> {
    try {
      const userRepo = this.userRepositoryFactory()
      const authenticationTokenRepository = this.authenticationTokenRepositoryFactory()
      const user = await userRepo.findOne({ where: { email: emailAddress }, relations: { verificationTokens: true } })
      if (!user) {
        this.logger.info('No user exists for this email')
        return false
      }
      const { initializationVector, token } = await authenticationTokenRepository.createTokenForUser(user)
      await this.mailer.sendConfirmEmail(emailAddress, token, initializationVector)
      return true
    } catch (err) {
      this.logger.error('Failed to send email', { error: (err as Error).message })
      return false
    }
  }

  @Mutation(() => VerifyTokenResponse)
  async verifyToken (@Arg('emailAddress') emailAddress: string, @Arg('secret') secret: string, @Ctx() ctx: AppContext): Promise<VerifyTokenResponse> {
    try {
      const verificationTokenRepo = this.verificationTokenRepositoryFactory()

      const verificationToken = await verificationTokenRepo.findOne({
        where: {
          secret, email: emailAddress
        },
        relations: {
          user: true
        }
      })
      if (verificationToken) {
        this.logger.info('found token', { verificationToken })
        const now = Date.now()
        if ((now - verificationToken.createdAt) > (1000 * 60 * 15)) {
          return {
            wasVerificationSuccessful: false,
            verificationError: 'Verification token expired'
          }
        }

        if (verificationToken.email !== emailAddress) {
          return {
            wasVerificationSuccessful: false,
            verificationError: 'Verification email didnt match'
          }
        }

        if (verificationToken.secret !== secret) {
          return {
            wasVerificationSuccessful: false,
            verificationError: 'Verification secret didnt match'
          }
        }

        if (!verificationToken.user) {
          return {
            wasVerificationSuccessful: false,
            verificationError: 'No matching user'
          }
        }

        if (verificationToken.user.isVerified) {
          return {
            wasVerificationSuccessful: false,
            verificationError: 'User already verified'
          }
        }

        await verificationTokenRepo.verifyUserWithToken(verificationToken)
        return {
          wasVerificationSuccessful: true,
          jwt: this.cryptoService.signJwt({ email: emailAddress })
        }
      } else {
        return {
          wasVerificationSuccessful: false,
          verificationError: 'Failed to find any matching token'
        }
      }
    } catch (err) {
      this.logger.error('Failed to validate token', { error: (err as Error).message })
      return {
        wasVerificationSuccessful: false,
        verificationError: (err as Error).message
      }
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
