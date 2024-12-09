/**
 * @author Robin Malfait <malfait.robin@gmail.com>
 * @see https://github.com/RobinMalfait/advent-of-code/blob/main/src/aoc-utils/src/index.ts
 */

// Class
export class DefaultMap<K = string, V = unknown> extends Map<K, V> {
  constructor(private factory: (key: K) => V) {
    super();
  }

  get(key: K): V {
    let value = super.get(key);

    if (value === undefined) {
      value = this.factory(key);
      this.set(key, value);
    }

    return value;
  }
}

// Math
export function lcm(x: number, y: number) {
  return x === 0 || y === 0 ? 0 : Math.abs((x * y) / gcd(x, y));
}

export function gcd(x: number, y: number) {
  while (y !== 0) {
    const tmp = y;
    y = x % y;
    x = tmp;
  }
  return x;
}

export function degrees(radians: number) {
  return radians * (180 / Math.PI);
}

export function radians(degrees: number) {
  return degrees * (Math.PI / 180);
}

const chooses = new DefaultMap((n: number) => {
  return new DefaultMap((k: number) => {
    if (k > n) return 0;
    return factorial(n) / (factorial(k) * factorial(n - k));
  });
});

export function choose(n: number, k: number) {
  return chooses.get(n).get(k);
}

const factorials = new DefaultMap<number, number>((n: number) => {
  if (n === 0) return 1;
  if (n === 1) return 1;
  return n * factorials.get(n - 1);
});

export function factorial(n: number): number {
  return factorials.get(n);
}

export function sum(numbers: number[]) {
  if (numbers.length <= 0) return 0;
  if (numbers.length === 1) return numbers[0];

  let total = 0;
  for (const number of numbers) total += number;
  return total;
}

export function product(numbers: number[]) {
  if (numbers.length <= 0) return 0;
  if (numbers.length === 1) return numbers[0];

  let total = 1;
  for (const number of numbers) total *= number;
  return total;
}

// Array / collection
export function* windows<T>(input: Iterable<T>, size: number): Generator<T[]> {
  // Array optimization
  if (Array.isArray(input)) {
    for (let i = 0; i < input.length - size + 1; i++) {
      yield input.slice(i, i + size);
    }

    return;
  }

  // Iterator implementation
  let window: T[] = [];

  for (const x of input) {
    window.push(x);

    if (window.length === size) {
      yield window;
      window = window.slice(1);
    }
  }
}

export function zip<T>(...input: T[][]) {
  return input[0].map((_, i) => input.map((array) => array[i]));
}

export function transpose<T>(input: T[][]) {
  return input[0].map((_, i) => input.map((array) => array[i]));
}

export function chunk<T>(input: T[], size: number): T[][] {
  const output: T[][] = [];
  for (let i = 0; i < input.length; i += size) {
    output.push(input.slice(i, i + size));
  }
  return output;
}

export function* pairs<T>(input: T[]) {
  for (let a = 0; a < input.length; ++a) {
    for (let b = a + 1; b < input.length; ++b) {
      yield [input[a], input[b]] as const;
    }
  }
}

export function* range(start: number, end: number, step = 1) {
  for (let i = start; i < end; i += step) {
    yield i;
  }
}

// Set
export function intersection<T>(a: T[], b: T[]) {
  return new Set(a.filter((x) => b.includes(x)));
}

// Flow control
export function match<T extends string | number = string, R = unknown>(
  value: T,
  lookup: Record<T, R | ((...args: unknown[]) => R)>,
  ...args: unknown[]
): R {
  if (value in lookup) {
    const returnValue = lookup[value];
    if (typeof returnValue === 'function') {
      return returnValue(...args);
    }
    return returnValue as R;
  }

  const error = new Error(
    `Tried to handle "${value}" but there is no handler defined. Only defined handlers are: ${Object.keys(
      lookup,
    )
      .map((key) => `"${key}"`)
      .join(', ')}.`,
  );
  if (Error.captureStackTrace) Error.captureStackTrace(error, match);
  throw error;
}

