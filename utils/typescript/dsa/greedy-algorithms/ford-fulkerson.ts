class FordFulkerson {
  private V: number;
  private graph: number[][];
  private rGraph: number[][];

  constructor(graph: number[][]) {
    this.V = graph.length;
    this.graph = graph;
    this.rGraph = Array.from({ length: this.V }, () => Array(this.V).fill(0));
  }

  private bfs(s: number, t: number, parent: number[]): boolean {
    const visited = Array(this.V).fill(false);
    const queue: number[] = [];

    queue.push(s);
    visited[s] = true;
    parent[s] = -1;

    while (queue.length > 0) {
      const u = queue.shift()!;

      for (let v = 0; v < this.V; v++) {
        if (!visited[v] && this.rGraph[u][v] > 0) {
          if (v === t) {
            parent[v] = u;
            return true;
          }
          queue.push(v);
          parent[v] = u;
          visited[v] = true;
        }
      }
    }
    return false;
  }

  public findMaxFlow(source: number, sink: number): number {
    // Initialize residual graph
    for (let i = 0; i < this.V; i++) {
      for (let j = 0; j < this.V; j++) {
        this.rGraph[i][j] = this.graph[i][j];
      }
    }

    const parent = Array(this.V).fill(-1);
    let maxFlow = 0;

    while (this.bfs(source, sink, parent)) {
      // Find minimum residual capacity along the path
      let pathFlow = Number.POSITIVE_INFINITY;
      for (let v = sink; v !== source; v = parent[v]) {
        const u = parent[v];
        pathFlow = Math.min(pathFlow, this.rGraph[u][v]);
      }

      // Update residual capacities
      for (let v = sink; v !== source; v = parent[v]) {
        const u = parent[v];
        this.rGraph[u][v] -= pathFlow;
        this.rGraph[v][u] += pathFlow;
      }

      maxFlow += pathFlow;
    }

    return maxFlow;
  }
}

export { FordFulkerson };
