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
   * Transposes lines into columns and applies operations based on the last character.
   * @param size - The input size for performance measurement (not directly used in solution logic here).
   * @param callIndex - The index of the current call for performance measurement (not directly used in solution logic here).
   * @param input - Raw puzzle input as a string.
   * @returns The solution for part 1 as a number.
   */
  fn: (size: number, callIndex: number, input?: string): number => {
    const lines = input?.trim().split('\n').map(line => line.trimEnd()) ?? [];
    
    // Split each line into individual tokens/numbers
    const splitLines = lines.map(line => line.split(/\s+/));
    
    // Transpose to get columns
    const maxCols = Math.max(...splitLines.map(row => row.length));
    const columns: string[][] = [];
    
    for (let col = 0; col < maxCols; col++) {
      const column: string[] = [];
      for (let row = 0; row < splitLines.length; row++) {
        if (col < splitLines[row].length) {
          column.push(splitLines[row][col]);
        }
      }
      columns.push(column);
    }
    
    // For each column, the last character determines the operation
    let total = 0;
    for (const col of columns) {
      if (col.length === 0) continue;
      
      const lastChar = col[col.length - 1];
      const isMultiply = lastChar === '*';
      const numbers = col.slice(0, -1).map(Number);
      
      if (numbers.length > 0) {
        total += numbers.reduce((acc, n) => isMultiply ? acc * n : acc + n);
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
   * Parses multi-digit numbers from columns and applies operations.
   * @param size - The input size for performance measurement (not directly used in solution logic here).
   * @param callIndex - The index of the current call for performance measurement (not directly used in solution logic here).
   * @param input - Raw puzzle input as a string.
   * @returns The solution for part 2 as a number.
   */
  fn: (size: number, callIndex: number, input?: string): number => {
    const lines = input?.trim().split('\n').map(line => line.trimEnd()) ?? [];
    
    const process = (left: number, right: number): number => {
      const op = lines[lines.length - 1][left] === '*' ? 
        ((a: number, b: number) => a * b) : 
        ((a: number, b: number) => a + b);
      
      const nums: number[] = [];
      for (let x = left; x <= right; x++) {
        let num = 0;
        for (let y = 0; y < lines.length - 1; y++) {
          if (x < lines[y].length) {
            const char = lines[y][x];
            if (char !== ' ') {
              num = num * 10 + parseInt(char, 10);
            }
          }
        }
        nums.push(num);
      }
      
      return nums.reduce(op);
    };
    
    const n = Math.max(...lines.map(line => line.length));
    let total = 0;
    let left = 0;
    
    for (let right = 1; right < n; right++) {
      if (right < lines[lines.length - 1].length && lines[lines.length - 1][right] !== ' ') {
        total += process(left, right - 2);
        left = right;
      }
    }
    
    return total + process(left, n - 1);
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
