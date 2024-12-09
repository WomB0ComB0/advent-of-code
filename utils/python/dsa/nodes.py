from helpers import Height


class Node:
    def __init__(self, item):
        self.left = None
        self.right = None
        self.val = item

    @staticmethod
    def inorder(root):
        if root:
            Node.inorder(root.left)  # Traverse left
            print(str(root.val) + "->", end="")  # Traverse root
            Node.inorder(root.right)  # Traverse right

    @staticmethod
    def postorder(root):
        if root:
            Node.postorder(root.left)  # Traverse left
            Node.postorder(root.right)  # Traverse right
            print(str(root.val) + "->", end="")  # Traverse root

    @staticmethod
    def preorder(root):
        if root:
            print(str(root.val) + "->", end="")  # Traverse root
            Node.preorder(root.left)  # Traverse left
            Node.preorder(root.right)  # Traverse right

    @staticmethod
    def isFullTree(root):  # Checking full binary tree
        if root is None:  # Tree empty case
            return True
        if (
            root.left is None and root.rightChild is None
        ):  # Checking whether child is present
            return True
        if root.left is not None and root.rightChild is not None:
            return Node.isFullTree(root.left) and Node.isFullTree(root.rightChild)
        return False

    @staticmethod
    def calculateDepth(node):  # Calculate the depth
        d = 0
        while node is not None:
            d += 1
            node = node.left
        return d

    @staticmethod
    def is_perfect(root, d, level=0):  # Check if the tree is perfect binary tree
        if root is None:  # Check if the tree is empty
            return True
        if root.left is None and root.right is None:  # Check the presence of trees
            return d == level + 1
        if root.left is None or root.right is None:
            return False
        return Node.is_perfect(root.left, d, level + 1) and Node.is_perfect(
            root.right, d, level + 1
        )

    @staticmethod
    def count_nodes(root):  # Count the number of nodes
        if root is None:
            return 0
        return 1 + Node.count_nodes(root.left) + Node.count_nodes(root.right)

    @staticmethod
    def is_complete(
        root, index, numberNodes
    ):  # Check if the tree is complete binary tree
        if root is None:  # Check if the tree is empty
            return True
        if index >= numberNodes:
            return False
        return Node.is_complete(
            root.left, 2 * index + 1, numberNodes
        ) and Node.is_complete(root.right, 2 * index + 2, numberNodes)

    @staticmethod
    def insert(node, key):  # Insert a node
        if node is None:  # Return a new node if the tree is empty
            return Node(key)
        if key < node.key:  # Traverse to the right place and insert the node
            node.left = Node.insert(node.left, key)
        else:
            node.right = Node.insert(node.right, key)
        return node

    @staticmethod
    def minValueNode(node):  # Find the inorder successor
        current = node
        while current.left is not None:  # Find the leftmost leaf
            current = current.left
        return current

    @staticmethod
    def deleteNode(root, key):  # Deleting a node
        if root is None:  # Return if the tree is empty
            return root
        if key < root.key:  # Find the node to be deleted
            root.left = Node.deleteNode(root.left, key)
        elif key > root.key:
            root.right = Node.deleteNode(root.right, key)
        else:
            if root.left is None:  # If the node is with only one child or no child
                temp = root.right
                root = None
                return temp
            elif root.right is None:
                temp = root.left
                root = None
                return temp
            temp = Node.minValueNode(
                root.right
            )  # If the node has two children, place the inorder successor in position of the node to be deleted

            root.key = temp.key

            root.right = Node.deleteNode(
                root.right, temp.key
            )  # Delete the inorder successor

        return root

    @staticmethod
    def isHeightBalanced(root, height):  # Checking if the tree is height balanced
        left_height = Height()
        right_height = Height()

        if root is None:
            return True

        l = Node.isHeightBalanced(root.left, left_height)
        r = Node.isHeightBalanced(root.right, right_height)

        height.height = max(left_height.height, right_height.height) + 1

        if abs(left_height.height - right_height.height) <= 1:
            return l and r

        return False


class TreeNode(object):  # Create a tree node
    def __init__(self, key):
        self.key = key
        self.left = None
        self.right = None
        self.height = 1


class RBNode:  # Node creation
    def __init__(self, item):
        self.item = item
        self.parent = None
        self.left = None
        self.right = None
        self.color = 1


class BPlusNode:  # Node creation
    def __init__(self, leaf=False):
        self.leaf = leaf
        self.keys = []
        self.child = []


class AdjNode:  # Adjacency list node
    def __init__(self, value):
        self.vertex = value
        self.next = None
