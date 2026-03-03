/**
 * Computes a hash of data using the specified algorithm.
 * @param algorithm The hash algorithm to use (e.g. 'sha256', 'md5')
 * @param data The data to hash. Can be a string or Buffer/Uint8Array.
 * @param encoding The output encoding (default: 'hex')
 * @returns The hash as a string in the specified encoding
 */
export function hash(algorithm: string, data: string | Uint8Array, encoding: string = 'hex'): string {
    const crypto = require('crypto');
    return crypto.createHash(algorithm, data, encoding);
}

/**
 * Computes the SHA-256 hash of a string.
 * @param data The string to hash
 * @returns The SHA-256 hash as a hex string
 */
export function sha256(data: string): string {
    const crypto = require('crypto');
    return crypto.createHash('sha256', data, 'hex');
}

/**
 * Computes the MD5 hash of a string.
 * @param data The string to hash
 * @returns The MD5 hash as a hex string
 */
export function md5(data: string): string {
    const crypto = require('crypto');
    return crypto.createHash('md5', data, 'hex');
}

/**
 * Computes the SHA-256 hash of a file's contents.
 * @param fileName The name of the file (relative to current directory)
 * @returns The SHA-256 hash as a hex string
 */
export function sha256File(fileName: string): string {
    const fs = require('fs');
    const crypto = require('crypto');
    const contents = fs.readFileSync(fileName);
    return crypto.createHash('sha256', contents, 'hex');
}

/**
 * Computes the MD5 hash of a file's contents.
 * @param fileName The name of the file (relative to current directory)
 * @returns The MD5 hash as a hex string
 */
export function md5File(fileName: string): string {
    const fs = require('fs');
    const crypto = require('crypto');
    const contents = fs.readFileSync(fileName);
    return crypto.createHash('md5', contents, 'hex');
}

/**
 * Decrypts AES-256-GCM encrypted data.
 * The format is: first 12 bytes are the IV, last 16 bytes are the auth tag,
 * and the bytes in between are the ciphertext.
 * @param ciphertextFile The filename of the encrypted binary file
 * @param keyHex The encryption key as a 64-character hex string (32 bytes)
 * @returns The decrypted plaintext as a string
 */
export function decryptAesGcm(ciphertextFile: string, keyHex: string): string {
    const fs = require('fs');
    const crypto = require('crypto');
    const buf: ArrayBuffer = fs.readFileSync(ciphertextFile);
    const key = Buffer.from(keyHex, 'hex');
    const decrypted: ArrayBuffer = crypto.decryptAesGcm(buf, key);
    return Buffer.from(decrypted).toString('utf-8');
}
