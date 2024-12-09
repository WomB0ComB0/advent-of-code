class UnionFind {
  parent: Record<string, string>;
  constructor(elements: string[]) {
    this.parent = {};

    elements.forEach((e) => (this.parent[e] = e));
  }

  union(a: string, b: string) {
    this.parent[this.find(a)] = this.find(b);
  }

  find(a: string) {
    while (this.parent[a] !== a) {
      a = this.parent[a];
    }

    return a;
  }

  connected(a: string, b: string) {
    return this.find(a) === this.find(b);
  }
}
const kruskal = (graph: { source: string; destination: string; weight: number }[]) => {
  graph.sort((a, b) => a.weight - b.weight);

  const nodes = new Set(graph.flatMap((e) => [e.source, e.destination]));
  const unionFind = new UnionFind(Array.from(nodes));

  const mst = [];

  for (const edge of graph) {
    if (!unionFind.connected(edge.source, edge.destination)) {
      unionFind.union(edge.source, edge.destination);
      mst.push(edge);
    }
  }

  return mst;
};

export { kruskal };
