class Edge {
  constructor(
    public src: number,
    public dest: number,
    public weight: number,
  ) {}
}

export class BellmanFord {
  private V: number;
  private E: number;
  private edges: Edge[];
  private distances: number[];

  constructor(vertices: number) {
    this.V = vertices;
    this.E = 0;
    this.edges = [];
    this.distances = Array(vertices).fill(Number.MAX_SAFE_INTEGER);
  }

  public addEdge(src: number, dest: number, weight: number): void {
    this.edges.push(new Edge(src, dest, weight));
    this.E++;
  }

  public findShortestPaths(source: number): number[] | null {
    // Initialize distances
    this.distances = Array(this.V).fill(Number.MAX_SAFE_INTEGER);
    this.distances[source] = 0;

    // Relax all edges V-1 times
    for (let i = 1; i <= this.V - 1; i++) {
      for (const edge of this.edges) {
        const { src: u, dest: v, weight } = edge;
        if (
          this.distances[u] !== Number.MAX_SAFE_INTEGER &&
          this.distances[u] + weight < this.distances[v]
        ) {
          this.distances[v] = this.distances[u] + weight;
        }
      }
    }

    // Check for negative-weight cycles
    for (const edge of this.edges) {
      const { src: u, dest: v, weight } = edge;
      if (
        this.distances[u] !== Number.MAX_SAFE_INTEGER &&
        this.distances[u] + weight < this.distances[v]
      ) {
        console.log('Graph contains negative weight cycle');
        return null;
      }
    }

    return this.distances;
  }

  public printDistances(): void {
    console.log('Vertex Distance from Source');
    for (let i = 0; i < this.V; i++) {
      console.log(`${i}\t\t${this.distances[i]}`);
    }
  }
}
