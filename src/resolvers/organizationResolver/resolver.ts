import {
  Arg, Args,
  FieldResolver,
  Mutation,
  Resolver,
  ResolverInterface,
  Root,
} from "type-graphql";
import { inject, injectable } from "inversify";
import {
  DivisionModel,
  IDivisionRepository,
  IOrganizationRepository,
  OrganizationModel,
} from "../../datalayer";
import { Logger } from "winston";
import { CreateOrganizationInput } from "./inputTypes";

@Resolver(() => OrganizationModel)
@injectable()
class OrganizationResolver implements ResolverInterface<OrganizationModel> {
  @inject("logger")
  private logger!: Logger;

  @inject("DivisionRepositoryFactory")
  private divisionRepositoryFactory!: () => IDivisionRepository;

  @inject("OrganizationRepositoryFactory")
  private organizationRepositoryFactory!: () => IOrganizationRepository;

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

  @Mutation(() => OrganizationModel)
  async createOrganization(
    @Arg("createOrganizationInput") input: CreateOrganizationInput
  ): Promise<OrganizationModel> {
    const organizationRepository = this.organizationRepositoryFactory();
    return organizationRepository.createOrganization(input);
  }
}

export { OrganizationResolver };
