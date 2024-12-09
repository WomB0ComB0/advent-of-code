import { readFileSync } from 'fs';
import { join } from 'path';

/**
 * Reads and returns the puzzle input for a specific Advent of Code challenge.
 *
 * @param {number} year - The year of the Advent of Code challenge (e.g. 2020, 2021, etc.)
 * @param {number} day - The day number of the challenge (1-25)
 * @returns {string} The contents of the input file as a string
 * @throws {Error} If the file cannot be found or read
 *
 * @example
 * // Get input for 2020 Day 1
 * const input = getInput(2020, 1);
 *
 * @remarks
 * - Input files must be located at challenges/{year}/{day}/input.txt relative to project root
 * - Input is read synchronously using fs.readFileSync
 * - Input is decoded as UTF-8 text
 * - Path is constructed using path.join for cross-platform compatibility
 */
export const getInput = (year: number, day: number): string => {
  const path = join(__dirname, '..', 'challenges', year.toString(), day.toString(), 'input.txt');
  return readFileSync(path, 'utf-8');
};
