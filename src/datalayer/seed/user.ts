import { faker } from "@faker-js/faker";
import { UserModel } from "../models";
import { createVerificationToken } from "./verificationToken";
import { createAuthenticationToken } from "./authenticationToken";

export async function createRandomUser(): Promise<UserModel> {
  const user = UserModel.create({
    verificationTokens: [],
    authenticationTokens: [],
  });
  const userFirstName = faker.name.firstName();
  const userSurname = faker.name.lastName();
  user.name = `${userFirstName} ${userSurname}`;
  user.emailAddress = faker.internet.email(userFirstName, userSurname);
  user.isVerified = Math.random() < 0.95;
  if (user.isVerified) {
    user.verificationTokens.push(
      await createVerificationToken(user.emailAddress)
    );
    user.authenticationTokens.push(
      await createAuthenticationToken(user.emailAddress)
    );
  }
  return user.save();
}