// `throw` is not an expression, so you can't use it like:
// foo || throw new Error('...')
//
// But you can use this instead:
// foo || bail('...')
export function bail(message: string): never {
  const error = new Error(message);
  if (Error.captureStackTrace) Error.captureStackTrace(error, bail);
  throw error;
}

const EMPTY = Symbol('EMPTY');
function defaultCacheKey(...args: unknown[]): any {
  if (args.length === 0) {
    return EMPTY;
  }

  if (args.length === 1) {
    const arg = args[0];

    if (
      typeof arg === 'string' ||
      typeof arg === 'number' ||
      typeof arg === 'boolean' ||
      typeof arg === 'symbol' ||
      arg === null ||
      arg === undefined
    ) {
      return arg;
    }

    if (Array.isArray(arg)) {
      return arg.map((x) => defaultCacheKey(x)).join(',');
    }

    if (typeof arg === 'object') {
      return JSON.stringify(arg);
    }
  }

  return JSON.stringify(args);
}

// Performance
export function memoize<T extends (...args: unknown[]) => R, R>(
  fn: T,
  cacheKey: (...args: Parameters<T>) => string = defaultCacheKey,
): T {
  const cache = new Map<string, R>();

  return ((...args: Parameters<T>) => {
    const key = cacheKey(...args);

    if (cache.has(key)) {
      return cache.get(key);
    }

    const result = fn(...args);
    cache.set(key, result);

    return result;
  }) as T;
}

export class Range {
  constructor(
    /** Inclusive */
    public readonly start: number,
    /** Exclusive */
    public readonly end: number,
  ) {}

  get size() {
    return this.end - this.start + 1;
  }

  split(value: number) {
    return [new Range(this.start, value - 1), new Range(value, this.end)];
  }

  toString() {
    return `Range(${this.start}, ${this.end})`;
  }
}

export class Point {
  private static points = new DefaultMap<number, DefaultMap<number, Point>>(
    (x) => new DefaultMap((y) => new Point(x, y)),
  );

  private constructor(
    public readonly x: number = 0,
    public readonly y: number = 0,
  ) {}

  static new(x: number, y: number) {
    return Point.points.get(x).get(y);
  }

  static fromString(input: string) {
    const [x, y] = input.split(',').map(Number);
    return Point.points.get(x).get(y);
  }

  add(other: Point) {
    return Point.new(this.x + other.x, this.y + other.y);
  }

  up(amount = 1) {
    return Point.new(this.x, this.y - amount);
  }

  down(amount = 1) {
    return Point.new(this.x, this.y + amount);
  }

  left(amount = 1) {
    return Point.new(this.x - amount, this.y);
  }

  right(amount = 1) {
    return Point.new(this.x + amount, this.y);
  }

  ne() {
    return this.add(Point.new(1, -1));
  }

  nw() {
    return this.add(Point.new(-1, -1));
  }

  se() {
    return this.add(Point.new(1, 1));
  }

  sw() {
    return this.add(Point.new(-1, 1));
  }

  navigate(direction: Direction, amount = 1) {
    if (direction === Direction.North) return this.up(amount);
    if (direction === Direction.East) return this.right(amount);
    if (direction === Direction.South) return this.down(amount);
    if (direction === Direction.West) return this.left(amount);
    direction satisfies never;
  }

  direction(other: Point) {
    if (this.x === other.x) {
      if (this.y < other.y) return Direction.South;
      if (this.y > other.y) return Direction.North;
    }

    if (this.y === other.y) {
      if (this.x < other.x) return Direction.East;
      if (this.x > other.x) return Direction.West;
    }

    return null;
  }

  neighbours() {
    return [this.up(), this.right(), this.down(), this.left()];
  }

  manhattanDistanceTo(other: Point) {
    return Math.abs(this.x - other.x) + Math.abs(this.y - other.y);
  }

  tuple() {
    return [this.x, this.y] as const;
  }

  toString() {
    return `Point(${this.x}, ${this.y})`;
  }
}

export function parseIntoGrid<T = string>(
  input: string,
  value: (x: string, p: Point) => T = (x) => x as T,
) {
  const grid = new Map<Point, T>();

  for (const [y, line] of input.trim().split('\n').entries()) {
    for (const [x, cell] of line.trim().split('').entries()) {
      const p = Point.new(x, y);
      grid.set(p, value(cell, p));
    }
  }

  return grid;
}

