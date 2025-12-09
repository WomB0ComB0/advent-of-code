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
 * Disjoint Set Union (Union-Find) data structure.
 */
class DSU {
  private parent: number[];
  private size: number[];

  constructor(n: number) {
    this.parent = Array.from({ length: n }, (_, i) => i);
    this.size = Array(n).fill(1);
  }

  unite(u: number, v: number): void {
    u = this.find(u);
    v = this.find(v);
    if (u === v) return;
    
    if (this.size[u] < this.size[v]) {
      [u, v] = [v, u];
    }
    this.parent[v] = u;
    this.size[u] += this.size[v];
  }

  find(u: number): number {
    while (u !== this.parent[u]) {
      this.parent[u] = this.parent[this.parent[u]];
      u = this.parent[u];
    }
    return u;
  }

  sizes(): number[] {
    const sizes: number[] = [];
    for (let u = 0; u < this.parent.length; u++) {
      if (u === this.find(u)) {
        sizes.push(this.size[u]);
      }
    }
    return sizes;
  }

  isFullyConnected(): boolean {
    return this.size[this.find(0)] === this.size.length;
  }
}

/**
 * Solves part 1 of the puzzle.
 * This object defines an Algorithm for solving the first part of the Advent of Code challenge.
 * The `fn` property contains the actual solution logic.
 */
const part1: Algorithm = {
  name: 'Part1',
  /**
   * The function implementing the solution for Part 1.
   * Uses DSU to connect k shortest edges and find product of 3 largest components.
   * @param size - The input size for performance measurement (not directly used in solution logic here).
   * @param callIndex - The index of the current call for performance measurement (not directly used in solution logic here).
   * @param input - Raw puzzle input as a string.
   * @returns The solution for part 1 as a number.
   */
  fn: (size: number, callIndex: number, input?: string): number => {
    const lines = input?.trim().split('\n').map(l => l.trim()).filter(l => l) ?? [];
    const coords = lines.map(line => line.split(',').map(Number));
    
    const k = 1000;
    const dsu = new DSU(coords.length);
    
    const edges: [number, number, number][] = [];
    for (let u = 0; u < coords.length; u++) {
      for (let v = u + 1; v < coords.length; v++) {
        const dx = coords[u][0] - coords[v][0];
        const dy = coords[u][1] - coords[v][1];
        const dz = coords[u][2] - coords[v][2];
        const dist = Math.sqrt(dx * dx + dy * dy + dz * dz);
        edges.push([dist, u, v]);
      }
    }
    
    edges.sort((a, b) => a[0] - b[0]);
    
    for (let i = 0; i < Math.min(k, edges.length); i++) {
      const [, u, v] = edges[i];
      dsu.unite(u, v);
    }
    
    const sizes = dsu.sizes().sort((a, b) => b - a);
    return sizes[0] * sizes[1] * sizes[2];
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
   * Connects points until fully connected and returns product of x-coordinates.
   * @param size - The input size for performance measurement (not directly used in solution logic here).
   * @param callIndex - The index of the current call for performance measurement (not directly used in solution logic here).
   * @param input - Raw puzzle input as a string.
   * @returns The solution for part 2 as a number.
   */
  fn: (size: number, callIndex: number, input?: string): number => {
    const lines = input?.trim().split('\n').map(l => l.trim()).filter(l => l) ?? [];
    const coords = lines.map(line => line.split(',').map(Number));
    
    const dsu = new DSU(coords.length);
    
    const edges: [number, number, number][] = [];
    for (let u = 0; u < coords.length; u++) {
      for (let v = u + 1; v < coords.length; v++) {
        const dx = coords[u][0] - coords[v][0];
        const dy = coords[u][1] - coords[v][1];
        const dz = coords[u][2] - coords[v][2];
        const dist = Math.sqrt(dx * dx + dy * dy + dz * dz);
        edges.push([dist, u, v]);
      }
    }
    
    edges.sort((a, b) => a[0] - b[0]);
    
    for (const [, u, v] of edges) {
      dsu.unite(u, v);
      if (dsu.isFullyConnected()) {
        return coords[u][0] * coords[v][0];
      }
    }
    
    return 0;
  },
};

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
