export class GraphHelperMatrix {
  matrix: number[][];
  constructor(numNodes: number) {
    this.matrix = [];
    for (let i = 0; i < numNodes; i++) {
      this.matrix.push(new Array(numNodes).fill(0));
    }
  }
  addEdge(fromNode: number, toNode: number) {
    this.matrix[fromNode][toNode] = 1;
    this.matrix[toNode][fromNode] = 1;
  }
  removeEdge(fromNode: number, toNode: number) {
    this.matrix[fromNode][toNode] = 0;
    this.matrix[toNode][fromNode] = 0;
  }
  isEdge(fromNode: number, toNode: number) {
    return this.matrix[fromNode][toNode] === 1;
  }
}
