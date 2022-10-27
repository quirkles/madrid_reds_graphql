import { Inject, Service } from 'typedi'
import { createTransport, Transporter } from 'nodemailer'
import nodemailerSendgrid from 'nodemailer-sendgrid'
import { Logger } from 'winston'
import { appConfig } from '../config'

@Service('MailerService')
export class MailerService {
  private transporter?: Transporter

  @Inject('Logger')
  private logger!: Logger

  async initTransporter () {
    this.transporter = createTransport(nodemailerSendgrid({ apiKey: appConfig.SENDGRID_API_KEY }))
  }

  private async sendMail (recipient: string, subject: string, content: string, htmlContent: string): Promise<void> {
    if (!this.transporter) {
      await this.initTransporter()
    }

    if (!this.transporter) {
      throw new Error('Expected transporter to be initialized')
    }

    await this.transporter.sendMail({
      from: 'al.quirk@gmail.com', // sender address
      to: recipient, // list of receivers
      subject, // Subject line
      text: content, // plain text body
      html: htmlContent // html body
    })
  }

  sendConfirmEmailEmail (recipient: string): Promise<void> {
    const html = '<h2>Welcome to madrid reds</h2><p>Click to confirm your email address</p><br><a href="http://google.com">Click me</a>'
    return this.sendMail(recipient, 'Confirm your email', 'Click on this link: http;??google.com', html)
  }
}
