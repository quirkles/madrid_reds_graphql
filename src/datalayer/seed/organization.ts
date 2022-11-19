import { OrganizationModel } from "../models";

const organizations = [
  "sports-society",
  "community-sports",
  "city-soccer",
  "casual-kickers",
];

export async function createOrganizations(): Promise<OrganizationModel[]> {
  const orgs: OrganizationModel[] = [];
  for (const name of organizations) {
    orgs.push(
      (await OrganizationModel.findOne({
        where: {
          name,
        },
      })) ||
        (await OrganizationModel.create({
          name: name,
        }).save())
    );
  }
  return orgs;
}
