class TreeNode {
  key: number;
  left: TreeNode | null;
  right: TreeNode | null;
  parent?: TreeNode;
  size?: number;
  height?: number;
  depth?: number;
  constructor(key: number) {
    this.key = key;
    this.left = null;
    this.right = null;
  }
}

class Tree {
  root: TreeNode;

  constructor(key: number) {
    const node = new TreeNode(key);
    this.root = node;
  }

  find(k: number, R: TreeNode): TreeNode {
    if (R.key == k) {
      return R;
    } else if (k < R.key) {
      if (R.left) {
        return this.find(k, R.left);
      }
      return R;
    } else if (k > R.key) {
      if (R.right) {
        return this.find(k, R.right);
      }
      return R;
    }
    return R;
  }

  rangeSearch(x: number, y: number): TreeNode[] {
    const L: TreeNode[] = [];
    let N = this.find(x, this.root);
    while (N.key <= y) {
      if (N.key >= x) {
        L.push(N);
      }
      N = this.next(N);
    }
    return L;
  }

  next(N: TreeNode | number): TreeNode {
    const node: TreeNode = typeof N === 'number' ? this.find(N, this.root) : N;

    if (node.right) {
      return this.leftDescendant(node.right);
    } else {
      return this.rightAncestor(node);
    }
  }

  leftDescendant(N: TreeNode): TreeNode {
    if (!N.left) {
      // If no left child, return
      return N;
    } else {
      return this.leftDescendant(N.left); // Else find descendant of left child
    }
  }

  rightAncestor(N: TreeNode): TreeNode | undefined {
    if (N.parent) {
      // If parent is not null
      if (N.key < N.parent.key) {
        // If node's key is less than parent's key
        return N.parent; // Return parent
      } else {
        return this.rightAncestor(N.parent); // Else find ancestor of parent
      }
    }
  }

  insert(k: number): TreeNode {
    const P = this.find(k, this.root);
    const node = new TreeNode(k);
    node.parent = P;
    node.parent.size++;
    if (P && k > P.key) {
      P.right = node;
    } else {
      P.left = node;
    }
    return node;
  }

  avlInsert(k: number): void {
    const N = this.insert(k); // Set N equal to insertion of new node
    this.adjustDepth(N); // Adjust depth of the new node
    this.rebalance(N); // Rebalance tree based on node size
  }

  rebalance(N: TreeNode): void {
    if (N.parent) {
      // If node has parent, set equal to P
      var P = N.parent;
    }
    if (N.left && N.right) {
      // If node has both a left and right
      if (N.left.size > N.right.size + 1) {
        // If left size is greater than right size plus 1
        this.rebalanceRight(N); // Rebalance on the right side
      }
      if (N.right.size > N.left.size + 1) {
        // If right size is greater than left size plus 1
        this.rebalanceLeft(N); // Rebalance on the left side
      }
    } else if (N.left && N.left.size > 1) {
      // If no right child but left size is greater than 1
      this.rebalanceRight(N); // Rebalance on the right side
    } else if (N.right && N.right.size > 1) {
      // If no left child but right size is greater than 1
      this.rebalanceLeft(N); // Rebalance on the left side
    }
    this.adjustHeight(N); // Update heights
    this.adjustDepth(N); // Update depths
    if (P) {
      // If node had parent, recurse rebalance function with parent
      this.rebalance(P);
    }
  }

  rebalanceRight(N: TreeNode): void {
    var M = N.left; // Set M equal to node's left child
    if (M.right && M.left && M.right.size > M.left.size) {
      // If M has both right and left children and M's right size is greater than it's left size
      this.rotateLeft(M); // Rotate left on M
    } else if (M.right && M.right.size > 1) {
      // If M has a right child and it's size is more than 1
      this.rotateLeft(M); // Rotate left on M
    }
    this.rotateRight(N); // Rotate right on N
  }

  rebalanceLeft(N: TreeNode): void {
    var M = N.right; // Set M equal to node's right child
    if (M.right && M.left && M.left.size > M.right.size) {
      // If M has both right and left children and M's left size is greater than M's right size
      this.rotateRight(M); // Rotate right on M
    } else if (M.left && M.left.size > 1) {
      // If M has a left child and it's size is more than 1
      this.rotateRight(M); // Rotate right on M
    }
    this.rotateLeft(N); // Rotate left on N
  }