export function pointsToGrid(it: Iterable<Point>) {
  let minX = Number.POSITIVE_INFINITY;
  let minY = Number.POSITIVE_INFINITY;
  let maxX = Number.NEGATIVE_INFINITY;
  let maxY = Number.NEGATIVE_INFINITY;

  for (const point of it) {
    minX = Math.min(minX, point.x);
    minY = Math.min(minY, point.y);
    maxX = Math.max(maxX, point.x);
    maxY = Math.max(maxY, point.y);
  }

  const width = maxX - minX + 1;
  const height = maxY - minY + 1;

  const grid: boolean[][] = new Array(height).fill(0).map(() => new Array(width).fill(false));

  for (const point of it) {
    grid[point.y - minY][point.x - minX] = true;
  }

  return grid;
}

export function pointsToSize<T>(it: Set<Point> | Map<Point, T>) {
  let minX = Number.POSITIVE_INFINITY;
  let minY = Number.POSITIVE_INFINITY;
  let maxX = Number.NEGATIVE_INFINITY;
  let maxY = Number.NEGATIVE_INFINITY;

  for (const point of it.keys()) {
    minX = Math.min(minX, point.x);
    minY = Math.min(minY, point.y);
    maxX = Math.max(maxX, point.x);
    maxY = Math.max(maxY, point.y);
  }

  const width = maxX - minX + 1;
  const height = maxY - minY + 1;

  return { width, height };
}

export function rotateGrid<T>(grid: T[][], direction: -90 | 90) {
  if (direction === 90) return transpose(grid).reverse();
  if (direction === -90) return transpose(grid).map((row) => row.reverse());
  direction satisfies never;
}

export function transposePointMap<T>(input: Map<Point, T>) {
  const transposed = new Map<Point, T>();
  for (const [point, value] of input.entries()) {
    transposed.set(Point.new(point.y, point.x), value);
  }
  return transposed;
}

export function transposePointSet(input: Set<Point>) {
  const transposed = new Set<Point>();
  for (const point of input) {
    transposed.add(Point.new(point.y, point.x));
  }
  return transposed;
}

// Polygon area using the Shoelace formula + Pick's theorem
// - https://en.wikipedia.org/wiki/Shoelace_formula
// - https://en.wikipedia.org/wiki/Pick%27s_theorem
export function polygonArea(vertices: Point[]) {
  let area = 0;
  let perimeter = 0;
  let previous = vertices[vertices.length - 1];

  for (const vertex of vertices) {
    area += previous.x * vertex.y - vertex.x * previous.y;
    perimeter += Math.abs(vertex.x - previous.x) + Math.abs(vertex.y - previous.y);
    previous = vertex;
  }

  return (Math.abs(area) + perimeter) / 2 + 1;
}

export function visualizePointMap<T>(
  map: Map<Point, T>,
  valueFn: (value: T, point: Point) => string = (x) => x?.toString() ?? ' ',
) {
  const { width, height } = pointsToSize(map);
  const grid: string[][] = [];

  for (let y = 0; y < height; y++) {
    const row = [];
    for (let x = 0; x < width; x++) {
      const p = Point.new(x, y);
      const value = map.get(p) ?? null;
      row.push(valueFn(value, p));
    }
    grid.push(row);
  }

  return grid.map((row) => row.join('')).join('\n');
}

export enum Direction {
  /** `↑` */
  North = 1 << 0,

  /** `→` */
  East = 1 << 1,

  /** `↓` */
  South = 1 << 2,

  /** `←` */
  West = 1 << 3,
}

export function directionToChar(direction: Direction) {
  if (direction === Direction.North) return '↑';
  if (direction === Direction.East) return '→';
  if (direction === Direction.South) return '↓';
  if (direction === Direction.West) return '←';
  direction satisfies never;
}

export function isOppositeDirection(a: Direction, b: Direction) {
  if (a === Direction.North && b === Direction.South) return true;
  if (a === Direction.South && b === Direction.North) return true;
  if (a === Direction.East && b === Direction.West) return true;
  if (a === Direction.West && b === Direction.East) return true;
  return false;
}

