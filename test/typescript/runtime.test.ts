import { describe, expect, test } from 'bun:test';
import { measurePerformance } from './runtime';

describe('measurePerformance', () => {
  test('should measure O(1) constant time algorithm', async () => {
    const constantAlgo = {
      name: 'ConstantTime',
      fn: (size: number) => {
        return size + 1
      }
    }
    
    const result = await measurePerformance(constantAlgo)
    
    expect(result.ConstantTime).toBeDefined()
    expect(result.ConstantTime.duration).toBeGreaterThan(0)
    expect(result.ConstantTime.estimatedDomains).toBeDefined()
  })

  test('should measure O(n) linear time algorithm', async () => {
    const linearAlgo = {
      name: 'LinearTime',
      fn: (size: number) => {
        let sum = 0
        for (let i = 0; i < size; i++) {
          sum += i
        }
        return sum
      }
    }
    
    const result = await measurePerformance(linearAlgo)
    
    expect(result.LinearTime).toBeDefined()
    expect(result.LinearTime.duration).toBeGreaterThan(0)
    expect(result.LinearTime.estimatedDomains).toBeDefined()
  })

  test('should measure async algorithm', async () => {
    const asyncAlgo = {
      name: 'AsyncOperation',
      fn: async (size: number) => {
        await new Promise(resolve => setTimeout(resolve, 1))
        return size
      }
    }
    
    const result = await measurePerformance(asyncAlgo)
    
    expect(result.AsyncOperation).toBeDefined()
    expect(result.AsyncOperation.duration).toBeGreaterThan(0)
    expect(result.AsyncOperation.estimatedDomains).toBeDefined()
  })

  test('should measure multiple algorithms', async () => {
    const algorithms = [
      {
        name: 'Algo1',
        fn: (size: number) => size * 2
      },
      {
        name: 'Algo2',
        fn: (size: number) => size * 3
      }
    ]
    
    const results = await measurePerformance(algorithms)
    
    expect(results.Algo1).toBeDefined()
    expect(results.Algo2).toBeDefined()
    expect(results.Algo1.duration).toBeGreaterThan(0)
    expect(results.Algo2.duration).toBeGreaterThan(0)
  })

  test('should handle errors in algorithms', async () => {
    const errorAlgo = {
      name: 'ErrorAlgo',
      fn: () => {
        throw new Error('Test error')
      }
    }
    
    await expect(measurePerformance(errorAlgo)).rejects.toThrow()
  })

  test('should measure O(n²) quadratic time algorithm', async () => {
    const quadraticAlgo = {
      name: 'QuadraticTime',
      fn: (size: number) => {
        let sum = 0
        for (let i = 0; i < size; i++) {
          for (let j = 0; j < size; j++) {
            sum += i * j
          }
        }
        return sum
      }
    }
    
    const result = await measurePerformance(quadraticAlgo)
    
    expect(result.QuadraticTime).toBeDefined()
    expect(result.QuadraticTime.duration).toBeGreaterThan(0)
    expect(result.QuadraticTime.estimatedDomains).toBeDefined()
  })

  test('should measure O(log n) logarithmic time algorithm', async () => {
    const logarithmicAlgo = {
      name: 'LogarithmicTime',
      fn: (size: number) => {
        let count = 0
        let n = size
        while (n > 1) {
          n = Math.floor(n / 2)
          count++
        }
        return count
      }
    }
    
    const result = await measurePerformance(logarithmicAlgo)
    
    expect(result.LogarithmicTime).toBeDefined()
    expect(result.LogarithmicTime.duration).toBeGreaterThan(0)
    expect(result.LogarithmicTime.estimatedDomains).toBeDefined()
  })
})