import _ from "underscore";
import { RoleModel, TeamModel, UserModel, UserToTeamToLeagueModel } from "../models";

const positions = ["defender", "midfield", "striker"];

export async function createUserToTeam(
  user: UserModel,
  team: TeamModel,
  playerRole: RoleModel
): Promise<UserToTeamToLeagueModel> {
  const userToTeamModel = UserToTeamToLeagueModel.create({
    position: _.sample(positions),
    user,
    team,
    roles: [playerRole],
  });

  return userToTeamModel.save();
}