// Algorithms
export function astar<T>({
  start,
  successors,
  heuristic = () => 0,
  success,
  value = () => 1,
}: {
  start: T;
  successors: (node: T) => Iterable<T>;
  heuristic?: (node: T) => number;
  success: (node: T) => boolean;
  value?: (node: T, previous: T) => number;
}): [path: T[], cost: number] | null {
  const path = [];
  const parent = new Map();

  const g = new DefaultMap<T, number>(() => Number.POSITIVE_INFINITY);
  g.set(start, 0);

  const f = new DefaultMap<T, number>(() => Number.POSITIVE_INFINITY);
  f.set(start, g.get(start) + heuristic(start));

  const open = new BinaryHeap((node) => f.get(node), [start]);

  while (open.size() > 0) {
    const current = open.pop();

    if (success(current)) {
      let node = current;
      while (node !== start) {
        path.unshift(node);
        node = parent.get(node);
      }
      path.unshift(start);
      return [path, f.get(current)];
    }

    for (const next of successors(current)) {
      const score = g.get(current) + value(next, current);
      if (score < g.get(next)) {
        parent.set(next, current);
        g.set(next, score);
        f.set(next, score + heuristic(next));
        open.push(next);
      }
    }
  }

  return null;
}

/**
 * Represents infinity for graph algorithms, using JavaScript's maximum safe integer
 */
const INF = Number.MAX_SAFE_INTEGER;

/**
 * Creates a 2D array (matrix) initialized with zeros
 * @param {number} x - Number of rows
 * @param {number} y - Number of columns
 * @returns {number[][]} A 2D array of dimensions x by y filled with zeros
 */
export const graph: (x: number, y: number) => number[][] = (x, y) =>
  Array.from({ length: x }, () => Array(y).fill(0));

/**
 * Class representing graph data structures and algorithms
 * @class Graphs
 * @description Implements various graph algorithms including:
 * - Floyd-Warshall for all-pairs shortest paths
 * - Dijkstra's algorithm for single-source shortest paths
 * - A* pathfinding algorithm for optimal path between two points
 */
export class Graphs {
  /** Number of vertices in the graph */
  private V: number;

  /**
   * Creates a new Graphs instance
   * @param {number} V - Number of vertices in the graph
   */
  constructor(V: number) {
    this.V = V;
  }

  /**
   * Implements Floyd-Warshall algorithm for finding shortest paths between all pairs of vertices
   * @param {number[][]} graph - Adjacency matrix representation of the graph
   * @description Time Complexity: O(V³) where V is the number of vertices
   * Space Complexity: O(V²)
   */
  public floydWarshall(graph: number[][]) {
    const dist = Array.from({ length: this.V }, () => Array(this.V).fill(INF));
    let i: number, j: number, k: number;

    for (i = 0; i < this.V; i++) {
      for (j = 0; j < this.V; j++) {
        dist[i][j] = graph[i][j];
      }
    }

    for (k = 0; k < this.V; k++) {
      for (i = 0; i < this.V; i++) {
        for (j = 0; j < this.V; j++) {
          if (dist[i][j] > dist[i][k] + dist[k][j]) {
            dist[i][j] = dist[i][k] + dist[k][j];
          }
        }
      }
    }
  }

  /**
   * Helper function for Dijkstra's algorithm to find vertex with minimum distance
   * @param {number[]} dist - Array of distances
   * @param {boolean[]} sptSet - Set of processed vertices
   * @returns {number} Index of vertex with minimum distance value
   * @private
   */
  private minDistance(dist: number[], sptSet: boolean[]): number {
    let min = INF,
      min_index = -1;

    for (let v = 0; v < this.V; v++) {
      if (sptSet[v] === false && dist[v] <= min) {
        min = dist[v];
        min_index = v;
      }
    }

    return min_index;
  }

