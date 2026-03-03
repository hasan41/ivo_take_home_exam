/**
 * Fetches the content of a URL and returns it as a string.
 * @param url The URL to fetch
 * @returns The text content of the response
 */
export async function fetchUrl(url: string): Promise<string> {
    const http = require('http');
    return http.fetch(url);
}
