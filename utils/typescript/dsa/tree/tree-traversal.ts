/**
 * Represents a TreeNode for a binary tree.
 * @constructor
 * @param {*} val - The value of the node.
 * @param {TreeNode|null} left - The left child of the node.
 * @param {TreeNode|null} right - The right child of the node.
 */
class TreeNode {
  val: number;
  left: TreeNode | null;
  right: TreeNode | null;
  constructor(val = 0, left = null, right = null) {
    this.val = val;
    this.left = left;
    this.right = right;
  }
}

/**
 * Performs an inorder traversal recursively on a binary tree.
 * @param {TreeNode|null} tree - The root node of the binary tree.
 * @returns {Array} - The result of the inorder traversal.
 */
function inorderRecursive(tree: TreeNode | null) {
  const result = [];

  function inorderTraverse(node: TreeNode | null) {
    if (!node) return;

    inorderTraverse(node.left);
    result.push(node.val);
    inorderTraverse(node.right);
  }

  inorderTraverse(tree);

  return result;
}

/**
 * Performs an inorder traversal iteratively on a binary tree.
 * @param {TreeNode|null} tree - The root node of the binary tree.
 * @returns {Array} - The result of the inorder traversal.
 */
function inorderIterative(tree: TreeNode | null) {
  const stack = [];
  const result = [];
  let currentNode = tree;

  while (currentNode || stack.length) {
    while (currentNode) {
      stack.push(currentNode);
      currentNode = currentNode.left;
    }

    const node = stack.pop();
    result.push(node.val);
    currentNode = node.right;
  }

  return result;
}

/**
 * Performs a preorder traversal recursively on a binary tree.
 * @param {TreeNode|null} tree - The root node of the binary tree.
 * @returns {Array} - The result of the preorder traversal.
 */
function preorderRecursive(tree: TreeNode | null) {
  const result = [];

  function preorderTraverse(node: TreeNode | null) {
    if (!node) return;

    result.push(node.val);
    preorderTraverse(node.left);
    preorderTraverse(node.right);
  }

  preorderTraverse(tree);

  return result;
}

/**
 * Performs a preorder traversal iteratively on a binary tree.
 * @param {TreeNode|null} root - The root node of the binary tree.
 * @returns {Array} - The result of the preorder traversal.
 */
function preorderTraversal(root: TreeNode | null) {
  if (!root) return [];

  const stack = [root];
  const result = [];

  while (stack.length) {
    const node = stack.pop();
    result.push(node.val);

    if (node.right) stack.push(node.right);
    if (node.left) stack.push(node.left);
  }

  return result;
}

/**
 * Performs a postorder traversal recursively on a binary tree.
 * @param {TreeNode|null} tree - The root node of the binary tree.
 * @returns {Array} - The result of the postorder traversal.
 */
function postorderRecursive(tree: TreeNode | null) {
  const result = [];

  function postorderTraverse(node: TreeNode | null) {
    if (!node) return;

    postorderTraverse(node.left);
    postorderTraverse(node.right);
    result.push(node.val);
  }

  postorderTraverse(tree);

  return result;
}

/**
 * Performs a postorder traversal iteratively on a binary tree.
 * @param {TreeNode|null} root - The root node of the binary tree.
 * @returns {Array} - The result of the postorder traversal.
 */
function postorderTraversal(root: TreeNode | null) {
  if (!root) return [];

  const stack = [root];
  const result = [];

  while (stack.length) {
    const node = stack[stack.length - 1];

    if (node.left) {
      stack.push(node.left);
      node.left = null;
    } else if (node.right) {
      stack.push(node.right);
      node.right = null;
    } else {
      result.push(stack.pop().val);
    }
  }

  return result;
}

export {
  inorderRecursive,
  inorderIterative,
  preorderRecursive,
  preorderTraversal,
  postorderRecursive,
  postorderTraversal,
};
