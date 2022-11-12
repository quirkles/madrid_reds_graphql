import { faker } from "@faker-js/faker";
import { AuthenticationTokenModel } from "../models";

export function createAuthenticationToken(
  email: string
): Promise<AuthenticationTokenModel> {
  const createdAtDate = faker.date.past(1);
  const token = AuthenticationTokenModel.create({
    email,
    secret: faker.random.alphaNumeric(15),
    createdAt: createdAtDate.getTime(),
    authenticatedAt: createdAtDate.getTime() + Math.random() * 1000 * 60 * 15,
  });
  return token.save();
}
