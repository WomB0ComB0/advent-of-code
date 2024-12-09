// JavaScript code for the above approach
class TreeNode {
  val: number;
  left: TreeNode | null;
  right: TreeNode | null;
  constructor(val: number) {
    this.val = val;
    this.left = null;
    this.right = null;
  }
}

class PerfectBinaryTree {
  static perfectBinaryTree(depth: number) {
    if (depth === 0) {
      return new TreeNode(0);
    }

    const queue = [];
    let i = 0;
    const root = new TreeNode(i);
    queue.push(root);

    while (queue.length > 0) {
      const size = queue.length;
      i++;
      if (i > depth) {
        break;
      } else {
        for (let j = 0; j < size; j++) {
          const node = queue.shift();
          node.left = new TreeNode(i);
          node.right = new TreeNode(i);
          queue.push(node.left);
          queue.push(node.right);
        }
      }
    }

    return root;
  }

  static inOrderTraversal(node: TreeNode | null) {
    if (node === null) return;
    this.inOrderTraversal(node.left);
    console.log(node.val + ' ');
    this.inOrderTraversal(node.right);
  }
}

export { PerfectBinaryTree };
