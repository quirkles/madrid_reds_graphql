import { createTransport, Transporter } from 'nodemailer'
import nodemailerSendgrid from 'nodemailer-sendgrid'
import { inject, injectable } from 'inversify'
import { ICryptoService } from '../crypto'
import { IAppConfig } from '../../config'
import { Logger } from 'winston'

export interface IMailerService {
  initTransporter(): Promise<void>
  sendConfirmEmailEmail(recipient: string): Promise<void>
}

@injectable()
export class MailerService implements IMailerService {
  @inject('cryptoService') cryptoService!: ICryptoService
  @inject('logger') logger!: Logger

  private transporter?: Transporter
  private readonly sendgridApi!: string
  private readonly verifyEmailUrl!: string

  constructor (
      @inject('appConfig') appConfig: IAppConfig
  ) {
    this.sendgridApi = appConfig.SENDGRID_API_KEY
    this.verifyEmailUrl = appConfig.VERIFY_EMAIL_URL
  }

  async initTransporter (): Promise<void> {
    this.transporter = createTransport(nodemailerSendgrid({ apiKey: this.sendgridApi }))
  }

  private async sendMail (recipient: string, subject: string, content: string, htmlContent: string): Promise<void> {
    if (!this.transporter) {
      await this.initTransporter()
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
    } catch (err) {
      this.logger.warn('Failed to send email', { err })
    }
  }

  sendConfirmEmailEmail (recipient: string): Promise<void> {
    const confirmUrl = `${this.verifyEmailUrl}`
    const ivString = encodeURI(this.cryptoService.initializationVectorString)
    console.log('\n\nivString', ivString, '\n\n')
    const html = `
<h1>Hi!</h1>
<h2>Welcome to madrid reds!</h2>
<div>
    <p>We need to confirm your email address.</p>
    <a href="${confirmUrl}?iv=${ivString}">Click to confirm your email address</a>
    <p>Heres some after text</p>
</div>`
    return this.sendMail(recipient, 'Confirm your email address', 'Click on this link: http://google.com', html)
  }
}
