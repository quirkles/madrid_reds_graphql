import { ArgsType, Field } from "type-graphql";

@ArgsType()
export class FindUserArg {
  @Field(() => String, {
    nullable: true,
    description:
      "Id of the user, if known. Takes precedence over email, if both are passed",
  })
  userId?: string;

  @Field(() => String, {
    nullable: true,
    description:
      "Email of the user, if known. However userId takes precedence if both are passed",
  })
  emailAddress?: string;
}
