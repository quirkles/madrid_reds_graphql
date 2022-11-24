import { Field, InputType } from "type-graphql";
import { CreateDivisionInput } from "../divisionResolver/inputTypes";

@InputType({ description: "New organization input" })
export class CreateOrganizationInput {
  @Field(() => String, {
    description: "Organization name",
  })
  name!: string;

  @Field(() => [CreateDivisionInput], {
    nullable: true,
    description:
      "Divisions, any organization or organizationId field passed will be ignored",
  })
  divisions?: CreateDivisionInput[];
}
