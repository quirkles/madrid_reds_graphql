import { DataSource, Repository } from 'typeorm'
import { VerificationTokenModel } from '../models'
import { ICryptoService } from '../../services'

export type IVerificationTokenRepository = Repository<VerificationTokenModel> & {
  createToken(email: string): Promise<{verificationToken: VerificationTokenModel, initializationVector: string}>
  verifyUserWithToken(token: VerificationTokenModel): Promise<VerificationTokenModel>
}

let repoSingleton: IVerificationTokenRepository

export function verificationTokenRepositoryFactory (datasource: DataSource, cryptoService: ICryptoService): IVerificationTokenRepository {
  if (!repoSingleton) {
    repoSingleton = datasource.getRepository<VerificationTokenModel>(VerificationTokenModel).extend({
      async createToken (email: string): Promise<{verificationToken: VerificationTokenModel, initializationVector: string}> {
        const secret = cryptoService.generateSecret()
        const tokenString = JSON.stringify({
          email,
          secret
        })
        const {
          result,
          initializationVector
        } = await cryptoService.encrypt({
          unencryptedInput: tokenString
        })
        return {
          verificationToken: this.create({
            email,
            secret,
            createdAt: Date.now(),
            token: result
          }),
          initializationVector: initializationVector.toString('hex')
        }
      },

      async verifyUserWithToken (token: VerificationTokenModel): Promise<VerificationTokenModel> {
        token.verifiedAt = Date.now()
        token.user.isVerified = true
        await token.user.save()
        return this.save(token)
      }
    })
  }
  return repoSingleton
}
