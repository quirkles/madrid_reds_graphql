import { inject, injectable } from 'inversify'
import { createTestAccount, createTransport, getTestMessageUrl, Transporter } from 'nodemailer'
import nodemailerSendgrid from 'nodemailer-sendgrid'
import { Logger } from 'winston'

import { ICryptoService } from '../crypto'
import { IAppConfig } from '../../config'

export interface IMailerService {
  sendConfirmEmail(recipient: string, verificationToken: string): Promise<void>
}

@injectable()
export class MailerService implements IMailerService {
  @inject('cryptoService') cryptoService!: ICryptoService
  @inject('logger') logger!: Logger

  private useEthereum = false
  private transporter?: Transporter
  private readonly sendgridApi!: string
  private readonly verifyEmailUrl!: string

  constructor (
      @inject('appConfig') appConfig: IAppConfig
  ) {
    this.sendgridApi = appConfig.SENDGRID_API_KEY
    this.verifyEmailUrl = appConfig.VERIFY_EMAIL_URL
    this.useEthereum = appConfig.env === 'local'
  }

  private async initTransport (): Promise<void> {
    if (this.useEthereum) {
      this.logger.info('Using ethereum email')
      try {
        const testAccount = await createTestAccount()
        this.transporter = createTransport({
          host: 'smtp.ethereal.email',
          port: 587,
          secure: false, // true for 465, false for other ports
          auth: {
            user: testAccount.user, // generated ethereal user
            pass: testAccount.pass // generated ethereal password
          }
        })
      } catch (error) {
        throw new Error(`Failed to create test nodemailer test account: ${(error as Error).message}`)
      }
    } else {
      this.logger.info('Using sendgrid email')
      this.transporter = createTransport(nodemailerSendgrid({ apiKey: this.sendgridApi }))
    }
  }

  private async sendMail (recipient: string, subject: string, content: string, htmlContent: string): Promise<void> {
    if (!this.transporter) {
      await this.initTransport()
    }

    if (!this.transporter) {
      throw new Error('Expected transporter to be initialized')
    }

    try {
      const sendResult = await this.transporter.sendMail({
        from: 'al.quirk@gmail.com', // sender address
        to: recipient, // list of receivers
        subject, // Subject line
        text: content, // plain text body
        html: htmlContent // html body
      })
      this.logger.info('Sent email', { sendResult })
      if (this.useEthereum) {
        this.logger.info(`Preview URL: ${getTestMessageUrl(sendResult)}`)
      }
    } catch (err) {
      this.logger.warn('Failed to send email', { err })
    }
  }

  sendConfirmEmail (recipient: string, verificationToken: string): Promise<void> {
    const confirmUrl = `${this.verifyEmailUrl}`
    const ivString = this.cryptoService.initializationVectorString.toString()
    const html = `
<h1>Hi!</h1>
<h2>Welcome to madrid reds!</h2>
<div>
    <p>We need to confirm your email address.</p>
    <a href="${confirmUrl}?iv=${ivString}&verificationToken=${verificationToken}">Click to confirm your email address</a>
    <p>Heres some after text</p>
</div>`
    return this.sendMail(recipient, 'Confirm your email address', 'Click on this link: http://google.com', html)
  }
}
