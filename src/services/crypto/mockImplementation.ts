import {
  DecryptionParams,
  EncryptionParams,
  EncryptionResult,
  ICryptoService,
  JwtBody,
} from "./index";

export class CryptoServiceMock implements ICryptoService {
  decrypt(params: DecryptionParams): Promise<string> {
    return Promise.resolve("decrypted");
  }

  decryptJwt(token: string): JwtBody {
    return { emailAddress: "test-email" };
  }

  encrypt(params: EncryptionParams): Promise<EncryptionResult> {
    return Promise.resolve({
      result: "testresult",
      initializationVector: Buffer.from("test-iv"),
      algorithmUsedToEncrypt: "aes-192-cbc",
    });
  }

  generateSecret(length?: number): string {
    return "test-secret";
  }

  signJwt(payload: JwtBody): string {
    return "test-jwt";
  }

  verifyAndDecryptJwt(token: string): Promise<JwtBody> {
    return Promise.resolve({ emailAddress: "test-email" });
  }
}
