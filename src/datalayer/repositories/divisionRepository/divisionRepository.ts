import { DataSource, Repository } from "typeorm";
import {DivisionModel, OrganizationModel} from "../../models";
import { CreateDivisionInput } from "../../../resolvers/divisionResolver/inputTypes";

export type IDivisionRepository = Repository<DivisionModel> & {
  createDivisionsForOrganization(
    divisions: CreateDivisionInput[],
    organization: OrganizationModel
  ): Promise<DivisionModel[]>;
};

let repoSingleton: IDivisionRepository;

export function divisionRepositoryFactory(
  datasource: DataSource
): IDivisionRepository {
  if (!repoSingleton) {
    repoSingleton = datasource.getRepository(DivisionModel).extend({
      createDivisionsForOrganization(
        divisions: CreateDivisionInput[],
        organization: OrganizationModel
      ): Promise<DivisionModel[]> {
        const divisionModels: DivisionModel[] = divisions.map((division) =>
          DivisionModel.create({
            ...division,
            organization,
          })
        );
        return this.save(divisionModels);
      },
    });
  }
  return repoSingleton;
}
