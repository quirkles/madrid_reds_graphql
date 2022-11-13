import _ from "underscore";

import { AppDataSource } from "../datasource";
import { RoleModel, TeamModel, UserModel, UserToRoleModel } from "../models";
import { createRandomUser } from "./user";
import { createRandomTeam } from "./team";
import { createUserToTeam } from "./userToTeam";
import { RoleName } from "../../services";

const USERS_TO_CREATE = 500;

async function main() {
  await AppDataSource.initialize();
  const roles =
    (await Promise.all(
      Object.values(RoleName).map((r) =>
        RoleModel.create({ roleName: r }).save()
      )
    )) || [];
  const users: UserModel[] = await Promise.all(
    Array.from({ length: USERS_TO_CREATE }).map(createRandomUser)
  );

  const anyoneRole = roles.find((r) => r.roleName === RoleName.ANYONE);
  const userRole = roles.find((r) => r.roleName === RoleName.USER);
  const adminRole = roles.find((r) => r.roleName === RoleName.ADMIN);

  if (!anyoneRole || !userRole || !adminRole) {
    throw new Error("anyone, user and admin roles are required");
  }

  for (const user of users) {
    if (!user.id) {
      throw new Error("expected all users to have ids");
    }
    user.userRoles = [];
    user.userRoles.push(
      UserToRoleModel.create({
        userId: user.id,
        roleId: anyoneRole.id,
      })
    );
    if (user.isVerified) {
      user.userRoles.push(
        UserToRoleModel.create({
          userId: user.id,
          roleId: userRole.id,
        })
      );
      if (Math.random() > 0.98) {
        user.userRoles.push(
          UserToRoleModel.create({
            userId: user.id,
            roleId: adminRole.id,
          })
        );
      }
    }
    await Promise.all(user.userRoles.map((ur) => ur.save()));
    await user.save();
  }
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
