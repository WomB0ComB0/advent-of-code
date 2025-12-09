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
   * Counts how many IDs fall within at least one range.
   * @param size - The input size for performance measurement (not directly used in solution logic here).
   * @param callIndex - The index of the current call for performance measurement (not directly used in solution logic here).
   * @param input - Raw puzzle input as a string.
   * @returns The solution for part 1 as a number.
   */
  fn: (size: number, callIndex: number, input?: string): number => {
    const lines = input?.trim().split('\n').map(line => line.trim()) ?? [];
    
    // Parse ranges and IDs
    const ranges: [number, number][] = [];
    const ids = new Set<number>();
    
    for (const line of lines) {
      if (line.includes('-')) {
        const [start, end] = line.split('-').map(Number);
        ranges.push([start, end]);
      } else if (line !== '') {
        ids.add(Number(line));
      }
    }
    
    // Build deltas map
    const deltas = new Map<number, number>();
    for (const [start, end] of ranges) {
      deltas.set(start, (deltas.get(start) || 0) + 1);
      deltas.set(end + 1, (deltas.get(end + 1) || 0) - 1);
    }
    for (const id of ids) {
      if (!deltas.has(id)) {
        deltas.set(id, 0);
      }
    }
    
    // Sort keys and sweep
    const sortedKeys = Array.from(deltas.keys()).sort((a, b) => a - b);
    let fresh = 0;
    let cur = 0;
    
    for (const id of sortedKeys) {
      cur += deltas.get(id) || 0;
      if (ids.has(id) && cur > 0) {
        fresh++;
      }
    }
    
    return fresh;
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
   * Counts the total length of all ranges.
   * @param size - The input size for performance measurement (not directly used in solution logic here).
   * @param callIndex - The index of the current call for performance measurement (not directly used in solution logic here).
   * @param input - Raw puzzle input as a string.
   * @returns The solution for part 2 as a number.
   */
  fn: (size: number, callIndex: number, input?: string): number => {
    const lines = input?.trim().split('\n').map(line => line.trim()) ?? [];
    
    // Parse ranges and IDs
    const ranges: [number, number][] = [];
    const ids = new Set<number>();
    
    for (const line of lines) {
      if (line.includes('-')) {
        const [start, end] = line.split('-').map(Number);
        ranges.push([start, end]);
      } else if (line !== '') {
        ids.add(Number(line));
      }
    }
    
    // Build deltas map
    const deltas = new Map<number, number>();
    for (const [start, end] of ranges) {
      deltas.set(start, (deltas.get(start) || 0) + 1);
      deltas.set(end + 1, (deltas.get(end + 1) || 0) - 1);
    }
    for (const id of ids) {
      if (!deltas.has(id)) {
        deltas.set(id, 0);
      }
    }
    
    // Sort keys and sweep
    const sortedKeys = Array.from(deltas.keys()).sort((a, b) => a - b);
    let total = 0;
    let cur = 0;
    let start = 0;
    
    for (const id of sortedKeys) {
      const last = cur;
      cur += deltas.get(id) || 0;
      
      if (last === 0 && cur > 0) {
        start = id;
      } else if (last > 0 && cur === 0) {
        total += id - start;
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
