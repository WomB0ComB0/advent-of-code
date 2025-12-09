/**
 * @file index.ts
 * @module aoc-manager
 * @description Main script for managing Advent of Code challenges.
 * Handles creating new challenge directories and running solutions in different languages.
 */

import { type Algorithm, measurePerformance } from '@/test/typescript/runtime';
import { getInput } from '@/utils/get-input';
import * as path from 'node:path';

/**
 * Solves part 1 of the puzzle.
 * This object defines an Algorithm for solving the first part of the Advent of Code challenge.
 * The `fn` property contains the actual solution logic.
 */
const part1: Algorithm = {
  name: 'Part1',
  /**
   * The function implementing the solution for Part 1.
   * @param size - The input size for performance measurement (not directly used in solution logic here).
   * @param callIndex - The index of the current call for performance measurement (not directly used in solution logic here).
   * @param input - Raw puzzle input as a string.
   * @returns The solution for part 1 as a number.
   */
  fn: (size: number, callIndex: number, input?: string): number => {
    const grid: string[][] = [];
    for (const line of input?.split('\n') ?? []) {
      grid.push(line.split(''));
    }
    
    // Helper function to get neighboring '@' cells
    const nbhRolls = (y: number, x: number): [number, number][] => {
      const rolls: [number, number][] = [];
      for (let y2 = y - 1; y2 <= y + 1; y2++) {
        for (let x2 = x - 1; x2 <= x + 1; x2++) {
          if (
            (y !== y2 || x !== x2) &&
            y2 >= 0 && y2 < grid.length &&
            x2 >= 0 && x2 < grid[0].length &&
            grid[y2][x2] === '@'
          ) {
            rolls.push([y2, x2]);
          }
        }
      }
      return rolls;
    };
    
    let total = 0;
    for (let y = 0; y < grid.length; y++) {
      for (let x = 0; x < grid[0].length; x++) {
        if (grid[y][x] === '@') {
          total += nbhRolls(y, x).length < 4 ? 1 : 0;
        }
      }
    }
    return total;
  },
};

/**
 * Solves part 2 of the puzzle.
 * This object defines an Algorithm for solving the second part of the Advent of Code challenge.
 * The `fn` property contains the actual solution logic.
 */
const part2: Algorithm = {
  name: 'Part2',
  /**
   * The function implementing the solution for Part 2.
   * @param size - The input size for performance measurement (not directly used in solution logic here).
   * @param callIndex - The index of the current call for performance measurement (not directly used in solution logic here).
   * @param input - Raw puzzle input as a string.
   * @returns The solution for part 2 as a number.
   */
  fn: (size: number, callIndex: number, input?: string): number => {
    const grid: string[][] = [];
    for (const line of input?.split('\n') ?? []) {
      grid.push(line.split(''));
    }
    
    // Helper function to get neighboring '@' cells
    const nbhRolls = (y: number, x: number): [number, number][] => {
      const rolls: [number, number][] = [];
      for (let y2 = y - 1; y2 <= y + 1; y2++) {
        for (let x2 = x - 1; x2 <= x + 1; x2++) {
          if (
            (y !== y2 || x !== x2) &&
            y2 >= 0 && y2 < grid.length &&
            x2 >= 0 && x2 < grid[0].length &&
            grid[y2][x2] === '@'
          ) {
            rolls.push([y2, x2]);
          }
        }
      }
      return rolls;
    };
    
    let total = 0;
    const todo: [number, number][] = [];
    
    // Find all initial '@' positions
    for (let y = 0; y < grid.length; y++) {
      for (let x = 0; x < grid[0].length; x++) {
        if (grid[y][x] === '@') {
          todo.push([y, x]);
        }
      }
    }
    
    // Process cells iteratively
    while (todo.length > 0) {
      const [y, x] = todo.pop()!;
      if (grid[y][x] === '.') {
        continue;
      }
      const nbh = nbhRolls(y, x);
      if (nbh.length < 4) {
        grid[y][x] = '.';
        todo.push(...nbh);
        total += 1;
      }
    }
    
    return total;
  },
};

/**
 * Parses the raw input string into a usable format.
 * This specific parser splits the input by whitespace and converts each segment to a number.
 * @param input - The raw puzzle input string.
 * @returns An array of numbers parsed from the input.
 */
function parse(input: string) {
  return input.split(/\s+/).map(Number);
}

/**
 * Main execution function that:
 * 1. Fetches input for the puzzle using year and day.
 * 2. Solves both parts of the puzzle with performance measurement.
 * 3. Outputs solutions and performance metrics to console.
 * @throws Will throw if input fetching fails or other critical errors occur.
 */
const main = async () => {
  try {
    // Constructs the path to the input file, assuming it's in the parent directory of the current script.
    const inputPath = path.join(__dirname, '..', 'input.txt');
    const input = await getInput(inputPath);

    // Run part1 and part2 algorithms with the input
    const result1 = part1.fn(0, 0, input);
    const result2 = part2.fn(0, 0, input);

    // Output the results
    console.log(`Result for Part 1: ${result1}`);
    console.log(`Result for Part 2: ${result2}`);

    // Measure performance of both parts
    const performanceResults = await measurePerformance([
      {
        ...part1,
        // Wrap the original function to pass the input correctly during performance measurement.
        fn: (size: number, callIndex: number) => part1.fn(size, callIndex, input),
      },
      {
        ...part2,
        // Wrap the original function to pass the input correctly during performance measurement.
        fn: (size: number, callIndex: number) => part2.fn(size, callIndex, input),
      },
    ]);

    // Output solutions and performance metrics
    console.log(`Solution 1: ${performanceResults['Part1'].duration} ms`);
    console.log(`Solution 2: ${performanceResults['Part2'].duration} ms`);

    // Optional: Log complexity domains if estimated by the performance measurement tool
    console.log('Part 1 Complexity Domains:', performanceResults['Part1'].estimatedDomains);
    console.log('Part 2 Complexity Domains:', performanceResults['Part2'].estimatedDomains);
  } catch (error) {
    console.error('Error in main execution:', error);
    process.exit(1);
  }
};

/**
 * Entry point for the script.
 * This block ensures that the `main` function is called only when the script is executed directly
 * (not when imported as a module). It also catches and logs any unhandled errors from `main`.
 */
if (require.main === module) {
  main().catch(console.error);
}
