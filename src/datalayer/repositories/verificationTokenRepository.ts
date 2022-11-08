import { DataSource, Repository } from "typeorm";
import { UserModel, VerificationTokenModel } from "../models";
import { ICryptoService } from "../../services";

export type IVerificationTokenRepository =
  Repository<VerificationTokenModel> & {
    createTokenForUser(user: UserModel): Promise<{
      verificationToken: VerificationTokenModel;
      initializationVector: string;
      token: string;
    }>;
    verifyUserWithToken(
      token: VerificationTokenModel
    ): Promise<VerificationTokenModel>;
  };

let repoSingleton: IVerificationTokenRepository;

export function verificationTokenRepositoryFactory(
  datasource: DataSource,
  cryptoService: ICryptoService
): IVerificationTokenRepository {
  if (!repoSingleton) {
    repoSingleton = datasource
      .getRepository<VerificationTokenModel>(VerificationTokenModel)
      .extend({
        async createTokenForUser(user: UserModel): Promise<{
          verificationToken: VerificationTokenModel;
          initializationVector: string;
          token: string;
        }> {
          const secret = cryptoService.generateSecret();
          const tokenString = JSON.stringify({
            email: user.email,
            secret,
          });
          const { result, initializationVector } = await cryptoService.encrypt({
            unencryptedInput: tokenString,
          });
          const verificationToken = this.create({
            email: user.email,
            secret,
            user,
            createdAt: Date.now(),
          });
          await verificationToken.save();
          return {
            verificationToken,
            initializationVector: initializationVector.toString("hex"),
            token: result,
          };
        },

        async verifyUserWithToken(
          token: VerificationTokenModel
        ): Promise<VerificationTokenModel> {
          token.verifiedAt = Date.now();
          token.user.isVerified = true;
          await token.user.save();
          return this.save(token);
        },
      });
  }
  return repoSingleton;
}
