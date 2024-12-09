import collections
from typing import List, Any


class Height:  # Creating a height class
    def __init__(self):  # Initializing the height
        self.height = 0


def bfs(graph, root):  # BFS algorithm
    visited, queue = set(), collections.deque([root])
    visited.add(root)
    while queue:
        # Dequeue a vertex from queue
        vertex = queue.popleft()
        print(str(vertex) + " ", end="")
        # If not visited, mark it as visited, and enqueue it
        for neighbour in graph[vertex]:
            if neighbour not in visited:
                visited.add(neighbour)
                queue.append(neighbour)


def dfs(graph, start):  # DFS algorithm
    visited, stack = set(), [start]
    while stack:
        vertex = stack.pop()
        if vertex not in visited:
            visited.add(vertex)
            stack.extend(graph[vertex] - visited)
    return visited


def partition(array, low, high):  # function to find the partition position
    # choose the rightmost element as pivot
    pivot = array[high]
    # pointer for greater element
    i = low - 1
    # traverse through all elements
    # compare each element with pivot
    for j in range(low, high):
        if array[j] <= pivot:
            # if element smaller than pivot is found
            # swap it with the greater element pointed by i
            i = i + 1
            # swapping element at i with element at j
            (array[i], array[j]) = (array[j], array[i])
    # swap the pivot element with the greater element specified by i
    (array[i + 1], array[high]) = (array[high], array[i + 1])
    # return the position from where partition is done
    return i + 1


class Stack:
    def __init__(self):  # Initializing the stack
        self.stack = []

    def create_stack(self):  # Creating a stack
        stack = []
        return stack

    def check_empty(self):  # Creating an empty stack
        return len(self.stack) == 0

    def push(self, item):  # Adding items into the stack
        self.stack.append(item)
        print("pushed item: " + item)

    def pop(self):  # Removing an element from the stack
        if self.check_empty():
            return "stack is empty"
        return self.stack.pop()


