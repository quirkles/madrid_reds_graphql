import { DataSource, Repository } from 'typeorm'
import { VerificationTokenModel } from '../models'
import { ICryptoService } from '../../services'

export type IVerificationTokenRepository = Repository<VerificationTokenModel> & {
  createToken(email: string): Promise<VerificationTokenModel>
}

let repoSingleton: IVerificationTokenRepository

export function verificationTokenRepositoryFactory (datasource: DataSource, cryptoService: ICryptoService): IVerificationTokenRepository {
  if (!repoSingleton) {
    repoSingleton = datasource.getRepository<VerificationTokenModel>(VerificationTokenModel).extend({
      async createToken (email: string): Promise<VerificationTokenModel> {
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
        return this.create({
          email,
          secret,
          createdAt: Date.now(),
          initializationVector: initializationVector.toString('hex'),
          token: result
        })
      }
    })
  }
  return repoSingleton
}
