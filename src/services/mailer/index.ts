import { createTransport, Transporter } from 'nodemailer'
import nodemailerSendgrid from 'nodemailer-sendgrid'
import { appConfig } from '../config'
import { injectable } from 'inversify'

@injectable()
export class MailerService {
  private transporter?: Transporter

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
    const html = `
<h1>Hi!</h1>
<h2>Welcome to madrid reds!</h2>
<div>
    <p>We need to confirm your email address.</p>
    <p>Click to confirm your email address</p><br><a href="http://google.com">Click me</a>
</div>`
    return this.sendMail(recipient, 'Confirm your email', 'Click on this link: http://google.com', html)
  }
}
