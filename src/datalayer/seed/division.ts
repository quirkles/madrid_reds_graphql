import { DivisionModel, OrganizationModel } from "../models";
import { faker } from "@faker-js/faker";

const skillLevels = ["advanced", "intermediate", "recreational"];

export async function createDivisions(
  organizations: OrganizationModel[]
): Promise<DivisionModel[]> {
  const divisions: DivisionModel[] = [];
  for (const organization of organizations) {
    const city = faker.address.city();
    const orgDivisions = await Promise.all(
      skillLevels.map((skillLevel) => {
        const d = DivisionModel.create({
          organization,
          name: `${city}-${skillLevel}-coed`,
        });
        return d.save();
      })
    );
    divisions.push(...orgDivisions);
  }
  return divisions;
}
