import {
  Resolver,
  Query,
  Mutation,
  Arg,
  FieldResolver,
  ResolverInterface,
  Root,
} from "type-graphql";
import { inject, injectable } from "inversify";
import { Logger } from "winston";

import { ICryptoService, IMailerService } from "../../services";
import {
  IAuthenticationTokenRepository,
  IUserRepository,
  IUserToTeamRepository,
  IVerificationTokenRepository,
  UserModel,
  UserToTeamModel,
} from "../../datalayer";
import { AuthenticationResponse, VerifyTokenResponse } from "./responseTypes";

@Resolver(() => UserModel)
@injectable()
export class UserResolver implements ResolverInterface<UserModel> {
  @inject("MailerService")
  private mailer!: IMailerService;

  @inject("logger")
  private logger!: Logger;

  @inject("cryptoService")
  cryptoService!: ICryptoService;

  @inject("UserRepositoryFactory")
  private userRepositoryFactory!: () => IUserRepository;

  @inject("UserToTeamRepositoryFactory")
  private userToTeamRepositoryFactory!: () => IUserToTeamRepository;

  @inject("VerificationTokenFactory")
  private verificationTokenRepositoryFactory!: () => IVerificationTokenRepository;

  @inject("AuthenticationTokenFactory")
  private authenticationTokenRepositoryFactory!: () => IAuthenticationTokenRepository;

  @Mutation(() => Boolean)
  async signUp(@Arg("emailAddress") emailAddress: string): Promise<boolean> {
    try {
      const userRepo = this.userRepositoryFactory();
      const verificationTokenRepo = this.verificationTokenRepositoryFactory();
      let user = await userRepo.findOne({
        where: { email: emailAddress },
        relations: { verificationTokens: true },
      });
      if (user) {
        this.logger.info("User already exists");
      } else {
        user = await userRepo.create({
          email: emailAddress,
          isVerified: false,
        });
        user.verificationTokens = [];
        this.logger.info(`Creating user with email: ${emailAddress}`);
      }
      this.logger.debug("user", { user });
      const { initializationVector, token } =
        await verificationTokenRepo.createTokenForUser(user);
      await this.mailer.sendConfirmEmail(
        emailAddress,
        token,
        initializationVector
      );
      return true;
    } catch (err) {
      this.logger.error("Failed to send email", {
        error: (err as Error).message,
      });
      return false;
    }
  }

  @Mutation(() => Boolean)
  async sendLoginLink(
    @Arg("emailAddress") emailAddress: string
  ): Promise<boolean> {
    try {
      const userRepo = this.userRepositoryFactory();
      const authenticationTokenRepository =
        this.authenticationTokenRepositoryFactory();
      const user = await userRepo.findOne({
        where: { email: emailAddress },
        relations: { verificationTokens: true },
      });
      if (!user) {
        this.logger.info("No user exists for this email");
        return false;
      }
      const { initializationVector, token } =
        await authenticationTokenRepository.createTokenForUser(user);
      await this.mailer.sendLoginEmail(
        emailAddress,
        token,
        initializationVector
      );
      return true;
    } catch (err) {
      this.logger.error("Failed to send email", {
        error: (err as Error).message,
      });
      return false;
    }
  }

  @Mutation(() => VerifyTokenResponse)
  async authenticateVerificationToken(
    @Arg("emailAddress") emailAddress: string,
    @Arg("secret") tokenSecret: string
  ): Promise<VerifyTokenResponse> {
    try {
      const verificationTokenRepo = this.verificationTokenRepositoryFactory();

      const verificationToken = await verificationTokenRepo.findOne({
        where: {
          secret: tokenSecret,
          email: emailAddress,
        },
        relations: {
          user: true,
        },
      });
      if (verificationToken) {
        this.logger.info("found token", { verificationToken });
        const now = Date.now();
        if (now - verificationToken.createdAt > 1000 * 60 * 15) {
          return {
            wasVerificationSuccessful: false,
            verificationError: "Verification token expired",
          };
        }

        if (verificationToken.email !== emailAddress) {
          return {
            wasVerificationSuccessful: false,
            verificationError: "Verification email didnt match",
          };
        }

        if (verificationToken.secret !== tokenSecret) {
          return {
            wasVerificationSuccessful: false,
            verificationError: "Verification secret didnt match",
          };
        }

        if (!verificationToken.user) {
          return {
            wasVerificationSuccessful: false,
            verificationError: "No matching user",
          };
        }

        if (verificationToken.user.isVerified) {
          return {
            wasVerificationSuccessful: false,
            verificationError: "User already verified",
          };
        }

        await verificationTokenRepo.verifyUserWithToken(verificationToken);
        return {
          wasVerificationSuccessful: true,
          jwt: this.cryptoService.signJwt({ email: emailAddress }),
        };
      } else {
        return {
          wasVerificationSuccessful: false,
          verificationError: "Failed to find any matching token",
        };
      }
    } catch (err) {
      this.logger.error("Failed to validate token", {
        error: (err as Error).message,
      });
      return {
        wasVerificationSuccessful: false,
        verificationError: (err as Error).message,
      };
    }
  }

  @Mutation(() => AuthenticationResponse)
  async authenticateSignInToken(
    @Arg("emailAddress") emailAddress: string,
    @Arg("secret") secret: string
  ): Promise<AuthenticationResponse> {
    try {
      const authenticationTokenRepository =
        this.authenticationTokenRepositoryFactory();

      const authenticationToken = await authenticationTokenRepository.findOne({
        where: {
          secret,
          email: emailAddress,
        },
        relations: {
          user: true,
        },
      });
      if (authenticationToken) {
        this.logger.info("found token", { authenticationToken });
        const now = Date.now();
        if (now - authenticationToken.createdAt > 1000 * 60 * 15) {
          return {
            wasAuthenticationSuccessful: false,
            authenticationError: "Authentication token expired",
          };
        }

        if (authenticationToken.email !== emailAddress) {
          return {
            wasAuthenticationSuccessful: false,
            authenticationError: "Authentication email didnt match",
          };
        }

        if (authenticationToken.secret !== secret) {
          return {
            wasAuthenticationSuccessful: false,
            authenticationError: "Authentication secret didnt match",
          };
        }

        if (!authenticationToken.user) {
          return {
            wasAuthenticationSuccessful: false,
            authenticationError: "No matching user",
          };
        }

        await authenticationTokenRepository.authenticateUserWithToken(
          authenticationToken
        );
        return {
          wasAuthenticationSuccessful: true,
          jwt: this.cryptoService.signJwt({ email: emailAddress }),
        };
      } else {
        return {
          wasAuthenticationSuccessful: false,
          authenticationError: "Failed to find any matching token",
        };
      }
    } catch (err) {
      this.logger.error("Failed to authenticate token", {
        error: (err as Error).message,
      });
      return {
        wasAuthenticationSuccessful: false,
        authenticationError: (err as Error).message,
      };
    }
  }

  @FieldResolver(() => [UserToTeamModel], { name: "teamsPlayerIsOn" })
  async userToTeams(@Root() user: UserModel): Promise<UserToTeamModel[]> {
    const repo = this.userToTeamRepositoryFactory();
    return repo.find({
      where: {
        userId: user.id,
      },
    });
  }
}
