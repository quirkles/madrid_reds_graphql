import { createUnionType, Field, ObjectType } from "type-graphql";

import { OrganizationModel, UserModel } from "../../datalayer";
import { BadInputResponse, NotFoundResponse } from "../types";
import { UnauthorizedResponse } from "../types/responses/unauthorizedResponse";

export const CreateOrganizationUnion = createUnionType({
  name: "CreateOrganizationResult",
  types: () =>
    [OrganizationModel, BadInputResponse, UnauthorizedResponse] as const,
  // our implementation of detecting returned object type
  resolveType: (
    value: OrganizationModel | BadInputResponse | UnauthorizedResponse
  ) => {
    if ("id" in value) {
      return OrganizationModel;
    }
    switch (value.__typename) {
      case "BadInputResponse":
        return BadInputResponse;
      case "UnauthorizedResponse":
        return UnauthorizedResponse;
    }
    return undefined;
  },
});
