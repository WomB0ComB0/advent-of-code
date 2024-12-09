class PriorityQueue {
  private heap: [number, number][];

  constructor() {
    this.heap = [];
  }

  public enqueue(value: [number, number]): void {
    this.heap.push(value);
    let i = this.heap.length - 1;

    while (i > 0) {
      const parent = Math.floor((i - 1) / 2);
      if (this.heap[i][0] >= this.heap[parent][0]) break;

      [this.heap[i], this.heap[parent]] = [this.heap[parent], this.heap[i]];
      i = parent;
    }
  }

  public dequeue(): [number, number] {
    if (this.heap.length === 0) {
      throw new Error('Queue is empty');
    }

    const result = this.heap[0];
    const last = this.heap.pop()!;

    if (this.heap.length > 0) {
      this.heap[0] = last;
      this.heapify(0);
    }

    return result;
  }

  private heapify(i: number): void {
    const size = this.heap.length;
    let smallest = i;
    const left = 2 * i + 1;
    const right = 2 * i + 2;

    if (left < size && this.heap[left][0] < this.heap[smallest][0]) {
      smallest = left;
    }

    if (right < size && this.heap[right][0] < this.heap[smallest][0]) {
      smallest = right;
    }

    if (smallest !== i) {
      [this.heap[i], this.heap[smallest]] = [this.heap[smallest], this.heap[i]];
      this.heapify(smallest);
    }
  }

  public get count(): number {
    return this.heap.length;
  }
}

class PrimMST {
  private V: number;
  private graph: number[][];

  constructor(vertices: number) {
    this.V = vertices;
    this.graph = Array.from({ length: vertices }, () => Array(vertices).fill(0));
  }

  public addEdge(src: number, dest: number, weight: number): void {
    this.graph[src][dest] = weight;
    this.graph[dest][src] = weight; // For undirected graph
  }

  private minKey(key: number[], mstSet: boolean[]): number {
    let min = Number.MAX_VALUE;
    let minIndex = -1;

    for (let v = 0; v < this.V; v++) {
      if (!mstSet[v] && key[v] < min) {
        min = key[v];
        minIndex = v;
      }
    }
    return minIndex;
  }

  public findMSTMatrix(): { parent: number[]; totalWeight: number } {
    const parent: number[] = Array(this.V);
    const key: number[] = Array(this.V).fill(Number.MAX_VALUE);
    const mstSet: boolean[] = Array(this.V).fill(false);

    key[0] = 0;
    parent[0] = -1;

    for (let count = 0; count < this.V - 1; count++) {
      const u = this.minKey(key, mstSet);
      mstSet[u] = true;

      for (let v = 0; v < this.V; v++) {
        if (this.graph[u][v] && !mstSet[v] && this.graph[u][v] < key[v]) {
          parent[v] = u;
          key[v] = this.graph[u][v];
        }
      }
    }

    const totalWeight = key.reduce((sum, weight) => sum + weight, 0);
    return { parent, totalWeight };
  }

  public findMSTPQ(): number {
    const adj: [number, number][][] = Array(this.V)
      .fill(null)
      .map(() => []);

    // Build adjacency list from matrix
    for (let i = 0; i < this.V; i++) {
      for (let j = 0; j < this.V; j++) {
        if (this.graph[i][j] > 0) {
          adj[i].push([j, this.graph[i][j]]);
        }
      }
    }

    const pq = new PriorityQueue();
    const visited = Array(this.V).fill(false);
    let totalWeight = 0;

    pq.enqueue([0, 0]); // [weight, vertex]

    while (pq.count > 0) {
      const [weight, u] = pq.dequeue();

      if (visited[u]) continue;

      visited[u] = true;
      totalWeight += weight;

      for (const [v, w] of adj[u]) {
        if (!visited[v]) {
          pq.enqueue([w, v]);
        }
      }
    }

    return totalWeight;
  }

  public printMST(parent: number[]): void {
    console.log('Edge \tWeight');
    for (let i = 1; i < this.V; i++) {
      console.log(`${parent[i]} - ${i}\t${this.graph[i][parent[i]]}`);
    }
  }
}

export { PrimMST };
