import "reflect-metadata";

import { CryptoService } from "./index";

describe("crypto", () => {
  it("encrypts and decrypts a message", async () => {
    expect.assertions(2);
    const crypto = new CryptoService({
      ENCRYPTION_SECRET: "test-secret",
    } as any);
    const result = await crypto.encrypt({
      unencryptedInput: "test input",
    });
    expect(typeof result).toEqual({
      result: expect.any(String),
      initializationVector: expect.any(Buffer),
      algorithm: expect.any(String),
    });
    const decrypted = await crypto.decrypt({
      initializationVector: result.initializationVector,
      encryptedInput: result.result,
    });
    expect(decrypted).toBe("test input");
  });
  it.each(Array.from({ length: 50 }).map((_, i) => i + 1))(
    "generates a random string",
    (n) => {
      const crypto = new CryptoService({
        ENCRYPTION_SECRET: "test-secret",
      } as any);
      const actual = crypto.generateSecret(n);
      expect(actual).toEqual(expect.any(String));
      expect(actual.length).toBe(n);
    }
  );
});
