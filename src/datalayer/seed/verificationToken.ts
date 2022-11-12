import { faker } from "@faker-js/faker";
import { VerificationTokenModel } from "../models";

export function createVerificationToken(
  email: string
): Promise<VerificationTokenModel> {
  const createdAtDate = faker.date.past(1);
  const token = VerificationTokenModel.create({
    email,
    secret: faker.random.alphaNumeric(15),
    createdAt: createdAtDate.getTime(),
    verifiedAt: createdAtDate.getTime() + Math.random() * 1000 * 60 * 15,
  });
  return token.save();
}
