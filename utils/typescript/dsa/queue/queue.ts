class Queue {
  items: Record<number, any>;
  frontIndex: number;
  backIndex: number;

  constructor() {
    this.items = {};
    this.frontIndex = 0;
    this.backIndex = 0;
  }

  enqueue(element) {
    const item = (this.items[this.backIndex] = element);
    this.backIndex++;
    return item + ' inserted';
  }

  dequeue() {
    const item = this.items[this.frontIndex];
    delete this.items[this.frontIndex];
    this.frontIndex++;
    return item + ' removed';
  }

  peek() {
    return this.items[this.frontIndex];
  }

  get printQueue() {
    return this.items;
  }

  get isEmpty() {
    return this.frontIndex === this.backIndex;
  }
}

export { Queue };