  /**
   * Implements Dijkstra's algorithm for finding shortest paths from source vertex to all other vertices
   * @param {number[][]} graph - Adjacency matrix representation of the graph
   * @param {number} src - Source vertex
   * @description Time Complexity: O(V²) where V is the number of vertices
   * Space Complexity: O(V)
   */
  public dijkstra(graph: number[][], src: number): void {
    const dist: number[] = Array(this.V),
      sptSet: boolean[] = Array(this.V);

    dist[src] = 0;

    for (let count = 0; count < this.V - 1; count++) {
      const u = this.minDistance(dist, sptSet);

      sptSet[u] = true;

      for (let v = 0; v < this.V; v++) {
        if (!sptSet[v] && graph[u][v] !== 0 && dist[u] !== INF && dist[u] + graph[u][v] < dist[v]) {
          dist[v] = dist[u] + graph[u][v];
        }
      }
    }

    this.printSolution(dist);
  }

  /**
   * Implements A* pathfinding algorithm to find optimal path between two points
   * @param {number[][]} graph - Grid representation of the graph
   * @param {number} src - Source vertex
   * @param {number} dest - Destination vertex
   * @returns {Node[]} Array of nodes representing the optimal path
   * @description Time Complexity: O(E log V) where E is number of edges, V is number of vertices
   * Space Complexity: O(V)
   */
  public aStar(graph: number[][], src: number, dest: number): Node[] {
    const grid: Node[][] = this.initializeGrid(graph);
    const start = grid[Math.floor(src / this.V)][src % this.V];
    const end = grid[Math.floor(dest / this.V)][dest % this.V];

    const openHeap = new BinaryHeap((node: Node) => node.f);
    openHeap.push(start);

    while (openHeap.size() > 0) {
      const currentNode = openHeap.pop();

      if (currentNode === end) {
        const path: Node[] = [];
        let curr: Node | null = currentNode;
        while (curr) {
          path.push(curr);
          curr = curr.parent;
        }
        return path.reverse();
      }

      currentNode.closed = true;
      const neighbors: Node[] = this.getNeighbors(grid, currentNode);

      for (const neighbor of neighbors) {
        if (neighbor.closed) continue;

        const gScore: number = currentNode.g + neighbor.cost;
        const beenVisited: boolean = neighbor.visited;

        if (!beenVisited || gScore < neighbor.g) {
          neighbor.visited = true;
          neighbor.parent = currentNode;
          neighbor.h = this.manhattan(neighbor.pos, end.pos);
          neighbor.g = gScore;
          neighbor.f = neighbor.g + neighbor.h;

          if (!beenVisited) {
            openHeap.push(neighbor);
          } else {
            openHeap.rescoreElement(neighbor);
          }
        }
      }
    }

    return [];
  }

  /**
   * Initializes grid for A* pathfinding
   * @param {number[][]} graph - Input graph matrix
   * @returns {Node[][]} Grid of nodes with initialized properties
   * @private
   */
  private initializeGrid(graph: number[][]): Node[][] {
    const grid: Node[][] = [];
    for (let x = 0; x < this.V; x++) {
      grid[x] = [];
      for (let y = 0; y < this.V; y++) {
        grid[x][y] = {
          x,
          y,
          f: 0,
          g: 0,
          h: 0,
          cost: graph[x][y] || 1,
          visited: false,
          closed: false,
          parent: null,
          pos: { x, y },
          isWall: () => graph[x][y] === INF,
        };
      }
    }
    return grid;
  }

  /**
   * Calculates Manhattan distance between two positions
   * @param {Position} pos0 - Starting position
   * @param {Position} pos1 - Ending position
   * @returns {number} Manhattan distance between positions
   * @private
   */
  private manhattan(pos0: Position, pos1: Position): number {
    const d1: number = Math.abs(pos1.x - pos0.x);
    const d2: number = Math.abs(pos1.y - pos0.y);
    return d1 + d2;
  }

  /**
   * Gets valid neighboring nodes for A* algorithm
   * @param {Node[][]} grid - Grid of nodes
   * @param {Node} node - Current node
   * @returns {Node[]} Array of valid neighboring nodes
   * @private
   */
  private getNeighbors(grid: Node[][], node: Node): Node[] {
    const ret: Node[] = [];
    const { x, y }: Cartesian = node;

    const directions: number[][] = [
      [-1, 0],
      [1, 0],
      [0, -1],
      [0, 1],
    ];

    for (const [dx, dy] of directions) {
      if (grid[x + dx] && grid[x + dx][y + dy]) {
        ret.push(grid[x + dx][y + dy]);
      }
    }

    return ret;
  }

