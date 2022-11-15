import _ from "underscore";

import { AppDataSource } from "../datasource";
import { RoleName, TeamModel, UserModel } from "../models";
import { createRandomUser } from "./user";
import { createRandomTeam } from "./team";
import { createUserToTeam } from "./userToTeam";
import { initializeRoles } from "./roles";
import { initializeScopes } from "./scopes";

const USERS_TO_CREATE = 500;

async function main() {
  await AppDataSource.initialize();

  console.log("Seeding scopes");
  const scopes = await initializeScopes();
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
  const playerRole = roles.find((r) => r?.roleName === RoleName.PLAYER);
  const captainRole = roles.find((r) => r?.roleName === RoleName.CAPTAIN);
  if (!playerRole || !captainRole) {
    throw new Error("player and captain roles are required");
  }
  console.log(`Populate Teams`);
  for (const team of teams) {
    const teamPlayers: UserModel[] = _.sample(users, _.random(7, 12));
    console.log(`Initial adding users to team: ${team.name}`);
    const usersToTeam = await Promise.all(
      teamPlayers.map((player) => createUserToTeam(player, team, playerRole))
    );
    const captain = _.sample(usersToTeam);
    const keeper = _.sample(usersToTeam);

    if (!keeper || !captain) {
      throw new Error("Teams must have a keeper and a captain");
    }
    console.log(`Setting ${captain.user.name} captain of team: ${team.name}`);
    captain.roles.push(captainRole);
    await captain.save();
    console.log(`Setting ${keeper.user.name} as gk of team: ${team.name}`);
    keeper.position = "goalKeeper";
    await keeper.save();
  }
}

main()
  .then(() => console.log("Seeded db"))
  .catch((err) => console.error("Failed to seed db", err));
