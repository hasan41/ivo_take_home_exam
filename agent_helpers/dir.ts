/**
 * Lists file names in a directory.
 * @param dirPath The directory path (relative to current directory)
 * @returns Array of filenames in the directory
 */
export function listDir(dirPath: string): string[] {
    const fs = require('fs');
    return fs.readdirSync(dirPath);
}

/**
 * Reads the contents of a file as a string.
 * @param fileName The file path (relative to current directory)
 * @returns The file contents as a UTF-8 string
 */
export function readTextFile(fileName: string): string {
    const fs = require('fs');
    return fs.readFileSync(fileName, 'utf-8');
}
