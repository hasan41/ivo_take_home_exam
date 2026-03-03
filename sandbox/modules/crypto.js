const ivm = require("isolated-vm");
const crypto = require("crypto");
const fs = require("fs");
const path = require("path");

function createCryptoModule() {
  return {
    /**
     * Creates SHA-256 hash of data
     * @param {string|Buffer} data - Data to hash
     * @param {string} encoding - Output encoding ('hex', 'base64', etc.)
     */
    createHash: (algorithm, data, encoding = "hex") => {
      const hash = crypto.createHash(algorithm);
      if (typeof data === "string") {
        hash.update(data);
      } else {
        hash.update(Buffer.from(data));
      }
      return hash.digest(encoding);
    },

    /**
     * Decrypts AES-256-GCM encrypted data
     * @param {Uint8Array|Buffer} ciphertext - Full encrypted file (iv + ciphertext + authTag)
     * @param {string|Buffer} key - Encryption key (32 bytes for AES-256)
     * @returns {Buffer} - Decrypted data
     */
    decryptAesGcm: (ciphertext, key) => {
      const buf = Buffer.isBuffer(ciphertext)
        ? ciphertext
        : Buffer.from(ciphertext);
      const keyBuf = Buffer.isBuffer(key) ? key : Buffer.from(key);

      const iv = buf.slice(0, 12);
      const authTag = buf.slice(buf.length - 16);
      const encrypted = buf.slice(12, buf.length - 16);

      const decipher = crypto.createDecipheriv("aes-256-gcm", keyBuf, iv);
      decipher.setAuthTag(authTag);

      const decrypted = Buffer.concat([
        decipher.update(encrypted),
        decipher.final(),
      ]);
      return decrypted;
    },
  };
}

async function register(context, { cwd } = {}) {
  const cryptoModule = createCryptoModule();

  // Register hash function
  context.global.setSync(
    "_cryptoCreateHash",
    new ivm.Reference((algorithm, data, encoding) => {
      return cryptoModule.createHash(algorithm, data, encoding);
    })
  );

  // Register AES-GCM decrypt
  context.global.setSync(
    "_cryptoDecryptAesGcm",
    new ivm.Reference((cipherBuf, keyBuf) => {
      const result = cryptoModule.decryptAesGcm(cipherBuf, keyBuf);
      return new ivm.ExternalCopy(result.buffer).copyInto();
    })
  );

  const injectedCode = fs.readFileSync(
    path.join(__dirname, "crypto_injected.js"),
    "utf-8"
  );
  await context.eval(injectedCode);
}

module.exports = { register };
