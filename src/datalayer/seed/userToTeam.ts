import _ from "underscore";
import { RoleModel, TeamModel, UserModel, UserToTeamModel } from "../models";

const positions = ["defender", "midfield", "striker"];

export async function createUserToTeam(
  user: UserModel,
  team: TeamModel,
  playerRole: RoleModel
): Promise<UserToTeamModel> {
  const userToTeamModel = UserToTeamModel.create({
    position: _.sample(positions),
    user,
    team,
    roles: [playerRole],
  });

  return userToTeamModel.save();
}
