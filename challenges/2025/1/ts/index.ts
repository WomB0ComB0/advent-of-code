/**
 * @file index.ts
 * @module aoc-manager
 * @description Main script for managing Advent of Code challenges.
 * Handles creating new challenge directories and running solutions in different languages.
 */

import { type Algorithm, measurePerformance } from '@/test/typescript/runtime';
import { getInput } from '@/utils/get-input';
import * as path from 'path';

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
    let current: number = 50;
    let zeroes: number = 0;
    for (const line of input.split('\n')) {
      const direction: string = line[0];
      const amount: number = Number(line.slice(1));
      if (direction === 'L') {
        current = ((current - amount) % 100 + 100) % 100;
      } else {
        current = (current + amount) % 100;
      }
      zeroes += (current === 0 ? 1 : 0);
    }
    return zeroes;
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
    let current: number = 50;
    let ans: number = 0;

    const memo = new Map<string, number>();

    const f = (p: number, t: number, dir: string): number => {
      if (t === 0) return 0;
      
      const key = `${p},${t},${dir}`;
      if (memo.has(key)) return memo.get(key)!;
      
      let result: number;
      if (p === 0) {
        result = Math.floor(Math.abs(t) / 100);
      } else if (dir === 'L') {
        const newP = ((Math.max(p - t, 0)) % 100 + 100) % 100;
        const newT = t - Math.min(p, t);
        result = (newP === 0 ? 1 : 0) + f(newP, newT, dir);
      } else {
        const newP = ((p + Math.min(100 - p, t)) % 100 + 100) % 100;
        const newT = t - Math.min(100 - p, t);
        result = (newP === 0 ? 1 : 0) + f(newP, newT, dir);
      }
      
      memo.set(key, result);
      return result;
    };

    for (const line of input.split('\n')) {
      const direction: string = line[0];
      const amount: number = Number(line.slice(1));
      
      ans += f(current, amount, direction);
      
      if (direction === 'L') {
        current = ((current - amount) % 100 + 100) % 100;
      } else {
        current = (current + amount) % 100;
      }
    }
    return ans;
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
