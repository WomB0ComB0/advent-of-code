/**
 * @file index.ts
 * @module aoc-manager
 * @description Main script for managing Advent of Code challenges.
 * Handles creating new challenge directories and running solutions in different languages.
 */

import { type Algorithm, measurePerformance } from '@/test/typescript/runtime';
import { getInput } from '@/utils/get-input';
import * as path from 'node:path';

type Point = [number, number];

function getArea(p1: Point, p2: Point): number {
  const [x1, y1] = p1;
  const [x2, y2] = p2;
  return (Math.abs(x1 - x2) + 1) * (Math.abs(y1 - y2) + 1);
}

function* combinations(n: number, r: number): Generator<number[]> {
  const indices = Array.from({ length: r }, (_, i) => i);
  yield [...indices];
  
  while (true) {
    let i = r - 1;
    while (i >= 0 && indices[i] === i + n - r) {
      i--;
    }
    if (i < 0) return;
    indices[i]++;
    for (let j = i + 1; j < r; j++) {
      indices[j] = indices[j - 1] + 1;
    }
    yield [...indices];
  }
}

/**
 * Solves part 1 of the puzzle.
 */
const part1: Algorithm = {
  name: 'Part1',
  fn: (size: number, callIndex: number, input?: string): number => {
    const lines = input?.trim().split('\n') ?? [];
    const data: Point[] = lines.map(line => {
      const [x, y] = line.split(',').map(Number);
      return [x, y];
    });
    
    const n = data.length;
    let maxArea = 0;
    
    for (const [i, j] of combinations(n,  2)) {
      const area = getArea(data[i], data[j]);
      maxArea = Math.max(maxArea, area);
    }
    
    return maxArea;
  },
};

/**
 * Solves part 2 of the puzzle.
 */
const part2: Algorithm = {
  name: 'Part2',
  fn: (size: number, callIndex: number, input?: string): number => {
    const lines = input?.trim().split('\n') ?? [];
    const data: Point[] = lines.map(line => {
      const [x, y] = line.split(',').map(Number);
      return [x, y];
    });
    
    const n = data.length;
    const hori: [number, number, number, number][] = [];
    const vert: [number, number, number, number][] = [];
    
    for (let i = 0; i < n; i++) {
      const [x, y] = data[i];
      const [x2, y2] = data[(i + 1) % n];
      const x_min = Math.min(x, x2);
      const x_max = Math.max(x, x2);
      const y_min = Math.min(y, y2);
      const y_max = Math.max(y, y2);
      
      if (x_min === x_max) {
        vert.push([x_min, x_max, y_min, y_max]);
      } else {
        hori.push([x_min, x_max, y_min, y_max]);
      }
    }
    
    function inside(x1: number, y1: number, x2: number, y2: number): boolean {
      for (const [a, b, y] of hori) {
        if ((a < x1 && x1 < b || a < x2 && x2 < b) && y1 < y && y < y2) {
          return false;
        }
        if ((x1 === a || x2 === b) && y1 < y && y < y2) {
          return false;
        }
      }
      
      for (const [x, _, c, d] of vert) {
        if ((c < y1 && y1 < d || c < y2 && y2 < d) && x1 < x && x < x2) {
          return false;
        }
        if ((y1 === c || y2 === d) && x1 < x && x < x2) {
          return false;
        }
      }
      return true;
    }
    
    let ans = 0;
    for (let i = 0; i < n; i++) {
      for (let j = i + 1; j < n; j++) {
        const p1 = data[i];
        const p2 = data[j];
        const x1 = Math.min(p1[0], p2[0]);
        const x2 = Math.max(p1[0], p2[0]);
        const y1 = Math.min(p1[1], p2[1]);
        const y2 = Math.max(p1[1], p2[1]);
        
        if (!inside(x1, y1, x2, y2)) {
          continue;
        }
        
        ans = Math.max(ans, getArea(p1, p2));
      }
    }
    
    return ans;
  },
};

/**
 * Main execution function.
 */
const main = async () => {
  try {
    const inputPath = path.join(__dirname, '..', 'input.txt');
    const input = await getInput(inputPath);

    const result1 = part1.fn(0, 0, input);
    const result2 = part2.fn(0, 0, input);

    console.log(`Result for Part 1: ${result1}`);
    console.log(`Result for Part 2: ${result2}`);

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

    console.log(`Solution 1: ${performanceResults['Part1'].duration} ms`);
    console.log(`Solution 2: ${performanceResults['Part2'].duration} ms`);
    console.log('Part 1 Complexity Domains:', performanceResults['Part1'].estimatedDomains);
    console.log('Part 2 Complexity Domains:', performanceResults['Part2'].estimatedDomains);
  } catch (error) {
    console.error('Error in main execution:', error);
    process.exit(1);
  }
};

if (require.main === module) {
  main().catch(console.error);
}
