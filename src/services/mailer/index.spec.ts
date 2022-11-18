import { createTransport } from "nodemailer";
import nodemailerSendgrid from "nodemailer-sendgrid";

import { CryptoServiceMock } from "../crypto/mockImplementation";
import { createLoggerMock } from "../logger";
import { MailerService } from "./index";

jest.mock("nodemailer");
jest.mock("nodemailer-sendgrid");

describe("IMailerService", () => {
  const sendMailMock = jest.fn();
  const spies: jest.SpyInstance[] = [];
  beforeAll(() => {
    spies.push(
      jest.spyOn(CryptoServiceMock.prototype, "encrypt"),
      jest.spyOn(CryptoServiceMock.prototype, "decrypt"),
      jest.spyOn(CryptoServiceMock.prototype, "generateSecret"),
      jest.spyOn(CryptoServiceMock.prototype, "signJwt"),
      jest.spyOn(CryptoServiceMock.prototype, "decryptJwt"),
      jest.spyOn(CryptoServiceMock.prototype, "verifyAndDecryptJwt")
    );
  });
  afterAll(() => {
    spies.forEach((spy) => spy.mockRestore());
  });
  beforeEach(() => {
    spies.forEach((spy) => spy.mockClear());
    sendMailMock.mockClear();
    jest
      .mocked(createTransport)
      .mockClear()
      .mockReturnValue({
        sendMail: sendMailMock,
      } as any);

    jest
      .mocked(nodemailerSendgrid)
      .mockClear()
      .mockImplementation((config) => config as any);
  });
  describe("in the local environment", () => {
    const mailer = new MailerService(
      {
        env: "local",
        SENDGRID_API_KEY: "SENDGRID_API_KEY",
        MAILTRAP_USER: "MAILTRAP_USER",
        MAILTRAP_PASS: "MAILTRAP_PASS",
        VERIFY_EMAIL_URL: "VERIFY_EMAIL_URL",
        AUTHENTICATE_URL: "AUTHENTICATE_URL",
      } as any,
      new CryptoServiceMock(),
      createLoggerMock(false, {}) as any
    );
    it("sends a verification email with a verification link through mailtrap", async () => {
      expect.assertions(2);
      await mailer.sendConfirmEmail(
        "recipient@test.com",
        "verification-token-abc",
        "iv-string"
      );
      expect(createTransport as jest.Mock).toHaveBeenCalledWith({
        apiKey: "SENDGRID_API_KEY",
      });
      expect(sendMailMock).toHaveBeenCalledWith({
        from: "al.quirk@gmail.com",
        html: `
<h1>Hi!</h1>
<h2>Welcome to madrid reds!</h2>
<div>
    <p>We need to confirm your email address.</p>
    <a href="VERIFY_EMAIL_URL?iv=iv-string&verificationToken=verification-token-abc">Click to confirm your email address</a>
</div>`,
        subject: "Confirm your email address",
        text: "Go here: VERIFY_EMAIL_URL?iv=iv-string&verificationToken=verification-token-abc",
        to: "recipient@test.com",
      });
    });
  });
  describe.skip("in the dev environment", () => {
    const mailer = new MailerService(
      {
        env: "dev",
        SENDGRID_API_KEY: "SENDGRID_API_KEY",
        MAILTRAP_USER: "MAILTRAP_USER",
        MAILTRAP_PASS: "MAILTRAP_PASS",
        VERIFY_EMAIL_URL: "VERIFY_EMAIL_URL",
        AUTHENTICATE_URL: "AUTHENTICATE_URL",
      } as any,
      new CryptoServiceMock(),
      createLoggerMock(false, {}) as any
    );
    it("sends a verification email with a verification link through sendgrid", async () => {
      expect.assertions(2);
      await mailer.sendConfirmEmail(
        "recipient@test.com",
        "verification-token-abc",
        "iv-string"
      );
      expect(createTransport as jest.Mock).toHaveBeenCalledWith({
        auth: {
          pass: "MAILTRAP_PASS",
          user: "MAILTRAP_USER",
        },
        host: "smtp.mailtrap.io",
        port: 2525,
      });
      expect(sendMailMock).toHaveBeenCalledWith({
        from: "al.quirk@gmail.com",
        html: `
<h1>Hi!</h1>
<h2>Welcome to madrid reds!</h2>
<div>
    <p>We need to confirm your email address.</p>
    <a href="VERIFY_EMAIL_URL?iv=iv-string&verificationToken=verification-token-abc">Click to confirm your email address</a>
</div>`,
        subject: "Confirm your email address",
        text: "Go here: VERIFY_EMAIL_URL?iv=iv-string&verificationToken=verification-token-abc",
        to: "recipient@test.com",
      });
    });
  });
});
