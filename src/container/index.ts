import { Container } from 'inversify'

import { UserResolver } from '../resolvers'
import { MailerService } from '../mailer'

const container = new Container({ skipBaseClassChecks: true })
container.bind<UserResolver>(UserResolver).to(UserResolver).inSingletonScope()
container.bind<MailerService>('MailerService').to(MailerService)
export { container }
