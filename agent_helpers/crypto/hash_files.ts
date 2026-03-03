/**
 * Hashes each file in the given list using the specified algorithm
 * and returns the one with the lexicographically lowest hash.
 * 
 * @param fileNames Array of file names to hash (relative to current directory)
 * @param algorithm Hash algorithm: 'sha256' or 'md5'
 * @returns The filename with the lowest hash value
 */
export function findLowestHash(fileNames: string[], algorithm: string): string {
    const fs = require('fs');
    const crypto = require('crypto');

    let lowestHash = '';
    let lowestFile = '';

    for (const fileName of fileNames) {
        const contents: Uint8Array = fs.readFileSync(fileName);
        const h: string = crypto.createHash(algorithm, contents, 'hex');
        if (lowestHash === '' || h < lowestHash) {
            lowestHash = h;
            lowestFile = fileName;
        }
    }

    return lowestFile;
}

/**
 * Hashes each file in the given list using the specified algorithm
 * and returns an array of {file, hash} pairs sorted lexicographically by hash.
 * 
 * @param fileNames Array of file names to hash (relative to current directory)
 * @param algorithm Hash algorithm: 'sha256' or 'md5'
 * @returns Sorted array of {file: string, hash: string} pairs
 */
export function hashAndSortFiles(fileNames: string[], algorithm: string): Array<{ file: string, hash: string }> {
    const fs = require('fs');
    const crypto = require('crypto');

    const results = fileNames.map(fileName => {
        const contents: Uint8Array = fs.readFileSync(fileName);
        const h: string = crypto.createHash(algorithm, contents, 'hex');
        return { file: fileName, hash: h };
    });

    results.sort((a, b) => a.hash < b.hash ? -1 : a.hash > b.hash ? 1 : 0);
    return results;
}
