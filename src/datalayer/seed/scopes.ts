import { RoleScopeModel, RoleScopeName } from "../models";

export async function initializeScopes(): Promise<RoleScopeModel[]> {
  const scopes: RoleScopeModel[] = [];
  for (const scopeName in RoleScopeName) {
    let roleScope: RoleScopeModel | null = await RoleScopeModel.findOneBy({
      scopeName,
    });
    if (!roleScope) {
      roleScope = await RoleScopeModel.create({ scopeName }).save();
    }
    scopes.push(roleScope);
  }
  return scopes;
}