class HashTable:
    def __init__(self, MAX: int = 10, arr: List[Any] = None):
        self.MAX = MAX
        if arr is not None:
            self.arr = arr
        else:
            self.arr = [None for i in range(MAX)]

    def checkPrime(self, n):  # Check if a number is prime
        if n == 1 or n == 0:
            return 0
        for i in range(2, n // 2):
            if n % i == 0:
                return 0
        return 1

    def getPrime(self, n):  # Get the prime number just greater than the given number
        if n % 2 == 0:
            n = n + 1
        while not self.checkPrime(n):
            n += 2
        return n

    def hashFunction(self, key):  # Remainder Method
        capacity = self.getPrime(10)
        return key % capacity

    def insertData(self, key, data):  # Insert "data" into hash table at "key" index
        index = self.hashFunction(key)
        self.arr[index] = [key, data]

    def removeData(self, key):  # Remove a key from the hash table
        index = self.hashFunction(key)
        self.arr[index] = 0


class Node:  # Creating a node
    def __init__(self, item):
        self.item = item
        self.next = None


class LinkedList:  # Creating a linked list
    def __init__(self):
        self.head = None

    def print_list(self):
        cur_node = self.head
        while cur_node:
            print(cur_node.item)
            cur_node = cur_node.next

    def append(self, item):
        new_node = Node(item)
        if self.head is None:
            self.head = new_node
            return
        last_node = self.head
        while last_node.next:
            last_node = last_node.next
        last_node.next = new_node

    def prepend(self, item):
        new_node = Node(item)
        new_node.next = self.head
        self.head = new_node

    def insert_after_node(self, prev_node, item):
        if not prev_node:
            print("Previous node is not in the list")
            return
        new_node = Node(item)
        new_node.next = prev_node.next
        prev_node.next = new_node

    def delete_node(self, key):
        cur_node = self.head
        if cur_node and cur_node.item == key:
            self.head = cur_node.next
            cur_node = None
            return
        prev = None
        while cur_node and cur_node.item != key:
            prev = cur_node
            cur_node = cur_node.next
        if cur_node is None:
            return
        prev.next = cur_node.next
        cur_node = None

    def delete_node_at_pos(self, pos):
        cur_node = self.head
        if pos == 0:
            self.head = cur_node.next
            cur_node = None
            return
        prev = None
        count = 1
        while cur_node and count != pos:
            prev = cur_node
            cur_node = cur_node.next
            count += 1
        if cur_node is None:
            return
        prev.next = cur_node.next
        cur_node = None

    def len_iterative(self):
        count = 0
        cur_node = self.head
        while cur_node:
            count += 1
            cur_node = cur_node.next
        return count

    def len_recursive(self, node):
        if node is None:
            return 0
        return 1 + self.len_recursive(node.next)

    def swap_nodes(self, key1, key2):
        if key1 == key2:
            return
        prev1 = None
        cur1 = self.head
        while cur1 and cur1.item != key1:
            prev1 = cur1
            cur1 = cur1.next
        prev2 = None
        cur2 = self.head
        while cur2 and cur2.item != key2:
            prev2 = cur2
            cur2 = cur2.next
        if not cur1 or not cur2:
            return
        if prev1:
            prev1.next = cur2
        else:
            self.head = cur2
        if prev2:
            prev2.next = cur1
        else:
            self.head = cur1
        cur1.next, cur2.next = cur2.next, cur1.next

    def reverse_iterative(self):
        prev = None
        cur = self.head
        while cur:
            nxt = cur.next
            cur.next = prev
            prev = cur
            cur = nxt
        self.head = prev

    def reverse_recursive(self):
        def _reverse_recursive(cur, prev):
            if not cur:
                return prev
            nxt = cur.next
            cur.next = prev
            prev = cur
            cur = nxt
            return _reverse_recursive(cur, prev)

        self.head = _reverse_recursive(cur=self.head, prev=None)

    def merge_sorted(self, llist):
        p = self.head
        q = llist.head
        s = None
        new_head = None
        if not p:
            return q
        if not q:
            return p
        if p and q:
            if p.item <= q.item:
                s = p
                p = s.next
            else:
                s = q
                q = s.next
            new_head = s
        while p and q:
            if p.item <= q.item:
                s.next = p
                s = p
                p = s.next
            else:
                s.next = q
                s = q
                q = s.next
        if not p:
            s.next = q
        if not q:
            s.next = p
        return new_head

    def remove_duplicates(self):
        cur = self.head
        prev = None
        dup_values = dict()
        while cur:
            if cur.item in dup_values:
                prev.next = cur.next
                cur = None
            else:
                dup_values[cur.item] = 1
                prev = cur
            cur = prev.next

    def print_nth_from_last(self, n):
        total_len = self.len_iterative()
        cur = self.head
        while cur:
            if total_len == n:
                print(cur.item)
                return cur.item
            total_len -= 1
            cur = cur.next
        if cur is None:
            return

    def rotate(self, k):
        p = self.head
        q = self.head
        prev = None
        count = 0
        while p and count < k:
            prev = p
            p = p.next
            q = q.next
            count += 1
        p = prev
        while q:
            prev = q
            q = q.next
        q = prev
        q.next = self.head
        self.head = p.next
        p.next = None

    def is_palindrome(self):
        s = ""
        p = self.head
        while p:
            s += p.item
            p = p.next
        return s == s[::-1]

    def move_tail_to_head(self):
        last = self.head
        second_to_last = None
        while last.next:
            second_to_last = last
            last = last.next
        last.next = self.head
        second_to_last.next = None
        self.head = last

    def sum_two_lists(self, llist):
        p = self.head
        q = llist.head
        sum_llist = LinkedList()
        carry = 0
        while p or q:
            if not p:
                i = 0
            else:
                i = p.item
            if not q:
                j = 0
            else:
                j = q.item
            s = i + j + carry
            if s >= 10:
                carry = 1
                remainder = s % 10
                sum_llist.append(remainder)
            else:
                carry = 0
                sum_llist.append(s)
            if p:
                p = p.next
            if q:
                q = q.next
        sum_llist.print_list()

    def is_circular_linked_list(self, input_list):
        cur = input_list.head
        while cur:
            cur = cur.next
            if cur == input_list.head:
                return True
        return False
