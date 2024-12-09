from typing import List, Dict, Tuple, Any, TypeVar
import random
import string
from collections import Counter

from .data_generators import DataGenerators


class SinglyLinkedListNode:
    def __init__(self, value=0, next=None) -> None:
        self.value = value
        self.next = next

    def length(self) -> int:
        head = self
        count: int = 0
        while head:
            count += 1
            head = head.next
        return count

    def __str__(self) -> str:
        res = []
        current = self
        while current:
            res.append(str(current.value))
            current = current.next
        return " -> ".join(res)


T = TypeVar("T")
U = TypeVar("U")
V = TypeVar("V")


class Utils(DataGenerators):
    @staticmethod
    def flatten_list(nested_list: List[List[int]]) -> List[int]:
        """Flattens a nested list of integers."""
        return [item for sublist in nested_list for item in sublist]

    @staticmethod
    def invert_dict(d: Dict[int, int]) -> Dict[int, int]:
        """Inverts a dictionary (keys become values and values become keys)."""
        return {v: k for k, v in d.items()}

    @staticmethod
    def random_string(length: int) -> str:
        """Generates a random string of a given length."""
        return "".join(random.choices(string.ascii_lowercase, k=length))

    @staticmethod
    def prime_numbers(n: int) -> List[int]:
        """Generates a list of the first n prime numbers."""
        primes = []
        candidate = 2
        while len(primes) < n:
            for prime in primes:
                if candidate % prime == 0:
                    break
            else:
                primes.append(candidate)
            candidate += 1
        return primes

    @staticmethod
    def fibonacci(n: int) -> List[int]:
        """Generates a list of the first n Fibonacci numbers."""
        fibs = [0, 1]
        for _ in range(2, n):
            fibs.append(fibs[-1] + fibs[-2])
        return fibs[:n]

    @staticmethod
    def is_palindrome(s: str) -> bool:
        """Checks if a string is a palindrome."""
        return s == s[::-1]

    @staticmethod
    def is_anagram(s: str, t: str) -> bool:
        """Checks if two strings are anagrams of each other."""
        return Counter(s) == Counter(t)

    @staticmethod
    def is_prime(n: int) -> bool:
        """Checks if a number is prime."""
        if n == 1:
            return False
        for i in range(2, int(n**0.5) + 1):
            if n % i == 0:
                return False
        return True

    @staticmethod
    def is_power_of_two(n: int) -> bool:
        """Checks if a number is a power of two."""
        return n > 0 and n & (n - 1) == 0

    @staticmethod
    def is_power_of_three(n: int) -> bool:
        """Checks if a number is a power of three."""
        return n > 0 and 3**19 % n == 0

    @staticmethod
    def subsets_brute(nums: List[Any]) -> List[List[Any]]:
        result: List[List[Any]] = []
        for i in range(1 << len(nums)):
            subset: List[Any] = []
            for j in range(len(nums)):
                if i & (1 << j):
                    subset.append(nums[j])
            result.append(subset)
        return result

    @staticmethod
    def subsets_optimal(list1: List[int]) -> List[List[int]]:
        result = [[]]
        for num in list1:
            result += [i + [num] for i in result]
        return result

    @staticmethod
    def find_middle_node(head: SinglyLinkedListNode) -> int:
        """
        Write a function find_middle_node() that takes in the head of a
        linked list and returns the "middle" node.

        - If the linked list has an even length and there are two "middle" nodes, return the first middle node.
        - (E.g., "1 -> 2 -> 3 -> 4" would return 2, not 3.)
        """
        if not head:
            return head
        slow = head
        fast = head
        while fast and fast.next:
            slow = slow.next
            fast = fast.next.next
        return slow.value

    @staticmethod
    def gcd(a: int, b: int) -> int:
        """Finds the greatest common divisor of two numbers."""
        while b:
            a, b = b, a % b
        return a

    @staticmethod
    def lcm(a: int, b: int) -> int:
        """Finds the least common multiple of two numbers."""
        return abs(a * b) // Utils.gcd(a, b)

    @staticmethod
    def binary_search(arr: List[int], target: int) -> int:
        """Performs binary search on a sorted array."""
        left, right = 0, len(arr) - 1
        while left <= right:
            mid = (left + right) // 2
            if arr[mid] == target:
                return mid
            elif arr[mid] < target:
                left = mid + 1
            else:
                right = mid - 1
        return -1

    @staticmethod
    def merge_sorted_lists(list1: List[int], list2: List[int]) -> List[int]:
        """Merges two sorted lists into a single sorted list."""
        result = []
        i = j = 0
        while i < len(list1) and j < len(list2):
            if list1[i] <= list2[j]:
                result.append(list1[i])
                i += 1
            else:
                result.append(list2[j])
                j += 1
        result.extend(list1[i:])
        result.extend(list2[j:])
        return result

    @staticmethod
    def count_inversions(arr: List[int]) -> int:
        """Counts the number of inversions in an array."""

        def merge_sort(arr: List[int]) -> Tuple[List[int], int]:
            if len(arr) <= 1:
                return arr, 0

            mid = len(arr) // 2
            left, left_inv = merge_sort(arr[:mid])
            right, right_inv = merge_sort(arr[mid:])
            merged, split_inv = merge_and_count(left, right)
            return merged, left_inv + right_inv + split_inv

        def merge_and_count(left: List[int], right: List[int]) -> Tuple[List[int], int]:
            result = []
            inversions = 0
            i = j = 0
            while i < len(left) and j < len(right):
                if left[i] <= right[j]:
                    result.append(left[i])
                    i += 1
                else:
                    result.append(right[j])
                    inversions += len(left) - i
                    j += 1
            result.extend(left[i:])
            result.extend(right[j:])
            return result, inversions

        _, inversions = merge_sort(arr)
        return inversions

    @staticmethod
    def longest_common_subsequence(text1: str, text2: str) -> str:
        """Finds the longest common subsequence of two strings."""
        m, n = len(text1), len(text2)
        dp = [[0] * (n + 1) for _ in range(m + 1)]

        # Fill the dp table
        for i in range(1, m + 1):
            for j in range(1, n + 1):
                if text1[i - 1] == text2[j - 1]:
                    dp[i][j] = dp[i - 1][j - 1] + 1
                else:
                    dp[i][j] = max(dp[i - 1][j], dp[i][j - 1])

        # Reconstruct the LCS
        lcs = []
        i, j = m, n
        while i > 0 and j > 0:
            if text1[i - 1] == text2[j - 1]:
                lcs.append(text1[i - 1])
                i -= 1
                j -= 1
            elif dp[i - 1][j] > dp[i][j - 1]:
                i -= 1
            else:
                j -= 1

        return "".join(reversed(lcs))

    @staticmethod
    def matrix_multiply(A: List[List[int]], B: List[List[int]]) -> List[List[int]]:
        """Multiplies two matrices."""
        if not A or not B or len(A[0]) != len(B):
            raise ValueError("Invalid matrix dimensions for multiplication")

        result = [[0] * len(B[0]) for _ in range(len(A))]
        for i in range(len(A)):
            for j in range(len(B[0])):
                for k in range(len(B)):
                    result[i][j] += A[i][k] * B[k][j]
        return result

    @staticmethod
    def is_valid_parentheses(s: str) -> bool:
        """Checks if a string of parentheses is valid."""
        stack = []
        pairs = {")": "(", "}": "{", "]": "["}
        for char in s:
            if char in "({[":
                stack.append(char)
            elif char in ")}]":
                if not stack or stack.pop() != pairs[char]:
                    return False
        return len(stack) == 0

    @staticmethod
    def longest_palindromic_substring(s: str) -> str:
        """Finds the longest palindromic substring in a string."""
        if not s:
            return ""

        def expand_around_center(left: int, right: int) -> int:
            while left >= 0 and right < len(s) and s[left] == s[right]:
                left -= 1
                right += 1
            return right - left - 1

        start = end = 0
        for i in range(len(s)):
            len1 = expand_around_center(i, i)
            len2 = expand_around_center(i, i + 1)
            max_len = max(len1, len2)
            if max_len > end - start:
                start = i - (max_len - 1) // 2
                end = i + max_len // 2

        return s[start : end + 1]
