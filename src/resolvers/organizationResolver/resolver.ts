import { FieldResolver, Resolver, ResolverInterface, Root } from "type-graphql";
import { inject, injectable } from "inversify";
import {
  DivisionModel,
  IDivisionRepository,
  OrganizationModel,
} from "../../datalayer";
import { Logger } from "winston";

@Resolver(() => OrganizationModel)
@injectable()
class OrganizationResolver implements ResolverInterface<OrganizationModel> {
  @inject("logger")
  private logger!: Logger;

  @inject("DivisionRepositoryFactory")
  private divisionRepositoryFactory!: () => IDivisionRepository;

  @FieldResolver(() => [DivisionModel])
  async divisions(
    @Root() organization: OrganizationModel
  ): Promise<DivisionModel[]> {
    const repo = this.divisionRepositoryFactory();
    return repo.find({
      where: {
        organizationId: organization.id,
      },
    });
  }
}

export { OrganizationResolver };