  rotateRight(X: TreeNode): void {
    var P = X.parent; // P is parent of current node
    var Y = X.left; // Y is current node's left child
    var B = Y.right; // B is Y's right child
    Y.parent = P; // Set Y's parent equal to X's parent
    if (Y && P) {
      // If Y and P not null
      if (Y.key > P.key) {
        // If Y bigger than P - X's parent
        P.right = Y; // X's parent's right child equal to Y
      } else {
        P.left = Y; // X's parent's left child equal to Y
      }
    }
    if (X.parent == null) {
      // If X is current root node
      this.root = Y; // Set Y as the tree's new root
    }
    X.parent = Y; // Set X's new parent to Y
    X.left = B; // Set's X's left child to B
    Y.right = X; // Set Y's right child to X
    if (B) {
      // If Y has a right child
      B.parent = X; // Set it's parent to X
    }
    this.recomputeSize(X); // Recompute size of X
    this.recomputeSize(Y); // Recompute size of Y
    if (P) {
      // If P or X's parent is not null
      this.recomputeSize(P); // Recompute size of P
    }
  }

  rotateLeft(X: TreeNode): void {
    var P = X.parent; // P is parent of current node
    var Y = X.right; // Y is current node's right child
    var B = Y.left; // 8 is Y's left child
    Y.parent = P; // Set Y's parent equal to P - X's parent
    if (Y && P) {
      // If Y and P not null
      if (Y.key > P.key) {
        // If Y greater than P
        P.right = Y; // Set X's parent's right child equal to Y
      } else {
        P.left = Y; // Set X's parent's left child equal to Y
      }
    }
    if (X.parent == null) {
      // If X is current root node
      this.root = Y; // Set Y as the tree's new root
    }
    X.parent = Y; // Set X's new parent as Y
    Y.left = X; // Set Y's left child as X
    if (B) {
      // If Y has a left child
      B.parent = X; // Set Y's left child equal to X
    }
    X.right = B; // Set X's right child equal to B - Y's former left child
    this.recomputeSize(X); // Recompute size of X
    this.recomputeSize(Y); // Recompute size of Y
    if (P) {
      // If P or X's parent is not null
      this.recomputeSize(P); // Recompute size of P
    }
  }

  recomputeSize(N: TreeNode): void {
    var size = 1;
    if (N.left) {
      size += N.left.size;
    }
    if (N.right) {
      size += N.right.size;
    }
    N.size = size;
  }

  adjustHeight(N: TreeNode): void {
    if (N.left && N.right) {
      N.height = 1 + Math.max(N.left.height, N.right.height);
    } else if (N.left) {
      N.height = 1 + N.left.height;
    } else if (N.right) {
      N.height = 1 + N.right.height;
    } else {
      N.height = 1;
    }
    if (N.parent) {
      this.adjustHeight(N.parent);
    }
  }

  adjustDepth(N: TreeNode): void {
    if (N.key < this.root.key) {
      N.depth = this.root.left.height - N.height + 1;
    } else if (N.key > this.root.key) {
      N.depth = this.root.right.height - N.height + 1;
    } else if (N.key == this.root.key) {
      N.depth = 0;
    }
    if (N.right) {
      this.adjustDepth(N.right);
    }
    if (N.left) {
      this.adjustDepth(N.left);
    }
  }

  delete(N: TreeNode | number): TreeNode {
    if (typeof N === 'number') {
      N = this.find(N, this.root);
    }
    if (N.right) {
      if (N.right.key > N.parent.key) {
        N.parent.right = N.right;
      } else {
        N.parent.left = N.right;
      }
      N.right.parent = N.parent;
      N.right.depth--;
    } else if (N.left) {
      if (N.left.key > N.parent.key) {
        N.parent.right = N.left;
      } else {
        N.parent.left = N.left;
      }
      N.left.parent = N.parent; // Set the parent of the replacing node
      N.left.depth--; // Reduce it's depth by 1
    }
    const temp = N; // Store node to be deleted
    N = null; // Clear the reference
    return temp; // Return deleted node
  }

  avlDelete(N: TreeNode | number): void {
    const key = typeof N === 'number' ? N : N.key;
    const node = this.find(key, this.root);
    const M = node.parent;
    this.delete(node);
    this.rebalance(M);
  }

  orderStatistic(R: TreeNode, k: TreeNode | number): TreeNode | undefined {
    let s: number;
    if (R.left) {
      s = R.left.size;
    } else {
      s = 0;
    }
    const node = typeof k === 'number' ? this.find(k, R) : k;
    if (node.size == s + 1) {
      return R;
    } else if (node.size < s + 1) {
      return this.orderStatistic(R.left, k);
    } else if (node.size > s + 1) {
      return this.orderStatistic(R.right, node.size - s - 1);
    }
  }

  rangeSum(x: number, y: number): number {
    const range = this.rangeSearch(x, y);
    let sum = 0;
    for (let i = 0; i < range.length; i++) {
      sum += range[i].key;
    }
    return sum;
  }
}

export { Tree, TreeNode };
