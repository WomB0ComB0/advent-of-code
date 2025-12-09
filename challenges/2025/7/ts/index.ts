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
   * Tracks active positions and counts encounters with '^'.
   * @param size - The input size for performance measurement (not directly used in solution logic here).
   * @param callIndex - The index of the current call for performance measurement (not directly used in solution logic here).
   * @param input - Raw puzzle input as a string.
   * @returns The solution for part 1 as a number.
   */
  fn: (size: number, callIndex: number, input?: string): number => {
    const grid = input?.trim().split('\n').map(line => line.trimEnd()) ?? [];
    
    let total = 0;
    const active: boolean[] = new Array(grid[0].length).fill(false);
    active[grid[0].indexOf('S')] = true;
    
    for (let y = 1; y < grid.length; y++) {
      for (let x = 0; x < grid[y].length; x++) {
        if (grid[y][x] === '^' && active[x]) {
          total++;
          active[x - 1] = true;
          active[x + 1] = true;
          active[x] = false;
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
   * Builds a DAG and uses memoized DP to count all paths.
   * @param size - The input size for performance measurement (not directly used in solution logic here).
   * @param callIndex - The index of the current call for performance measurement (not directly used in solution logic here).
   * @param input - Raw puzzle input as a string.
   * @returns The solution for part 2 as a number.
   */
  fn: (size: number, callIndex: number, input?: string): number => {
    const grid = input?.trim().split('\n').map(line => line.trimEnd()) ?? [];
    
    const edges: Map<number, number[]> = new Map();
    const active: number[][] = Array.from({ length: grid[0].length }, () => []);
    active[grid[0].indexOf('S')].push(1);
    let v = 2;
    
    for (let y = 1; y < grid.length; y++) {
      for (let x = 0; x < grid[y].length; x++) {
        if (grid[y][x] === '^' && active[x].length > 0) {
          for (const u of active[x]) {
            if (!edges.has(u)) edges.set(u, []);
            edges.get(u)!.push(v);
          }
          active[x] = [];
          if (x - 1 >= 0) active[x - 1].push(v);
          if (x + 1 < grid[0].length) active[x + 1].push(v);
          v++;
        }
      }
    }
    
    for (let x = 0; x < active.length; x++) {
      for (const u of active[x]) {
        if (!edges.has(u)) edges.set(u, []);
        edges.get(u)!.push(0);
      }
    }
    
    const memo = new Map<number, number>();
    const dp = (u: number): number => {
      if (u === 0) return 1;
      if (memo.has(u)) return memo.get(u)!;
      
      const neighbors = edges.get(u) ?? [];
      const result = neighbors.reduce((sum, neighbor) => sum + dp(neighbor), 0);
      memo.set(u, result);
      return result;
    };
    
    return dp(1);
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
