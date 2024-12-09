class PriorityQueue {
  heap: number[];

  constructor() {
    this.heap = [];
  }

  getLeftChildrenIndex(parentIndex: number) {
    return 2 * parentIndex + 1;
  }

  getRightChildrenIndex(parentIndex: number) {
    return 2 * parentIndex + 2;
  }

  getParentIndex(childIndex: number) {
    return Math.floor((childIndex - 1) / 2);
  }

  hasParent(childIndex: number) {
    return this.getParentIndex(childIndex) >= 0;
  }

  hasLeftChild(parentIndex: number) {
    return this.getLeftChildrenIndex(parentIndex) < this.heap.length;
  }

  hasRightChild(parentIndex: number) {
    return this.getRightChildrenIndex(parentIndex) < this.heap.length;
  }

  leftChild(parentIndex: number) {
    return this.heap[this.getLeftChildrenIndex(parentIndex)];
  }

  rightChild(parentIndex: number) {
    return this.heap[this.getRightChildrenIndex(parentIndex)];
  }

  parent(childIndex: number) {
    return this.heap[this.getParentIndex(childIndex)];
  }

  swap(indexOne: number, indexTwo: number) {
    const temp = this.heap[indexOne];
    this.heap[indexOne] = this.heap[indexTwo];
    this.heap[indexTwo] = temp;
  }

  peek() {
    if (this.heap.length == 0) return null;
    return this.heap[0];
  }

  remove() {
    if (this.heap.length == 0) return null;
    const item = this.heap[0];
    this.heap[0] = this.heap.pop();
    this.heapifyDown();
    return item;
  }

  add(item: number) {
    this.heap.push(item);
    this.heapifyUp();
  }

  heapifyUp() {
    let index = this.heap.length - 1;
    while (this.hasParent(index) && this.parent(index) > this.heap[index]) {
      this.swap(this.getParentIndex(index), index);
      index = this.getParentIndex(index);
    }
  }

  heapifyDown() {
    let index = 0;
    while (this.hasLeftChild(index)) {
      let smallerChildIndex = this.getLeftChildrenIndex(index);
      if (this.hasRightChild(index) && this.rightChild(index) < this.leftChild(index)) {
        smallerChildIndex = this.getRightChildrenIndex(index);
      }

      if (this.heap[index] < this.heap[smallerChildIndex]) {
        break;
      } else {
        this.swap(index, smallerChildIndex);
      }
      index = smallerChildIndex;
    }
  }
}

export { PriorityQueue };
