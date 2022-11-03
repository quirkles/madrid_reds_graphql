import { DataSource, Repository } from 'typeorm'
import { VerificationTokenModel } from '../models'

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface IVerificationTokenRepository extends Repository<VerificationTokenModel> {}

let repoSingleton: IVerificationTokenRepository

export function verificationTokenRepositoryFactory (datasource: DataSource): IVerificationTokenRepository {
  if (!repoSingleton) {
    repoSingleton = datasource.getRepository(VerificationTokenModel).extend({})
  }
  return repoSingleton
}
