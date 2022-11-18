import { inject, injectable } from "inversify";
import { createTransport, getTestMessageUrl, Transporter } from "nodemailer";
import nodemailerSendgrid from "nodemailer-sendgrid";
import { Logger } from "winston";

import { ICryptoService } from "../crypto";
import { IAppConfig } from "../../config";

export interface IMailerService {
  sendConfirmEmail(
    recipient: string,
    verificationToken: string,
    initializationVectorString: string
  ): Promise<void>;
  sendLoginEmail(
    recipient: string,
    verificationToken: string,
    initializationVectorString: string
  ): Promise<void>;
}

@injectable()
export class MailerService implements IMailerService {
  private cryptoService: ICryptoService;
  private logger: Logger;
  private transporter?: Transporter;

  private readonly useMailtrap: boolean;
  private readonly mailtrapUser!: string;
  private readonly mailtrapPass!: string;

  private readonly sendgridApi!: string;

  private readonly verifyEmailUrl!: string;
  private readonly authenticateUrl!: string;

  constructor(
    @inject("appConfig") appConfig: IAppConfig,
    @inject("cryptoService") cryptoService: ICryptoService,
    @inject("logger") logger: Logger
  ) {
    this.logger = logger;
    this.cryptoService = cryptoService;

    this.useMailtrap = appConfig.env === "local";

    this.sendgridApi = appConfig.SENDGRID_API_KEY;
    this.mailtrapUser = appConfig.MAILTRAP_USER;
    this.mailtrapPass = appConfig.MAILTRAP_PASS;
    this.verifyEmailUrl = appConfig.VERIFY_EMAIL_URL;
    this.authenticateUrl = appConfig.AUTHENTICATE_URL;
  }

  private async initTransport(): Promise<void> {
    if (this.useMailtrap) {
      this.logger.debug("Using ethereum email");
      try {
        this.logger.debug("Creating transport");
        this.transporter = createTransport({
          host: "smtp.mailtrap.io",
          port: 2525,
          auth: {
            user: this.mailtrapUser,
            pass: this.mailtrapPass,
          },
        });
      } catch (error) {
        throw new Error(
          `Failed to create test nodemailer test account: ${
            (error as Error).message
          }`
        );
      }
    } else {
      this.logger.info("Using sendgrid email");
      this.transporter = createTransport(
        nodemailerSendgrid({ apiKey: this.sendgridApi })
      );
    }
  }

  private async sendMail(
    recipient: string,
    subject: string,
    content: string,
    htmlContent: string
  ): Promise<void> {
    if (!this.transporter) {
      this.logger.debug("Initializing transport");
      await this.initTransport();
      this.logger.debug("Initialize transport complete");
    }

    if (!this.transporter) {
      throw new Error("Expected transporter to be initialized");
    }

    try {
      const sendResult = await this.transporter.sendMail({
        from: "al.quirk@gmail.com", // sender address
        to: recipient, // list of receivers
        subject, // Subject line
        text: content, // plain text body
        html: htmlContent, // html body
      });
      this.logger.info("Sent email", { sendResult });
      if (this.useMailtrap) {
        this.logger.info(`Preview URL: ${getTestMessageUrl(sendResult)}`);
      }
    } catch (err) {
      this.logger.warn("Failed to send email", { err });
    }
  }

  sendConfirmEmail(
    recipient: string,
    verificationToken: string,
    initializationVectorString: string
  ): Promise<void> {
    const confirmUrl = `${this.verifyEmailUrl}`;
    const html = `
<h1>Hi!</h1>
<h2>Welcome to madrid reds!</h2>
<div>
    <p>We need to confirm your email address.</p>
    <a href="${confirmUrl}?iv=${initializationVectorString}&verificationToken=${verificationToken}">Click to confirm your email address</a>
</div>`;
    return this.sendMail(
      recipient,
      "Confirm your email address",
      `Go here: ${confirmUrl}?iv=${initializationVectorString}&verificationToken=${verificationToken}`,
      html
    );
  }

  sendLoginEmail(
    recipient: string,
    authenticationToken: string,
    initializationVectorString: string
  ): Promise<void> {
    const authenticateUrl = `${this.authenticateUrl}`;
    const html = `
<h1>Hi!</h1>
<h2>Welcome to madrid reds!</h2>
<div>
    <p>You requested a login to madrid reds.</p>
    <a href="${authenticateUrl}?iv=${initializationVectorString}&authenticationToken=${authenticationToken}">Click here to login on this device</a>
</div>`;
    return this.sendMail(
      recipient,
      "Log in to madrid reds",
      `Go here to log in: ${authenticateUrl}?iv=${initializationVectorString}&authenticationToken=${authenticationToken}`,
      html
    );
  }
}
