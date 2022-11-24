import { Arg, Mutation, Resolver } from "type-graphql";
import { injectable } from "inversify";
import { DivisionModel } from "../../datalayer";
import { AuthenticationResponse } from "../userResolver";
import { CreateDivisionInput } from "./inputTypes";

@Resolver(() => DivisionModel)
@injectable()
// class DivisionResolver implements ResolverInterface<DivisionModel> {
class DivisionResolver {
  @Mutation(() => AuthenticationResponse)
  async createDivision(
    @Arg("createDivisionInput") input: CreateDivisionInput
  ): Promise<DivisionModel> {
    return {} as DivisionModel;
  }
}

export { DivisionResolver };
