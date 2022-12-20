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
  RoleName,
} from "../../datalayer";
import { Logger } from "winston";
import { CreateOrganizationInput } from "./inputTypes";
import { CreateOrganizationUnion } from "./responseTypes";
import { AppContext } from "../../context";
import { UnauthorizedResponse } from "../types/responses/unauthorizedResponse";
import { IAuthorizationService } from "../../services";

@Resolver(() => OrganizationModel)
@injectable()
class OrganizationResolver implements ResolverInterface<OrganizationModel> {
  @inject("logger")
  private logger!: Logger;

  @inject("DivisionRepositoryFactory")
  private divisionRepositoryFactory!: () => IDivisionRepository;

  @inject("OrganizationRepositoryFactory")
  private organizationRepositoryFactory!: () => IOrganizationRepository;

  @inject("AuthorizationService")
  private authorizationService!: IAuthorizationService;

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
    if (
      context.sessionUser === null ||
      !this.authorizationService.doesSessionUserUserHaveRole(
        context.sessionUser,
        RoleName.ADMIN
      )
    ) {
      return new UnauthorizedResponse();
    }
    this.logger.info("sessionUser", { sessionUser: context.sessionUser });
    const organizationRepository = this.organizationRepositoryFactory();
    return organizationRepository.createOrganization(input);
  }
}

export { OrganizationResolver };
