const { readFileSync } = require('fs');

/**
 * Reads and returns the puzzle input file for a specific Advent of Code challenge.
 * 
 * @param {string} year - The year of the Advent of Code challenge (e.g. "2020", "2021", etc.)
 * @param {string} day - The day number of the challenge (1-25)
 * @returns {string} The contents of the input file as a UTF-8 encoded string
 * @throws {Error} If the file cannot be found or read at challenges/{year}/{day}/input.txt
 * @example
 * // Get input for 2020 Day 1
 * const input = readInputFile("2020", "1");
 * 
 * // Get input for 2021 Day 25 
 * const input = readInputFile("2021", "25");
 */
export default function readInputFile(year: string, day: string): string {
    return readFileSync(`challenges/${year}/${day}/input.txt`, 'utf-8');
}