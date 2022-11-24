import { FixtureModel, GameEventType } from "../../models";
import { Result, TeamResult } from "../../../resolvers";

export function getMatchDataFromFixture(fixture: FixtureModel): Result {
  const { season, homeTeam, awayTeam, gameEvents } = fixture;
  const homeTeamResult: TeamResult = {
    team: homeTeam,
    goals: [],
  };

  const awayTeamResult: TeamResult = {
    team: awayTeam,
    goals: [],
  };

  const homeTeamName = homeTeam.team.name;
  const awayTeamName = awayTeam.team.name;

  let homeTeamGoals = 0;
  let awayTeamGoals = 0;

  gameEvents.forEach((ge) => {
    if (ge.eventType.eventType === GameEventType.GOAL) {
      if (ge.player.teamInSeason.id === homeTeam.id) {
        homeTeamGoals++;
        homeTeamResult.goals.push({
          player: ge.player,
          gameTime: ge.gameTimeOfEvent,
        });
      }
      if (ge.player.teamInSeason.id === awayTeam.id) {
        awayTeamGoals++;
        awayTeamResult.goals.push({
          player: ge.player,
          gameTime: ge.gameTimeOfEvent,
        });
      }
    }
  });

  return {
    date: fixture.date,
    scoreLine: `${awayTeamName} (${awayTeamGoals}) @ (${homeTeamGoals}) ${homeTeamName}`,
    awayTeam: awayTeamResult,
    homeTeam: homeTeamResult,
    season,
  };
}
