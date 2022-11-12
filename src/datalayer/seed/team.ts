import { faker } from "@faker-js/faker";
import { TeamModel } from "../models";

function getTeamname(): string {
  switch (Math.random().toString().slice(-1)) {
    case "0":
      return `${faker.color.human()} ${faker.animal.bird()}`;
    case "1":
      return `${faker.company.bsAdjective()}-${faker.company.bsNoun()}`;
    case "2":
      return `${faker.music.genre()}-${faker.commerce.department()}`;
    case "3":
      return `${faker.hacker.adjective()}-${faker.hacker.abbreviation()}`;
    case "4":
    case "5":
    case "6":
      return `${faker.word.adjective()}-${faker.word.noun()}`;
    case "7":
    case "8":
    case "9":
    default:
      return `${faker.word.adverb()}-${faker.word.preposition()}-${faker.word.noun()}`;
  }
}

export async function createRandomTeam(): Promise<TeamModel> {
  const team = TeamModel.create({
    name: getTeamname(),
  });

  return team.save();
}
