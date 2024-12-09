class Node {
  char: string;
  frequency: number;
  left: Node | null;
  right: Node | null;

  constructor(char: string, frequency: number) {
    this.char = char;
    this.frequency = frequency;
    this.left = null;
    this.right = null;
  }
}

class Huffman {
  private root: Node | null;
  private encodingMap: Map<string, string>;

  constructor() {
    this.root = null;
    this.encodingMap = new Map();
  }

  private buildFrequencyTable(text: string): Record<string, number> {
    const frequencyTable: Record<string, number> = {};
    for (const char of text) {
      frequencyTable[char] = frequencyTable[char] + 1 || 1;
    }
    return frequencyTable;
  }

  private buildTree(frequencyTable: Record<string, number>): Node {
    const nodes: Node[] = [];
    for (const char in frequencyTable) {
      nodes.push(new Node(char, frequencyTable[char]));
    }

    while (nodes.length > 1) {
      nodes.sort((a, b) => a.frequency - b.frequency);

      const left = nodes.shift()!;
      const right = nodes.shift()!;
      const parent = new Node('', left.frequency + right.frequency);

      parent.left = left;
      parent.right = right;
      nodes.push(parent);
    }
    return nodes[0];
  }

  private buildEncodingMap(node: Node, encoding = ''): void {
    if (!node) return;

    if (!node.left && !node.right) {
      this.encodingMap.set(node.char, encoding);
    }

    this.buildEncodingMap(node.left!, encoding + '0');
    this.buildEncodingMap(node.right!, encoding + '1');
  }

  public encode(text: string): string {
    const frequencyTable = this.buildFrequencyTable(text);
    this.root = this.buildTree(frequencyTable);
    this.buildEncodingMap(this.root);

    let encoded = '';
    for (const char of text) {
      encoded += this.encodingMap.get(char);
    }
    return encoded;
  }

  public decode(encoded: string): string {
    if (!this.root) throw new Error('No Huffman tree exists. Encode data first.');

    let current = this.root;
    let decoded = '';

    for (const bit of encoded) {
      current = bit === '0' ? current.left! : current.right!;

      if (!current.left && !current.right) {
        decoded += current.char;
        current = this.root;
      }
    }
    return decoded;
  }
}

export { Huffman };
