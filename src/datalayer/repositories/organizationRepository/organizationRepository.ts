import { DataSource, Repository } from "typeorm";
import { OrganizationModel } from "../../models";

export type IOrganizationRepository = Repository<OrganizationModel>;

let repoSingleton: IOrganizationRepository;

export function organizationRepositoryFactory(
  datasource: DataSource
): IOrganizationRepository {
  if (!repoSingleton) {
    repoSingleton = datasource.getRepository(OrganizationModel).extend({});
  }
  return repoSingleton;
}
