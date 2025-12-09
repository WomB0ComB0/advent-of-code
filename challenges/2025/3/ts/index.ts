/**
 * @file index.ts
 * @module aoc-manager
 * @description Main script for managing Advent of Code challenges.
 * Handles creating new challenge directories and running solutions in different languages.
 */

import { type Algorithm, measurePerformance } from '@/test/typescript/runtime';
import { getInput } from '@/utils/get-input';
import { quickSort } from "@/utils/typescript/dsa";
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
    const lines = input?.split('\n').filter(Boolean) ?? [];

    const largestTwoDigitNumber = (
      bank: string
    ): number => {
      let maxJoltage = 0;
      for (let i = 0; i < bank.length; i++) {
        for (let j = i + 1; j < bank.length; j++) {
          const joltageStr: string = bank[i] + bank[j];
          const currentJoltage: number = parseInt(joltageStr, 10);
          if (currentJoltage > maxJoltage) {
            maxJoltage = currentJoltage;
          }
        }
      }
      return maxJoltage;
    };

    let totalOutputJoltage: number = 0;
    lines.forEach((bank) => {
      totalOutputJoltage += largestTwoDigitNumber(bank);
    });
    return totalOutputJoltage;
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
    const lines = input?.split('\n').filter(Boolean) ?? [];
    const NUM_DIGITS_TO_SELECT = 12;

    const largestNumberFromBank = (
      bank: string
    ): bigint => {
      if (bank.length < NUM_DIGITS_TO_SELECT) {
        return BigInt(0);
      }

      const stack: string[] = [];
      let digitsToDrop = bank.length - NUM_DIGITS_TO_SELECT;

      for (const char of bank) {
        while (
          digitsToDrop > 0 &&
          stack.length > 0 &&
          stack[stack.length - 1] < char
        ) {
          stack.pop();
          digitsToDrop--;
        }
        stack.push(char);
      }

      while (stack.length > NUM_DIGITS_TO_SELECT) {
        stack.pop();
      }

      if (stack.length < NUM_DIGITS_TO_SELECT) {
        return BigInt(0);
      }

      return BigInt(stack.join(''));
    };

    let totalOutputJoltage: bigint = BigInt(0);
    lines.forEach((bank) => {
      totalOutputJoltage += largestNumberFromBank(bank);
    });
    return Number(totalOutputJoltage);
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
