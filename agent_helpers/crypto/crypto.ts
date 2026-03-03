/**
 * Computes a hash of data using the specified algorithm.
 * @param algorithm The hash algorithm to use (e.g. 'sha256', 'md5')
 * @param data The data to hash. Can be a string or Uint8Array.
 * @param encoding The output encoding (default: 'hex')
 * @returns The hash as a string in the specified encoding
 */
export function hash(algorithm: string, data: string | Uint8Array, encoding: string = 'hex'): string {
    const crypto = require('crypto');
    return crypto.createHash(algorithm, data, encoding);
}

/**
 * Computes the SHA-256 hash of a string or bytes.
 * @param data The string or Uint8Array to hash
 * @returns The SHA-256 hash as a 64-character hex string
 */
export function sha256(data: string | Uint8Array): string {
    const crypto = require('crypto');
    return crypto.createHash('sha256', data, 'hex');
}

/**
 * Computes the MD5 hash of a string or bytes.
 * @param data The string or Uint8Array to hash
 * @returns The MD5 hash as a 32-character hex string
 */
export function md5(data: string | Uint8Array): string {
    const crypto = require('crypto');
    return crypto.createHash('md5', data, 'hex');
}

/**
 * Computes the SHA-256 hash of a file's raw contents.
 * @param fileName The name of the file (relative to current directory)
 * @returns The SHA-256 hash as a hex string
 */
export function sha256File(fileName: string): string {
    const fs = require('fs');
    const crypto = require('crypto');
    const contents: Uint8Array = fs.readFileSync(fileName);
    return crypto.createHash('sha256', contents, 'hex');
}

/**
 * Computes the MD5 hash of a file's raw contents.
 * @param fileName The name of the file (relative to current directory)
 * @returns The MD5 hash as a hex string
 */
export function md5File(fileName: string): string {
    const fs = require('fs');
    const crypto = require('crypto');
    const contents: Uint8Array = fs.readFileSync(fileName);
    return crypto.createHash('md5', contents, 'hex');
}

/**
 * Decrypts an AES-256-GCM encrypted binary file and returns the plaintext string.
 * 
 * The encrypted file format: first 12 bytes = IV, last 16 bytes = auth tag,
 * bytes in between = ciphertext.
 * 
 * @param ciphertextFile The filename of the encrypted binary file (relative to cwd)
 * @param keyHex The 64-character hex string key (e.g. the output of sha256())
 * @returns The decrypted plaintext as a UTF-8 string
 */
export function decryptAesGcm(ciphertextFile: string, keyHex: string): string {
    const fs = require('fs');
    const crypto = require('crypto');
    // Read file as raw bytes (Uint8Array)
    const buf: Uint8Array = fs.readFileSync(ciphertextFile);
    // Convert hex key string to raw bytes
    const keyBytes: Uint8Array = Buffer.from(keyHex, 'hex');
    // Decrypt: crypto.decryptAesGcm returns an ArrayBuffer
    const decryptedBuf: ArrayBuffer = crypto.decryptAesGcm(buf, keyBytes);
    return Buffer.from(decryptedBuf).toString('utf-8');
}
