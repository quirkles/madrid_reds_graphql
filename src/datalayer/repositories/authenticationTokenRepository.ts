import { DataSource, Repository } from "typeorm";
import { ICryptoService } from "../../services";
import { AuthenticationTokenModel, UserModel } from "../models";

export type IAuthenticationTokenRepository =
  Repository<AuthenticationTokenModel> & {
    createTokenForUser(user: UserModel): Promise<{
      authenticationToken: AuthenticationTokenModel;
      initializationVector: string;
      token: string;
    }>;
    authenticateUserWithToken(
      token: AuthenticationTokenModel
    ): Promise<AuthenticationTokenModel>;
  };

let repoSingleton: IAuthenticationTokenRepository;

export function authenticationTokenRepositoryFactory(
  datasource: DataSource,
  cryptoService: ICryptoService
): IAuthenticationTokenRepository {
  if (!repoSingleton) {
    repoSingleton = datasource
      .getRepository<AuthenticationTokenModel>(AuthenticationTokenModel)
      .extend({
        async createTokenForUser(user: UserModel): Promise<{
          authenticationToken: AuthenticationTokenModel;
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

          const authenticationToken = this.create({
            email: user.email,
            secret,
            createdAt: Date.now(),
            user,
          });

          await authenticationToken.save();
          return {
            authenticationToken,
            initializationVector: initializationVector.toString("hex"),
            token: result,
          };
        },

        async authenticateUserWithToken(
          token: AuthenticationTokenModel
        ): Promise<AuthenticationTokenModel> {
          token.authenticatedAt = Date.now();
          return this.save(token);
        },
      });
  }
  return repoSingleton;
}
