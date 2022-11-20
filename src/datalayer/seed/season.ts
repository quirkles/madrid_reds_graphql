import {
  DivisionModel,
  PlayerModel,
  RoleModel,
  RoleName,
  SeasonModel,
  TeamInSeasonModel,
  TeamModel,
  UserModel,
} from "../models";
import _ from "underscore";
import { add, sub } from "date-fns";

const playerPositions = ["defender", "fullback", "midfield", "attacker"];

let playerRole: RoleModel;
let captainRole: RoleModel;

async function createSeason(
  teamsWithPlayerPools: {
    team: TeamModel;
    playerPool: UserModel[];
  }[],
  division: DivisionModel,
  seasonName: string,
  startDate: Date,
  endDate: Date
): Promise<SeasonModel> {
  const season = await SeasonModel.create({
    startDate,
    name: seasonName,
    endDate,
    division,
  }).save();
  const teams: TeamInSeasonModel[] = [];
  for (const teamWithPlayerPool of teamsWithPlayerPools) {
    const { team, playerPool } = teamWithPlayerPool;
    const teamInSeason = await TeamInSeasonModel.create({
      teamId: team.id,
      seasonId: season.id,
    }).save();
    const players = _.sample(playerPool, _.random(10, 14)).map((user) => {
      return PlayerModel.create({
        userId: user.id,
        teamInSeasonId: teamInSeason.id,
        position: _.sample(playerPositions),
        roles: [playerRole],
      });
    });
    const captain = _.sample(players);
    const gk = _.sample(players);
    if (!captain || !gk) {
      throw new Error("Every team needs a keeper and a captain");
    }
    captain.roles.push(captainRole);
    gk.position = "goalkeeper";
    teamInSeason.players = await Promise.all(players.map((p) => p.save()));
    await teamInSeason.save();
    teams.push(teamInSeason);
  }

  // await Promise.all(seasonPlayers.map((sp) => sp.save()));
  season.teams = teams;
  return season;
}

export async function createSeasons(
  divisions: DivisionModel[],
  teams: TeamModel[],
  users: UserModel[]
): Promise<SeasonModel[]> {
  playerRole = await RoleModel.findOneOrFail({
    where: { roleName: RoleName.PLAYER },
  });
  captainRole = await RoleModel.findOneOrFail({
    where: { roleName: RoleName.CAPTAIN },
  });
  const seasons: SeasonModel[] = [];
  for (const division of divisions) {
    const shuffledUsers = _.shuffle(users);
    const teamsInDivision = _.sample(teams, 8);
    const teamsInDivisionWithPlayerPools = teamsInDivision.map((team, i) => {
      return {
        team,
        playerPool: shuffledUsers.slice(i * 20, (i + 1) * 20),
      };
    });
    seasons.push(
      await createSeason(
        teamsInDivisionWithPlayerPools,
        division,
        `past-${division.name}-season`,
        sub(new Date(), { months: 9 }),
        sub(new Date(), { months: 5 })
      )
    );
    seasons.push(
      await createSeason(
        teamsInDivisionWithPlayerPools,
        division,
        `present-${division.name}-season`,
        sub(new Date(), { months: 2 }),
        add(new Date(), { months: 2 })
      )
    );
    seasons.push(
      await createSeason(
        teamsInDivisionWithPlayerPools,
        division,
        `future-${division.name}-season`,
        add(new Date(), { months: 2 }),
        add(new Date(), { months: 6 })
      )
    );
  }
  return await Promise.all(seasons);
}
