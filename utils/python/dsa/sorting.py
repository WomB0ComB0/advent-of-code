from typing import List, Any, Union
from helpers import partition
import bisect

test = bisect.bisect_left


class Sorting:
    def __init__(self) -> None:
        pass

    def binarySearch(
        self, array: List[int], x: int, low: int, high: int
    ) -> Union[List[int], int]:  # Binary Search
        # Repeat until the pointers low and high meet each other
        while low <= high:
            mid = low + (high - low) // 2
            if array[mid] == x:
                return [mid, array[mid]]
            elif array[mid] < x:
                low = mid + 1
            else:
                high = mid - 1
        return -1  # This means the element is not present in the array

    def binarySearchRec(
        self, array: List[int], x: int, low: int, high: int
    ) -> list[int]:
        if high >= low:
            mid = low + (high - low) // 2
            if array[mid] == x:
                return [mid, array[mid]]
            elif array[mid] > x:
                return self.binarySearchRec(array, x, low, mid - 1)
            else:
                return self.binarySearchRec(array, x, mid + 1, high)
        else:
            return -1

    def bubbleSort(self, array: List[Any]):  # function to implement bubble sort
        # loop through each element of array
        for i in range(len(array)):
            # keep track of swapping
            swapped = False
            # loop to compare array elements
            for j in range(0, len(array) - i - 1):
                # compare two adjacent elements change > to < to sort in descending order
                if array[j] > array[j + 1]:
                    # swapping occurs if elements are not in the intended order
                    temp = array[j]
                    array[j] = array[j + 1]
                    array[j + 1] = temp
                    swapped = True
            # no swapping means the array is already sorted, so no need for further comparison
            if not swapped:
                break
        return array

    def bucketSort(self, array: List[Any]):  # Function to sort using bucket sort
        bucket = []
        # Create empty buckets
        for i in range(len(array)):
            bucket.append([])
        # Insert elements into their respective buckets
        for j in array:
            index_b = int(10 * j)
            bucket[index_b].append(j)
        # Sort the elements of each bucket
        for i in range(len(array)):
            bucket[i] = sorted(bucket[i])
        # Get the sorted elements
        k = 0
        for i in range(len(array)):
            for j in range(len(bucket[i])):
                array[k] = bucket[i][j]
                k += 1
        return array

    def countingSort(self, array: List[Any]):  # Counting sort function
        size = len(array)
        output = [0] * size
        # Initialize count array
        count = [0] * 10
        # Store the count of each elements in count array
        for i in range(0, size):
            count[array[i]] += 1
        # Store the cummulative count
        for i in range(1, 10):
            count[i] += count[i - 1]
        # Find the index of each element of the original array in count array
        # place the elements in output array
        i = size - 1
        while i >= 0:
            output[count[array[i]] - 1] = array[i]
            count[array[i]] -= 1
            i -= 1
        # Copy the sorted elements into original array
        for i in range(0, size):
            array[i] = output[i]
        return array

    def heapify(self, arr: List[Any], n: int, i: int):  # Function to heapify the tree
        # Find largest among root and children
        largest = i
        l = 2 * i + 1
        r = 2 * i + 2
        if l < n and arr[i] < arr[l]:
            largest = l
        if r < n and arr[largest] < arr[r]:
            largest = r
        # If root is not largest, swap with largest and continue heapifying
        if largest != i:
            arr[i], arr[largest] = arr[largest], arr[i]
            self.heapify(arr, n, largest)
        return arr

    def heapSort(self, arr: List[Any]):  # Function to sort the array
        n = len(arr)
        # Build max heap
        for i in range(n // 2, -1, -1):
            self.heapify(arr, n, i)
        for i in range(n - 1, 0, -1):
            # Swap
            arr[i], arr[0] = arr[0], arr[i]
            # Heapify root element
            self.heapify(arr, i, 0)
        return arr

    def insertionSort(self, array: List[Any]):  # Function to do insertion sort
        for step in range(1, len(array)):
            key = array[step]
            j = step - 1
            # Compare key with each element on the left of it until an element smaller than it is found
            # For descending order, change key<array[j] to key>array[j].
            while j >= 0 and key < array[j]:
                array[j + 1] = array[j]
                j = j - 1
            # Place key at after the element just smaller than it.
            array[j + 1] = key
        return array

    def linearSearch(
        self, array: List[Any], n: int, x: int
    ):  # Function to implement Linear Search
        for i in range(0, n):
            if array[i] == x:
                return i
        return -1

    def mergeSort(self, array: List[Any]):  #  function to implement merge sort
        if len(array) > 1:
            #  r is the point where the array is divided into two subarrays
            r = len(array) // 2
            L = array[:r]
            M = array[r:]
            # Sort the two halves
            self.mergeSort(L)
            self.mergeSort(M)

            i = j = k = 0
            # Until we reach either end of either L or M, pick larger among
            # elements L and M and place them in the correct position at A[p..r]
            while i < len(L) and j < len(M):
                if L[i] < M[j]:
                    array[k] = L[i]
                    i += 1
                else:
                    array[k] = M[j]
                    j += 1
                k += 1
            # When we run out of elements in either L or M,
            # pick up the remaining elements and put in A[p..r]
            while i < len(L):
                array[k] = L[i]
                i += 1
                k += 1
            while j < len(M):
                array[k] = M[j]
                j += 1
                k += 1
        return array

    def quickSort(
        self, array: List[Any], low: int, high: int
    ):  # function to perform quicksort
        if low < high:
            # find pivot element such that
            # element smaller than pivot are on the left
            # element greater than pivot are on the right
            pi = partition(array, low, high)
            # recursive call on the left of pivot
            self.quickSort(array, low, pi - 1)
            # recursive call on the right of pivot
            self.quickSort(array, pi + 1, high)
        return array

    def radixSort(self, array: List[Any]):  # Main function to implement radix sort
        # Get maximum element
        def countingSort(
            array, place
        ):  # Using counting sort to sort the elements in the basis of significant places
            size = len(array)
            output = [0] * size
            count = [0] * 10
            # Calculate count of elements
            for i in range(0, size):
                index = array[i] // place
                count[index % 10] += 1
            # Calculate cumulative count
            for i in range(1, 10):
                count[i] += count[i - 1]
            # Place the elements in sorted order
            i = size - 1
            while i >= 0:
                index = array[i] // place
                output[count[index % 10] - 1] = array[i]
                count[index % 10] -= 1
                i -= 1
            for i in range(0, size):
                array[i] = output[i]
            return array

        max_element = max(array)
        # Apply counting sort to sort elements based on place value.
        place = 1
        while max_element // place > 0:
            countingSort(array, place)
            place *= 10
        return array

    def selectionSort(
        self, array: List[Any], size: int
    ):  # function to swap elements at the given index values
        for step in range(size):
            min_idx = step
            for i in range(step + 1, size):
                # to sort in descending order, change > to < in this line select the minimum element in each loop
                if array[i] < array[min_idx]:
                    min_idx = i
            # put min at the correct position
            (array[step], array[min_idx]) = (array[min_idx], array[step])
        return array

    def shellSort(self, array: List[Any], n: int):
        # Rearrange elements at each n/2, n/4, n/8, ... intervals
        interval = n // 2
        while interval > 0:
            for i in range(interval, n):
                temp = array[i]
                j = i
                while j >= interval and array[j - interval] > temp:
                    array[j] = array[j - interval]
                    j -= interval
                array[j] = temp
            interval //= 2
        return array
