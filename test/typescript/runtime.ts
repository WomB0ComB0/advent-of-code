import { perf } from '@jsheaven/perf';
import type { ComplexityDomain } from '@jsheaven/perf';

export interface Algorithm {
  name: string;
  fn: (size: number, callIndex: number, input?: string) => Promise<any> | any;
}

type PerformanceResult = {
  duration: number;
  estimatedDomains: ComplexityDomain[];
};

/**
 * Measures the performance characteristics of one or more algorithms
 * @param algorithms Single algorithm or array of algorithms to measure
 * @returns Object containing performance measurements for each algorithm
 */
export const measurePerformance = async (
  algorithms: Algorithm | Algorithm[],
): Promise<Record<string, PerformanceResult>> => {
  const algorithmArray = Array.isArray(algorithms) ? algorithms : [algorithms];

  try {
    const results = await perf(algorithmArray);
    return Object.entries(results).reduce(
      (acc, [name, data]) => ({
        ...acc,
        [name]: {
          duration: data.duration,
          estimatedDomains: data.estimatedDomains,
        },
      }),
      {} as Record<string, PerformanceResult>,
    );
  } catch (error) {
    console.error('Error measuring performance:', error);
    throw error;
  }
};

/**
 * Example usage:
 *
 * const bubbleSort: Algorithm = {
 *   name: 'BubbleSort',
 *   fn: (size) => {
 *     const arr = Array.from({ length: size }, () => Math.random())
 *     // ... sorting logic
 *   }
 * }
 *
 * const results = await measurePerformance(bubbleSort)
 * console.log(results.BubbleSort.duration)
 * console.log(results.BubbleSort.estimatedDomains)
 */
