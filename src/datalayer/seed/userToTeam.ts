import _ from "underscore";
import { TeamModel, UserModel, UserToTeamModel } from "../models";

const positions = ["defender", "midfield", "striker"];

export async function createUserToTeam(
  user: UserModel,
  team: TeamModel,
  overrides?: Partial<UserToTeamModel>
): Promise<UserToTeamModel> {
  const userToTeamModel = UserToTeamModel.create({
    position: overrides?.position || _.sample(positions),
    user,
    team,
  });

  return userToTeamModel.save();
}
