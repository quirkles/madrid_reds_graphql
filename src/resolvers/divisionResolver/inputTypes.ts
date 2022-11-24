import { Field, InputType } from "type-graphql";
import { CreateOrganizationInput } from "../organizationResolver/inputTypes";

@InputType()
export class CreateDivisionInput {
  @Field(() => String, {
    nullable: true,
    description: "Division name",
  })
  name!: string;

  @Field(() => CreateOrganizationInput, {
    nullable: true,
    description: "Owning organization to be created",
  })
  organization?: CreateOrganizationInput;

  @Field(() => String, {
    nullable: true,
    description: "Owning organization Id",
  })
  organizationId?: string;
}
