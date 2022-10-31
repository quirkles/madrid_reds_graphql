import * as crypto from 'crypto'

import { injectable } from 'inversify'

import { IAppConfig } from '../../config'

export interface ICryptoService {
  encryptString (unencrypted: string): Promise<string>
  encryptString (encrypted: string): Promise<string>
  initializationVectorString: string
}

@injectable()
class CryptoService implements ICryptoService {
  private algorithm = 'aes-192-cbc'
  private encryptionKey: Buffer
  private initializationVector: Buffer

  constructor (appConfig: IAppConfig) {
    this.encryptionKey = crypto.scryptSync(appConfig.ENCRYPTION_SECRET, 'salt', 24)
    this.initializationVector = crypto.randomFillSync(Buffer.alloc(16, 0))
  }

  get initializationVectorString (): string {
    return this.initializationVector.toString()
  }

  async encryptString (unencrypted: string): Promise<string> {
    const algorithm = this.algorithm
    const key = this.encryptionKey
    const initializationVector = this.initializationVector
    return new Promise((resolve, reject) => {
      // Create Cipher with key and iv
      const cipher = crypto.createCipheriv(algorithm, key, initializationVector)

      let encrypted = ''
      cipher.setEncoding('hex')

      cipher.on('data', (chunk) => { encrypted += chunk })
      cipher.on('end', () => resolve(encrypted))// Prints encrypted data with key

      cipher.write(unencrypted)
      cipher.end()
    })
  }

  async decryptString (encrypted: string): Promise<string> {
    const algorithm = this.algorithm
    const key = this.encryptionKey
    const initializationVector = this.initializationVector

    return new Promise((resolve, reject) => {
      // Create decipher with key and iv
      const decipher = crypto.createDecipheriv(algorithm, key, initializationVector)

      let decrypted = ''
      decipher.on('readable', () => {
        let chunk: Buffer
        while ((chunk = decipher.read()) !== null) {
          decrypted += chunk.toString('utf8')
        }
      })
      decipher.on('end', () => {
        return resolve(decrypted)
      })

      decipher.write(encrypted, 'hex')
      decipher.end()
    })
  }
}

export { CryptoService }
