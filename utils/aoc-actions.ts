require('dotenv').config();
import https from 'https';
import cheerio from 'cheerio';

/**
 * Downloads the puzzle input for a specific day and year from Advent of Code.
 * 
 * @param {string} day - The day number of the puzzle (1-25)
 * @param {string} year - The year of the puzzle (e.g. "2020", "2021", etc.)
 * @returns {Promise<string>} A promise that resolves with the puzzle input text
 * @throws {Error} If the HTTP request fails or returns an error
 * @example
 * const input = await downloadInputForYearAndDay("1", "2020");
 */
export const downloadInputForYearAndDay = (day: string, year: string) => {
    return new Promise((resolve, reject) => {
        const options = {
            hostname: 'adventofcode.com',
            path: `/${year}/day/${day}/input`,
            method: 'GET',
            port: '443',
            headers: {
                'Cookie': `session=${process.env.SESSION_COOKIE}`,
            }
        }
        let data = '';
        https.get(options, (res: any) => {
            res.on('data', (dataChunk: any) => {
                data += dataChunk;
            });
            res.on('error', (err: Error) => {
                reject(err);
            });
            res.on('close', (done: any) => resolve(data))
        })
    });
}

/**
 * Retrieves the puzzle description/instructions for a specific day and year from Advent of Code.
 * The description is returned as HTML that can be converted to markdown.
 * 
 * @param {string} year - The year of the puzzle (e.g. "2020", "2021", etc.)
 * @param {string} day - The day number of the puzzle (1-25)
 * @returns {Promise<string>} A promise that resolves with the puzzle description HTML
 * @throws {Error} If the HTTP request fails or returns an error
 * @example
 * const description = await getPuzzleDescription("2020", "1");
 */
export const getPuzzleDescription = (year: string, day: string) => {
    return new Promise((resolve, reject) => {
        const options = {
            hostname: 'adventofcode.com',
            path: `/${year}/day/${day}`,
            method: 'GET',
            port: '443',
            headers: {
                'Cookie': `session=${process.env.SESSION_COOKIE}`,
            }
        }
        let data = '';
        https.get(options, (res: any) => {
            res.on('data', (dataChunk: any) => {
                data += dataChunk;
            });
            res.on('error', (err: Error) => {
                reject(err);
            });
            res.on('close', (done: any) => {
                resolve(getReadmePage(data))
            })
        })
    });
}

/**
 * Extracts the puzzle description content from an Advent of Code page HTML.
 * Uses Cheerio to parse the HTML and extract the description section.
 * 
 * @param {string} page - The full HTML content of the puzzle page
 * @returns {string} The extracted puzzle description as HTML
 * @example
 * const description = getReadmePage(pageHtml);
 */
export const getReadmePage = (page: any) => {
    const $ = cheerio.load(page);
    let nodes = $('.day-desc').children().toArray()
    let markdown = nodes.map(n => $(n).html()).join("");
    return markdown
}
