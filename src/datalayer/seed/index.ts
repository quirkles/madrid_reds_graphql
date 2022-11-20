import { AppDataSource } from "../datasource";
import {
  DivisionModel,
  FixtureModel,
  OrganizationModel,
  RoleName,
  TeamModel,
  UserModel,
} from "../models";
import { createRandomUser } from "./user";
import { createRandomTeam } from "./team";
import { initializeRoles } from "./roles";
import { initializeScopes } from "./scopes";
import { createOrganizations } from "./organization";
import { createDivisions } from "./division";
import { createSeasons } from "./season";
import { initializeEventTypes } from "./eventTypes";
import { createFixturesForSeason } from "./fixtures";

const USERS_TO_CREATE = 500;

async function main() {
  await AppDataSource.initialize();

  console.log("Seeding scopes");
  const scopes = await initializeScopes();

  console.log("Seeding Event types");
  const eventTypes = await initializeEventTypes();

  console.log("Seeding Roles");
  const roles = await initializeRoles(scopes);

  console.log("Seeding Users");
  const users: UserModel[] = await Promise.all(
    Array.from({ length: USERS_TO_CREATE }).map(createRandomUser)
  );

  const anyoneRole = roles.find((r) => r?.roleName === RoleName.ANYONE);
  const userRole = roles.find((r) => r?.roleName === RoleName.USER);
  const adminRole = roles.find((r) => r?.roleName === RoleName.ADMIN);

  if (!anyoneRole || !userRole || !adminRole) {
    throw new Error("anyone, user and admin roles are required");
  }

  console.log("Adding roles to users");
  for (const user of users) {
    if (!user.id) {
      throw new Error("expected all users to have ids");
    }
    user.roles = [];
    user.roles.push(anyoneRole);
    if (user.isVerified) {
      user.roles.push(userRole);
      if (Math.random() > 0.98) {
        user.roles.push(adminRole);
      }
    }
    await Promise.all(user.roles.map((ur) => ur.save()));
    await user.save();
  }
  console.log("Adding Seeding teams");
  const teams: TeamModel[] = await Promise.all(
    Array.from({ length: Math.floor(USERS_TO_CREATE / 8) }).map(
      createRandomTeam
    )
  );

  const organizations: OrganizationModel[] = await createOrganizations();
  const divisions: DivisionModel[] = await createDivisions(organizations);
  const seasons = await createSeasons(divisions, teams, users);
  for (const season of seasons) {
    await createFixturesForSeason(season, eventTypes)
  }
}

main()
  .then(() => console.log("Seeded db"))
  .catch((err) => console.error("Failed to seed db", err));
