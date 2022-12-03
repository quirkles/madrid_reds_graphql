import { AuthChecker, ResolverData } from "type-graphql";
import { injectable } from "inversify";

import { IUserRepository } from "../../datalayer";
import { AppContext } from "../../context";
import { ICryptoService } from "../crypto";
import { TYPES } from "../../container";

export interface IAuthChecker {
  check: AuthChecker<AppContext>;
}

@injectable()
export class CustomAuthChecker implements IAuthChecker {
  public async check(resolverData: ResolverData<AppContext>): Promise<boolean> {
    const { sessionUser } = resolverData.context;
    if (sessionUser === null) {
      return true;
    }

    const { jwt } = sessionUser;

    if (!jwt) {
      return true;
    }

    const { container } = resolverData.context;

    const cryptoService = container.get<ICryptoService>(TYPES.cryptoService);

    const decodedToken = await cryptoService.verifyAndDecryptJwt(jwt);

    if (!decodedToken) {
      resolverData.context.sessionUser = null;
      return true;
    }

    const userRepositoryFactory = container.get<() => IUserRepository>(
      TYPES.UserRepositoryFactory
    );

    const userRepo = userRepositoryFactory();

    const user = await userRepo.findOne({
      where: { emailAddress: decodedToken.emailAddress },
      relations: ["roles"],
    });

    if (!user) {
      resolverData.context.sessionUser = null;
      return true;
    }

    sessionUser.roles = user.roles.map((r) => r.roleName);

    return true;
  }
}
