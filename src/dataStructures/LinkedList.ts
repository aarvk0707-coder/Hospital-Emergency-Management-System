/**
 * Dynamic Linked List Implementation for Hospital Emergency Management System
 * Stores patient records dynamically with simulated pointer memory addresses.
 */

export class LinkedListNode<T extends { id: string }> {
  public data: T;
  public next: LinkedListNode<T> | null = null;
  public prev: LinkedListNode<T> | null = null;
  public memoryAddress: string;

  constructor(data: T, memoryAddress?: string) {
    this.data = data;
    // Generate a pseudo 16-bit hex memory address if not provided
    this.memoryAddress = memoryAddress || `0x${Math.floor(0x1000 + Math.random() * 0xefff).toString(16).toUpperCase()}`;
  }
}

export interface NodeMemoryView<T> {
  address: string;
  nextAddress: string | null;
  prevAddress: string | null;
  index: number;
  data: T;
}

export class DynamicLinkedList<T extends { id: string }> {
  private head: LinkedListNode<T> | null = null;
  private tail: LinkedListNode<T> | null = null;
  private count: number = 0;

  constructor(initialItems: T[] = []) {
    for (const item of initialItems) {
      this.insertTail(item);
    }
  }

  /**
   * Insert at the end of the list (O(1))
   */
  public insertTail(item: T, memoryAddress?: string): LinkedListNode<T> {
    const newNode = new LinkedListNode<T>(item, memoryAddress);
    if (!this.head || !this.tail) {
      this.head = newNode;
      this.tail = newNode;
    } else {
      newNode.prev = this.tail;
      this.tail.next = newNode;
      this.tail = newNode;
    }
    this.count++;
    return newNode;
  }

  /**
   * Insert at the beginning of the list (O(1))
   */
  public insertHead(item: T, memoryAddress?: string): LinkedListNode<T> {
    const newNode = new LinkedListNode<T>(item, memoryAddress);
    if (!this.head || !this.tail) {
      this.head = newNode;
      this.tail = newNode;
    } else {
      newNode.next = this.head;
      this.head.prev = newNode;
      this.head = newNode;
    }
    this.count++;
    return newNode;
  }

  /**
   * Find node by patient ID (O(n))
   */
  public findById(id: string): LinkedListNode<T> | null {
    let current = this.head;
    while (current) {
      if (current.data.id === id) {
        return current;
      }
      current = current.next;
    }
    return null;
  }

  /**
   * Update data of an existing node by ID
   */
  public updateById(id: string, updater: (prev: T) => T): boolean {
    const node = this.findById(id);
    if (!node) return false;
    node.data = updater(node.data);
    return true;
  }

  /**
   * Delete node by ID (O(n) search, O(1) pointer rewire)
   */
  public deleteById(id: string): T | null {
    let current = this.head;
    while (current) {
      if (current.data.id === id) {
        // Rewire pointers
        if (current.prev) {
          current.prev.next = current.next;
        } else {
          this.head = current.next;
        }

        if (current.next) {
          current.next.prev = current.prev;
        } else {
          this.tail = current.prev;
        }

        this.count--;
        current.next = null;
        current.prev = null;
        return current.data;
      }
      current = current.next;
    }
    return null;
  }

  /**
   * Linear search by condition (O(n))
   */
  public search(predicate: (item: T) => boolean): T[] {
    const results: T[] = [];
    let current = this.head;
    while (current) {
      if (predicate(current.data)) {
        results.push(current.data);
      }
      current = current.next;
    }
    return results;
  }

  /**
   * Traverse and return array of all items in list order (O(n))
   */
  public toArray(): T[] {
    const items: T[] = [];
    let current = this.head;
    while (current) {
      items.push(current.data);
      current = current.next;
    }
    return items;
  }

  /**
   * Get memory snapshot of nodes for pointer visualizer
   */
  public getMemorySnapshot(): NodeMemoryView<T>[] {
    const snapshot: NodeMemoryView<T>[] = [];
    let current = this.head;
    let index = 0;
    while (current) {
      snapshot.push({
        address: current.memoryAddress,
        nextAddress: current.next ? current.next.memoryAddress : null,
        prevAddress: current.prev ? current.prev.memoryAddress : null,
        index,
        data: current.data,
      });
      current = current.next;
      index++;
    }
    return snapshot;
  }

  public getHead(): LinkedListNode<T> | null {
    return this.head;
  }

  public getTail(): LinkedListNode<T> | null {
    return this.tail;
  }

  public size(): number {
    return this.count;
  }

  public isEmpty(): boolean {
    return this.count === 0;
  }

  public clear(): void {
    this.head = null;
    this.tail = null;
    this.count = 0;
  }
}
