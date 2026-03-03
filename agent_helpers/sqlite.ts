/**
 * Queries a SQLite database and returns results.
 * @param dbPath The path to the SQLite database file (relative to current directory)
 * @param query The SQL query to execute
 * @returns Array of row objects, or an object with an error property if the query fails
 */
export function queryDb(dbPath: string, query: string): Record<string, any>[] | { error: string } {
    const sqlite = require('sqlite');
    return sqlite.query(dbPath, query);
}
