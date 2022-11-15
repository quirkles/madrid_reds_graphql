import { RoleModel, RoleName, RoleScopeModel, RoleScopeName } from "../models";
import { where } from "underscore";

export async function initializeRoles(
  scopes: RoleScopeModel[]
): Promise<RoleModel[]> {
  const siteScope = scopes.find((s) => s.scopeName === RoleScopeName.SITE);
  const teamScope = scopes.find((s) => s.scopeName === RoleScopeName.TEAM);

  if (!siteScope || !teamScope) {
    throw new Error("Expected both site and team scopes");
  }

  const roles: RoleModel[] = [];
  const siteAnyoneRole =
    (await RoleModel.findOne({
      where: {
        scopeId: siteScope.id,
        roleName: RoleName.ANYONE,
      },
    })) ||
    (await RoleModel.create({
      scopeId: siteScope.id,
      roleName: RoleName.ANYONE,
    }).save());
  roles.push(siteAnyoneRole);

  const siteUserRole =
    (await RoleModel.findOne({
      where: {
        scopeId: siteScope.id,
        roleName: RoleName.USER,
      },
    })) ||
    (await RoleModel.create({
      scopeId: siteScope.id,
      roleName: RoleName.USER,
    }).save());
  roles.push(siteUserRole);

  const siteAdminRole =
    (await RoleModel.findOne({
      where: {
        scopeId: siteScope.id,
        roleName: RoleName.ADMIN,
      },
    })) ||
    (await RoleModel.create({
      scopeId: siteScope.id,
      roleName: RoleName.ADMIN,
    }).save());
  roles.push(siteAdminRole);

  const teamPlayerRole =
    (await RoleModel.findOne({
      where: {
        scopeId: teamScope.id,
        roleName: RoleName.PLAYER,
      },
    })) ||
    (await RoleModel.create({
      scopeId: teamScope.id,
      roleName: RoleName.PLAYER,
    }).save());
  roles.push(teamPlayerRole);

  const teamCaptainRole =
    (await RoleModel.findOne({
      where: {
        scopeId: teamScope.id,
        roleName: RoleName.CAPTAIN,
      },
    })) ||
    (await RoleModel.create({
      scopeId: teamScope.id,
      roleName: RoleName.CAPTAIN,
    }).save());
  roles.push(teamCaptainRole);

  return roles;
}
