import { Container } from 'inversify'

import { ICryptoService, CryptoService, IMailerService, MailerService } from '../services'
import { UserResolver } from '../resolvers'
import { appConfig, IAppConfig } from '../config'
import { TYPES } from './types'

const container = new Container({ skipBaseClassChecks: true })
container.bind<UserResolver>(UserResolver).to(UserResolver).inSingletonScope()

container.bind<IMailerService>(TYPES.MailerService).to(MailerService).inSingletonScope()

container.bind<IAppConfig>(TYPES.appConfig).toConstantValue(appConfig)

const sharedCryptoService = new CryptoService(appConfig)
container.bind<ICryptoService>(TYPES.cryptoService).toConstantValue(sharedCryptoService)

export { container, TYPES }
