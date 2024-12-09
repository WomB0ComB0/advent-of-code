class Node {
  value: number;
  right: Node | null;
  left: Node | null;
  constructor(value: number) {
    this.value = value;
    this.right = null;
    this.left = null;
  }
}

class BinaryTree {
  root: Node | null;
  constructor() {
    this.root = null;
  }
  //inserts a number into the tree. Returns the entire tree.
  insert(value: number) {
    const newNode = new Node(value);
    if (!this.root) {
      this.root = newNode;
      return this;
    }
    let current = this.root;
    const rnLoop = true;
    while (rnLoop) {
      if (value === current.value) return undefined;
      if (value < current.value) {
        if (!current.left) {
          current.left = newNode;
          return this;
        }
        current = current.left;
      } else {
        if (!current.right) {
          current.right = newNode;
          return this;
        }
        current = current.right;
      }
    }
  }
  //finds the given number and returns it. If its not found, returns `null` or `undefined`.
  find(value: number) {
    if (!this.root) return null;
    let current = this.root;
    const rnLoop = true;
    while (rnLoop) {
      if (!current) return undefined;
      if (value === current.value) return current;
      if (value < current.value) {
        current = current.left;
      } else {
        current = current.right;
      }
    }
  }
  //checks if a given number exists in the tree. If its in the tree, returns `true`, otherwise `false`
  contains(value: number) {
    if (!this.root) return null;
    let current = this.root;
    const rnLoop = true;
    while (rnLoop) {
      if (!current) return false;
      if (value === current.value) return true;
      if (value < current.value) {
        current = current.left;
      } else {
        current = current.right;
      }
    }
  }
}

export { BinaryTree };
