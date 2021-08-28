class Queue {
  // types
  front: number;
  end: number;
  storage: Record<number, any>

  // a line has a front and an end
  // we remove from the front and add to the end
  // store all queue elements in storage and maintain front and end pointers
  constructor() {
    this.front = 0;
    this.end = 0;
    this.storage = {};
  }

  enqueue(value: any) {
    if (!this.end) {
      this.storage[1] = value;
      this.end = 1;
      this.front = 1;
      return;
    }

    this.end++;
    this.storage[this.end] = value;
  }

  dequeue() {
    const value = this.storage[this.front];
    delete this.storage[this.front];
    if (this.front === this.end) {
      this.front = 0;
      this.end = 0;
      return value;
    }
    this.front++;
    return value;
  }

  size() {
    if (this.end === 0) return 0;
    return this.end - this.front + 1;
  }

}

export default Queue;
