import { createUnionType, Field, ObjectType } from "type-graphql";
import { UserModel } from "../../datalayer";
import { BadInputResponse, NotFoundResponse } from "../types/responses";

@ObjectType()
export class VerifyTokenResponse {
  @Field(() => Boolean)
  wasVerificationSuccessful!: boolean;

  @Field(() => String, {
    nullable: true,
  })
  jwt?: string;

  @Field(() => String, {
    nullable: true,
  })
  verificationError?: string;
}

@ObjectType()
export class AuthenticationResponse {
  @Field(() => Boolean)
  wasAuthenticationSuccessful!: boolean;

  @Field(() => String, {
    nullable: true,
  })
  jwt?: string;

  @Field(() => String, {
    nullable: true,
  })
  authenticationError?: string;
}

export const UserQueryUnion = createUnionType({
  name: "UserQueryResult",
  types: () => [UserModel, BadInputResponse, NotFoundResponse] as const,
  // our implementation of detecting returned object type
  resolveType: (value: UserModel | BadInputResponse | NotFoundResponse) => {
    if ("id" in value) {
      return UserModel;
    }
    switch (value.__typename) {
      case "BadInputResponse":
        return BadInputResponse;
      case "NotFoundResponse":
        return NotFoundResponse;
    }
    return undefined;
  },
});
