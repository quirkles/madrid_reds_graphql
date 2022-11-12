import _ from "underscore";

import { AppDataSource } from "../datasource";
import { TeamModel, UserModel } from "../models";
import { createRandomUser } from "./user";
import { createRandomTeam } from "./team";
import { createUserToTeam } from "./userToTeam";

const USERS_TO_CREATE = 500;

async function main() {
  await AppDataSource.initialize();
  const users: UserModel[] = await Promise.all(
    Array.from({ length: USERS_TO_CREATE }).map(createRandomUser)
  );
  const teams: TeamModel[] = await Promise.all(
    Array.from({ length: Math.floor(USERS_TO_CREATE / 8) }).map(
      createRandomTeam
    )
  );
  for (const team of teams) {
    const teamPlayers: UserModel[] = _.sample(users, _.random(6, 9));
    await Promise.all(
      teamPlayers.map((player, i) =>
        createUserToTeam(
          player,
          team,
          i === 1 ? { position: "goalkeeper" } : {}
        )
      )
    );
  }
}

main()
  .then(() => console.log("Seeded db"))
  .catch((err) => console.error("Failed to seed db", err));
