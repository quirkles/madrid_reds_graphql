import { AuthChecker, ResolverData } from "type-graphql";
import { inject, injectable } from "inversify";
import { intersection, difference } from "underscore";

import { IUserRepository } from "../../datalayer";
import { AppContext } from "../../context";
import { ICryptoService } from "../crypto";

export interface IAuthChecker {
  check: AuthChecker<AppContext>;
}

export const RoleName = {
  ANYONE: "ANYONE",
  USER: "USER",
  ADMIN: "ADMIN",
} as const;
export type Role = typeof RoleName[keyof typeof RoleName];

@injectable()
export class CustomAuthChecker implements IAuthChecker {
  @inject("UserRepositoryFactory")
  private userRepositoryFactory!: () => IUserRepository;

  @inject("cryptoService")
  cryptoService!: ICryptoService;

  public async check(
    resolverData: ResolverData<AppContext>,
    roles: string[]
  ): Promise<boolean> {
    if (roles.includes(RoleName.ANYONE)) {
      return true;
    }

    const { context } = resolverData;

    if (!context.sessionUser?.jwt) {
      return false;
    }

    const decodedToken = await this.cryptoService.verifyAndDecryptJwt(
      context.sessionUser?.jwt
    );

    if (decodedToken && roles.includes(RoleName.USER)) {
      return true;
    }

    // use injected service
    const userRepo = this.userRepositoryFactory();
    const user = await userRepo.findOne({
      where: { email: decodedToken.email },
      relations: ["userRoles", "userRoles.role"],
    });

    const userRoles = user?.userRoles.map((r) => r.role.roleName) || [];

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
