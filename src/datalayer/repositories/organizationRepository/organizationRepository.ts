import { DataSource, Repository } from "typeorm";
import { OrganizationModel } from "../../models";
import { CreateOrganizationInput } from "../../../resolvers/organizationResolver/inputTypes";
import { IDivisionRepository } from "../divisionRepository";

export type IOrganizationRepository = Repository<OrganizationModel> & {
  createOrganization(
    organizationInput: CreateOrganizationInput
  ): Promise<OrganizationModel>;
};

let repoSingleton: IOrganizationRepository;

export function organizationRepositoryFactory(
  datasource: DataSource,
  divisionRepositoryFactory: () => IDivisionRepository
): IOrganizationRepository {
  if (!repoSingleton) {
    repoSingleton = datasource.getRepository(OrganizationModel).extend({
      async createOrganization(
        organizationInput: CreateOrganizationInput
      ): Promise<OrganizationModel> {
        const { divisions = [], ...rest } = organizationInput;
        const organizationP = this.create(rest).save();
        if (divisions.length) {
          const organization = await organizationP;
          const divisionRepo = divisionRepositoryFactory();
          organization.divisions =
            await divisionRepo.createDivisionsForOrganization(
              divisions,
              organization
            );
          return organization.save();
        }
        return organizationP;
      },
    });
  }
  return repoSingleton;
}
