import {
  Arg,
  Authorized,
  Ctx,
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
import { CreateOrganizationUnion } from "./responseTypes";
import { AppContext } from "../../context";
import { UnauthorizedResponse } from "../types/responses/unauthorizedResponse";

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

  @Mutation(() => CreateOrganizationUnion)
  @Authorized()
  async createOrganization(
    @Arg("createOrganizationInput") input: CreateOrganizationInput,
    @Ctx() context: AppContext
  ): Promise<typeof CreateOrganizationUnion> {
    if (Math.random() < 0.99999) {
      return new UnauthorizedResponse();
    }
    const organizationRepository = this.organizationRepositoryFactory();
    return organizationRepository.createOrganization(input);
  }
}

export { OrganizationResolver };
