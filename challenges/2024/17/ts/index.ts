/**
 * @file index.ts
 * @module aoc-manager
 * @description Main script for managing Advent of Code challenges.
 * Handles creating new challenge directories and running solutions in different languages.
 */

import { type Algorithm, measurePerformance } from '@/test/typescript/runtime';
import { getInput } from '@/utils/get-input';
import { transpose } from '@/utils/typescript';
import { DefaultMap } from '@/utils/typescript';
import { sum } from '@/utils/typescript';

/**
 * Extracts the year from the current working directory path
 * Assumes directory structure includes year as second-to-last segment
 */

/**
 * Solves part 1 of the puzzle
 * @param input - Raw puzzle input as string
 * @returns Solution for part 1 as a number
 */
const part1: Algorithm = {
  name: 'Part1',
  fn: (size: number, callIndex: number, input?: string): number => {
    // TODO: implement part 1 solution here
    return 0;
  },
};

/**
 * Solves part 2 of the puzzle
 * @param input - Raw puzzle input as string
 * @returns Solution for part 2 as a number
 */
const part2: Algorithm = {
  name: 'Part2',
  fn: (size: number, callIndex: number, input?: string): number => {
    // TODO: implement part 2 solution here
    return 0;
  },
};

function parse(input: string) {
  return input.split(/\s+/).map(Number);
}

/**
 * Main execution function that:
 * 1. Fetches input for the puzzle using year and day
 * 2. Solves both parts of the puzzle with performance measurement
 * 3. Outputs solutions and performance metrics to console
 * @throws Will throw if input fetching fails
 */
const main = async () => {
  try {
    const d = `${__dirname.split('\\').slice(0, -1).join('\\')}\\input.txt`;
    const input = await getInput(d);

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
        fn: (size: number, callIndex: number) => part1.fn(size, callIndex, input),
      },
      {
        ...part2,
        fn: (size: number, callIndex: number) => part2.fn(size, callIndex, input),
      },
    ]);

    // Output solutions and performance metrics
    console.log(`Solution 1: ${performanceResults['Part1'].duration} ms`);
    console.log(`Solution 2: ${performanceResults['Part2'].duration} ms`);

    // Optional: Log complexity domains
    console.log('Part 1 Complexity Domains:', performanceResults['Part1'].estimatedDomains);
    console.log('Part 2 Complexity Domains:', performanceResults['Part2'].estimatedDomains);
  } catch (error) {
    console.error('Error in main execution:', error);
    process.exit(1);
  }
};

/**
 * Entry point - only runs main if this is the directly executed module
 * Catches and logs any errors that occur during execution
 */
if (require.main === module) {
  main().catch(console.error);
}
