import { random, sample } from "underscore";
import { add, differenceInDays } from "date-fns";

import {
  EventTypeModel,
  FixtureModel,
  GameEventModel,
  SeasonModel,
} from "../models";

export async function createFixturesForSeason(
  season: SeasonModel,
  eventTypes: EventTypeModel[]
): Promise<FixtureModel[]> {
  const fixtures: FixtureModel[] = [];
  const { startDate, endDate, teams } = season;
  const gameDays = 2 * (teams.length - 1);
  const seasonDurationInDays = differenceInDays(startDate, endDate);
  const daysBetweenGames = Math.floor(seasonDurationInDays / gameDays);
  let gameDay = 0;
  while (gameDay < gameDays) {
    const teamsClone = [...teams];
    const gameDate = add(startDate, { days: gameDay * daysBetweenGames });
    const gameInThePast = gameDate < new Date();
    while (teamsClone.length > 1) {
      const [homeTeam] = teamsClone.splice(0, 1);
      const [awayTeam] = teamsClone.splice(gameDay % teamsClone.length, 1);
      const fixture = await FixtureModel.create({
        homeTeam,
        awayTeam,
        season,
        date: gameDate,
      }).save();
      if (gameInThePast) {
        fixture.gameEvents = await Promise.all(
          Array.from({ length: random(0, 9) }).map(() => {
            return GameEventModel.create({
              gameTimeOfEvent: random(5, 90),
              player: sample([...homeTeam.players, ...awayTeam.players]),
              eventType: sample(eventTypes),
              fixture,
            }).save();
          })
        );
      }
    }
    gameDay++;
  }
  return fixtures;
}