  /**
   * Prints solution for various algorithms
   * @param {(number[] | number[][] | Node[])} dist - Distance array/matrix or path
   * @returns {void}
   * @private
   */
  private printSolution(dist: number[] | number[][] | Node[]): void {
    console.log('The following matrix shows the shortest distances between every pair of vertices');
    if (this.printSolution.caller === this.floydWarshall) {
      const matrix = dist as number[][];
      for (let i = 0; i < this.V; i++) {
        for (let j = 0; j < this.V; j++) {
          if (matrix[i][j] === INF) {
            process.stdout.write('INF     ');
          } else {
            process.stdout.write(`${matrix[i][j]}       `);
          }
        }
        console.log('');
      }
    } else if (this.printSolution.caller === this.dijkstra) {
      const array = dist as number[];
      for (let i = 0; i < this.V; i++) {
        console.log(`${i}\t\t${array[i]}`);
      }
    } else if (this.printSolution.caller === this.aStar) {
      const path = dist as Node[];
      for (const node of path) {
        console.log(`${node.pos.x} ${node.pos.y}`);
      }
    } else {
      throw new Error('Invalid caller');
    }
  }
}

/**
 * Type representing x,y coordinates
 */
type Cartesian = {
  x: number;
  y: number;
};

/**
 * Interface extending Cartesian coordinates
 */
interface Position extends Cartesian {}

/**
 * Interface representing a node in the pathfinding grid
 */
interface Node extends Cartesian {
  f: number; // Total cost (g + h)
  g: number; // Cost from start to current node
  h: number; // Heuristic estimate from current to end
  cost: number; // Cost of traversing this node
  visited: boolean; // Whether node has been visited
  closed: boolean; // Whether node has been fully explored
  parent: Node | null; // Parent node in path
  isWall?: () => boolean; // Whether node is traversable
  pos: Position; // Position in grid
}

/**
 * Binary heap data structure for efficient priority queue operations
 * @class BinaryHeap
 */
class BinaryHeap<T = Node> {
  private content: T[];
  private scoreFunction: (node: T) => number;

  constructor(scoreFunction: (node: T) => number, initialContent: T[] = []) {
    this.content = initialContent;
    this.scoreFunction = scoreFunction;
  }

  push(element: T): void {
    this.content.push(element);
    this.sink(this.content.length - 1);
  }

  pop(): T {
    const result = this.content[0];
    const end = this.content.pop();
    if (this.content.length > 0 && end !== undefined) {
      this.content[0] = end;
      this.bubbleUp(0);
    }
    return result;
  }

  size(): number {
    return this.content.length;
  }

  rescoreElement(node: T): void {
    this.sink(this.content.indexOf(node));
  }

  private sink(n: number): void {
    const element = this.content[n];

    while (n > 0) {
      const parentN = ((n + 1) >> 1) - 1;
      const parent = this.content[parentN];
      if (this.scoreFunction(element) < this.scoreFunction(parent)) {
        this.content[parentN] = element;
        this.content[n] = parent;
        n = parentN;
      } else {
        break;
      }
    }
  }

  private bubbleUp(n: number): void {
    const length = this.content.length;
    const element = this.content[n];
    const elemScore = this.scoreFunction(element);

    while (true) {
      const child2N = (n + 1) << 1;
      const child1N = child2N - 1;
      let swap: number | null = null;
      let child1Score = 0;

      if (child1N < length) {
        const child1 = this.content[child1N];
        child1Score = this.scoreFunction(child1);
        if (child1Score < elemScore) swap = child1N;
      }

      if (child2N < length) {
        const child2 = this.content[child2N];
        const child2Score = this.scoreFunction(child2);
        if (child2Score < (swap === null ? elemScore : child1Score)) swap = child2N;
      }

      if (swap !== null) {
        this.content[n] = this.content[swap];
        this.content[swap] = element;
        n = swap;
      } else {
        break;
      }
    }
  }
}
