import { AuthChecker, ResolverData } from "type-graphql";
import { inject, injectable, interfaces } from "inversify";
import { intersection, difference } from "underscore";

import { ITeamRepository, IUserRepository, RoleName } from "../../datalayer";
import { AppContext } from "../../context";
import { ICryptoService } from "../crypto";
import { TYPES } from "../../container";

export interface IAuthChecker {
  check: AuthChecker<AppContext>;
}

@injectable()
export class CustomAuthChecker implements IAuthChecker {
  public async check(
    resolverData: ResolverData<AppContext>,
    roles: string[]
  ): Promise<boolean> {
    if (roles.includes(RoleName.ANYONE)) {
      return true;
    }

    const { context } = resolverData;

    const { container } = context;

    const cryptoService = container.get<ICryptoService>(TYPES.cryptoService);
    const userRepositoryFactory = container.get<() => IUserRepository>(
      TYPES.UserRepositoryFactory
    );

    if (!context.sessionUser?.jwt) {
      return false;
    }

    const decodedToken = await cryptoService.verifyAndDecryptJwt(
      context.sessionUser?.jwt
    );

    if (decodedToken && roles.includes(RoleName.USER)) {
      return true;
    }

    // use injected service
    const userRepo = userRepositoryFactory();
    const user = await userRepo.findOne({
      where: { emailAddress: decodedToken.emailAddress },
      relations: ["roles"],
    });

    const userRoles = user?.roles.map((r) => r.roleName) || [];

    const userRolesUniqueWithoutBasic = Array.from(
      new Set(difference(userRoles, [RoleName.ANYONE, RoleName.USER]))
    );

    const requiredRolesWithoutBasic = Array.from(
      new Set(difference(roles, [RoleName.ANYONE, RoleName.USER]))
    );

    return (
      intersection(userRolesUniqueWithoutBasic, requiredRolesWithoutBasic)
        .length > 0
    );
  }
}
