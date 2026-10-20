import { PatientRecord, TriageLevel } from '../types/ems';

/**
 * Hospital Emergency Priority Queue Implementation
 * 
 * Clinical Rule:
 * 1. Emergency Cases (ESI Level 1, 2, 3) are handled FIRST.
 *    - Priority 1 (Resuscitation) > Priority 2 (Emergent) > Priority 3 (Urgent)
 *    - For identical emergency priority, FIFO order is enforced by arrivalTime.
 * 2. Normal Cases (ESI Level 4 Less Urgent, Level 5 Non-Urgent) are handled AFTER all emergencies.
 *    - Normal cases follow strict FIFO order based on arrivalTime.
 */
export class EmergencyPriorityQueue {
  private heap: PatientRecord[] = [];

  constructor(initialPatients: PatientRecord[] = []) {
    for (const p of initialPatients) {
      this.enqueue(p);
    }
  }

  /**
   * Comparator defining priority queue ordering:
   * Returns < 0 if a should be served before b
   * Returns > 0 if b should be served before a
   */
  public static compare(a: PatientRecord, b: PatientRecord): number {
    // 1. Emergency vs Normal
    if (a.isEmergency && !b.isEmergency) return -1;
    if (!a.isEmergency && b.isEmergency) return 1;

    // 2. Both are Emergency
    if (a.isEmergency && b.isEmergency) {
      if (a.triageLevel !== b.triageLevel) {
        return a.triageLevel - b.triageLevel; // Lower number = higher medical urgency (1 > 2 > 3)
      }
      // Same emergency tier: FIFO tie-breaker
      return a.arrivalTime - b.arrivalTime;
    }

    // 3. Both are Normal: Follow strict FIFO order (arrival time)
    return a.arrivalTime - b.arrivalTime;
  }

  /**
   * Enqueue a patient into the priority queue (O(log n))
   */
  public enqueue(patient: PatientRecord): void {
    this.heap.push(patient);
    this.siftUp(this.heap.length - 1);
  }

  /**
   * Dequeue the highest priority patient (O(log n))
   */
  public dequeue(): PatientRecord | null {
    if (this.heap.length === 0) return null;
    if (this.heap.length === 1) return this.heap.pop()!;

    const top = this.heap[0];
    this.heap[0] = this.heap.pop()!;
    this.siftDown(0);
    return top;
  }

  /**
   * Peek at highest priority patient without removing (O(1))
   */
  public peek(): PatientRecord | null {
    return this.heap.length > 0 ? this.heap[0] : null;
  }

  /**
   * Remove patient by ID (e.g. if transferred or left without being seen)
   */
  public removeById(id: string): PatientRecord | null {
    const index = this.heap.findIndex((p) => p.id === id);
    if (index === -1) return null;

    const removed = this.heap[index];
    const last = this.heap.pop()!;
    if (index < this.heap.length) {
      this.heap[index] = last;
      this.siftUp(index);
      this.siftDown(index);
    }
    return removed;
  }

  /**
   * Re-triage patient with a new triage level and update queue position
   */
  public updatePriority(id: string, newLevel: TriageLevel): boolean {
    const index = this.heap.findIndex((p) => p.id === id);
    if (index === -1) return false;

    const isEmergency = newLevel <= 3;
    this.heap[index].triageLevel = newLevel;
    this.heap[index].isEmergency = isEmergency;

    this.siftUp(index);
    this.siftDown(index);
    return true;
  }

  /**
   * Return a sorted copy of all waiting patients according to priority
   */
  public getSortedQueue(): PatientRecord[] {
    return [...this.heap].sort(EmergencyPriorityQueue.compare);
  }

  public size(): number {
    return this.heap.length;
  }

  public isEmpty(): boolean {
    return this.heap.length === 0;
  }

  public clear(): void {
    this.heap = [];
  }

  public getEmergencyCount(): number {
    return this.heap.filter((p) => p.isEmergency).length;
  }

  public getNormalCount(): number {
    return this.heap.filter((p) => !p.isEmergency).length;
  }

  // --- Internal Min-Heap Operations ---

  private siftUp(index: number): void {
    let current = index;
    while (current > 0) {
      const parent = Math.floor((current - 1) / 2);
      if (EmergencyPriorityQueue.compare(this.heap[current], this.heap[parent]) < 0) {
        this.swap(current, parent);
        current = parent;
      } else {
        break;
      }
    }
  }

  private siftDown(index: number): void {
    let current = index;
    const length = this.heap.length;

    while (true) {
      let candidate = current;
      const left = 2 * current + 1;
      const right = 2 * current + 2;

      if (left < length && EmergencyPriorityQueue.compare(this.heap[left], this.heap[candidate]) < 0) {
        candidate = left;
      }
      if (right < length && EmergencyPriorityQueue.compare(this.heap[right], this.heap[candidate]) < 0) {
        candidate = right;
      }

      if (candidate !== current) {
        this.swap(current, candidate);
        current = candidate;
      } else {
        break;
      }
    }
  }

  private swap(i: number, j: number): void {
    const temp = this.heap[i];
    this.heap[i] = this.heap[j];
    this.heap[j] = temp;
  }
}
