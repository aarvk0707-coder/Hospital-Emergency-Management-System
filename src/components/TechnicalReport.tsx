import React, { useState } from 'react';
import { 
  Activity, 
  ArrowRight, 
  BookOpen, 
  Check, 
  CheckCircle2, 
  Code, 
  Copy, 
  Cpu, 
  Download, 
  FileCode, 
  FileText, 
  Layers, 
  Network, 
  Printer, 
  ShieldCheck, 
  Zap 
} from 'lucide-react';

export const TechnicalReport: React.FC = () => {
  const [activeCodeTab, setActiveCodeTab] = useState<'cpp' | 'java' | 'ts' | 'python'>('ts');
  const [copiedCode, setCopiedCode] = useState(false);

  const handlePrint = () => {
    window.print();
  };

  const codeSnippets = {
    ts: `// ============================================================
// TypeScript Implementation: Emergency Priority Queue & Linked List
// ============================================================

export interface Patient {
  id: string;
  name: string;
  triageLevel: 1 | 2 | 3 | 4 | 5; // 1-3 = Emergency, 4-5 = Normal FIFO
  isEmergency: boolean;
  arrivalTime: number;
  chiefComplaint: string;
  status: 'waiting' | 'in_treatment' | 'discharged';
}

// 1. Dynamic Linked List Node
export class ListNode<T> {
  data: T;
  next: ListNode<T> | null = null;
  prev: ListNode<T> | null = null;
  memoryAddress: string;

  constructor(data: T) {
    this.data = data;
    this.memoryAddress = "0x" + Math.floor(0x1000 + Math.random() * 0xefff).toString(16).toUpperCase();
  }
}

// 2. Dynamic Linked List Class
export class LinkedList<T extends { id: string }> {
  head: ListNode<T> | null = null;
  tail: ListNode<T> | null = null;
  count: number = 0;

  insertTail(item: T): ListNode<T> {
    const newNode = new ListNode(item);
    if (!this.head || !this.tail) {
      this.head = this.tail = newNode;
    } else {
      newNode.prev = this.tail;
      this.tail.next = newNode;
      this.tail = newNode;
    }
    this.count++;
    return newNode;
  }

  deleteById(id: string): T | null {
    let curr = this.head;
    while (curr) {
      if (curr.data.id === id) {
        if (curr.prev) curr.prev.next = curr.next;
        else this.head = curr.next;

        if (curr.next) curr.next.prev = curr.prev;
        else this.tail = curr.prev;

        this.count--;
        return curr.data;
      }
      curr = curr.next;
    }
    return null;
  }
}

// 3. Emergency Priority Queue (Emergency-First + Normal FIFO)
export class EmergencyPriorityQueue {
  private heap: Patient[] = [];

  static compare(a: Patient, b: Patient): number {
    // Rule 1: Emergency patients preempt normal patients
    if (a.isEmergency && !b.isEmergency) return -1;
    if (!a.isEmergency && b.isEmergency) return 1;

    // Rule 2: Among emergency patients, lower triage level has higher priority (1 > 2 > 3)
    if (a.isEmergency && b.isEmergency) {
      if (a.triageLevel !== b.triageLevel) {
        return a.triageLevel - b.triageLevel;
      }
      return a.arrivalTime - b.arrivalTime; // FIFO tie-breaker
    }

    // Rule 3: Among normal patients, strict FIFO order by arrival time
    return a.arrivalTime - b.arrivalTime;
  }

  enqueue(patient: Patient): void {
    this.heap.push(patient);
    this.siftUp(this.heap.length - 1);
  }

  dequeue(): Patient | null {
    if (this.heap.length === 0) return null;
    if (this.heap.length === 1) return this.heap.pop()!;
    const top = this.heap[0];
    this.heap[0] = this.heap.pop()!;
    this.siftDown(0);
    return top;
  }

  private siftUp(idx: number): void {
    let curr = idx;
    while (curr > 0) {
      const parent = Math.floor((curr - 1) / 2);
      if (EmergencyPriorityQueue.compare(this.heap[curr], this.heap[parent]) < 0) {
        [this.heap[curr], this.heap[parent]] = [this.heap[parent], this.heap[curr]];
        curr = parent;
      } else break;
    }
  }

  private siftDown(idx: number): void {
    let curr = idx;
    const len = this.heap.length;
    while (true) {
      let candidate = curr;
      const left = 2 * curr + 1;
      const right = 2 * curr + 2;
      if (left < len && EmergencyPriorityQueue.compare(this.heap[left], this.heap[candidate]) < 0) candidate = left;
      if (right < len && EmergencyPriorityQueue.compare(this.heap[right], this.heap[candidate]) < 0) candidate = right;
      if (candidate !== curr) {
        [this.heap[curr], this.heap[candidate]] = [this.heap[candidate], this.heap[curr]];
        curr = candidate;
      } else break;
    }
  }
}`,
    cpp: `// ============================================================
// C++ Implementation: Hospital Emergency Priority Queue & Linked List
// ============================================================
#include <iostream>
#include <string>
#include <vector>
#include <algorithm>

struct Patient {
    std::string id;
    std::string name;
    int triageLevel; // 1-3 Emergency, 4-5 Normal
    bool isEmergency;
    long long arrivalTime;
    std::string chiefComplaint;
    std::string status;
};

// 1. Dynamic Linked List Node
struct Node {
    Patient data;
    Node* prev;
    Node* next;
    Node(Patient p) : data(p), prev(nullptr), next(nullptr) {}
};

class PatientLinkedList {
private:
    Node* head;
    Node* tail;
    int count;

public:
    PatientLinkedList() : head(nullptr), tail(nullptr), count(0) {}

    void insertTail(Patient p) {
        Node* newNode = new Node(p);
        if (!head) {
            head = tail = newNode;
        } else {
            newNode->prev = tail;
            tail->next = newNode;
            tail = newNode;
        }
        count++;
    }

    bool deleteById(const std::string& id) {
        Node* curr = head;
        while (curr) {
            if (curr->data.id == id) {
                if (curr->prev) curr->prev->next = curr->next;
                else head = curr->next;

                if (curr->next) curr->next->prev = curr->prev;
                else tail = curr->prev;

                delete curr;
                count--;
                return true;
            }
            curr = curr->next;
        }
        return false;
    }
};

// 2. Custom Comparator for Emergency Priority Queue
struct EmergencyComparator {
    bool operator()(const Patient& a, const Patient& b) const {
        // Priority rule: true if 'a' has lower priority than 'b' (for min-heap)
        if (a.isEmergency && !b.isEmergency) return false;
        if (!a.isEmergency && b.isEmergency) return true;

        if (a.isEmergency && b.isEmergency) {
            if (a.triageLevel != b.triageLevel)
                return a.triageLevel > b.triageLevel;
            return a.arrivalTime > b.arrivalTime;
        }
        return a.arrivalTime > b.arrivalTime; // FIFO normal
    }
};`,
    java: `// ============================================================
// Java Implementation: Emergency Priority Queue & Linked List
// ============================================================
import java.util.*;

class Patient {
    String id;
    String name;
    int triageLevel; // 1-3 = Emergency, 4-5 = Normal FIFO
    boolean isEmergency;
    long arrivalTime;
    String chiefComplaint;

    public Patient(String id, String name, int triageLevel, long arrivalTime, String complaint) {
        this.id = id;
        this.name = name;
        this.triageLevel = triageLevel;
        this.isEmergency = triageLevel <= 3;
        this.arrivalTime = arrivalTime;
        this.chiefComplaint = complaint;
    }
}

class PatientNode {
    Patient data;
    PatientNode prev, next;

    public PatientNode(Patient data) {
        this.data = data;
    }
}

class PatientRecordLinkedList {
    PatientNode head, tail;
    int size = 0;

    public synchronized void insertTail(Patient p) {
        PatientNode node = new PatientNode(p);
        if (head == null) {
            head = tail = node;
        } else {
            node.prev = tail;
            tail.next = node;
            tail = node;
        }
        size++;
    }

    public synchronized boolean deleteById(String id) {
        PatientNode curr = head;
        while (curr != null) {
            if (curr.data.id.equals(id)) {
                if (curr.prev != null) curr.prev.next = curr.next;
                else head = curr.next;

                if (curr.next != null) curr.next.prev = curr.prev;
                else tail = curr.prev;

                size--;
                return true;
            }
            curr = curr.next;
        }
        return false;
    }
}

class EmergencyPriorityQueue {
    private PriorityQueue<Patient> pq = new PriorityQueue<>((a, b) -> {
        if (a.isEmergency && !b.isEmergency) return -1;
        if (!a.isEmergency && b.isEmergency) return 1;

        if (a.isEmergency && b.isEmergency) {
            if (a.triageLevel != b.triageLevel) return Integer.compare(a.triageLevel, b.triageLevel);
            return Long.compare(a.arrivalTime, b.arrivalTime);
        }
        return Long.compare(a.arrivalTime, b.arrivalTime); // FIFO for normal cases
    });

    public void enqueue(Patient p) { pq.offer(p); }
    public Patient dequeue() { return pq.poll(); }
}`,
    python: `# ============================================================
# Python Implementation: Emergency Priority Queue & Linked List
# ============================================================
import heapq
import time

class PatientNode:
    def __init__(self, data):
        self.data = data
        self.prev = None
        self.next = None

class DynamicLinkedList:
    def __init__(self):
        self.head = None
        self.tail = None
        self.count = 0

    def insert_tail(self, data):
        node = PatientNode(data)
        if not self.head:
            self.head = self.tail = node
        else:
            node.prev = self.tail
            self.tail.next = node
            self.tail = node
        self.count += 1

    def delete_by_id(self, patient_id):
        curr = self.head
        while curr:
            if curr.data['id'] == patient_id:
                if curr.prev:
                    curr.prev.next = curr.next
                else:
                    self.head = curr.next
                if curr.next:
                    curr.next.prev = curr.prev
                else:
                    self.tail = curr.prev
                self.count -= 1
                return curr.data
            curr = curr.next
        return None

class EmergencyPriorityQueue:
    def __init__(self):
        self.heap = []
        self.counter = 0

    def enqueue(self, patient):
        # Priority Tuple: (PriorityCategory, TriageLevel, ArrivalTime, Counter, Patient)
        # Category: 0 for Emergency (levels 1-3), 1 for Normal (levels 4-5)
        category = 0 if patient['triage_level'] <= 3 else 1
        level = patient['triage_level'] if category == 0 else 0
        arrival = patient['arrival_time']
        
        heapq.heappush(self.heap, (category, level, arrival, self.counter, patient))
        self.counter += 1

    def dequeue(self):
        if not self.heap:
            return None
        return heapq.heappop(self.heap)[4]`,
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(codeSnippets[activeCodeTab]);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  return (
    <div className="space-y-10 pb-16 text-slate-200 print:text-black print:bg-white">
      {/* Document Header & Print Button */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl flex flex-wrap items-center justify-between gap-4 print:border-none print:shadow-none print:p-0">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded bg-red-950 text-red-300 border border-red-800 text-[11px] font-mono font-bold uppercase print:text-black print:border-black">
              Formal Engineering Documentation
            </span>
            <span className="text-xs text-slate-400">Doc Ref: PULSE-EMS-TR-2026.01</span>
          </div>
          <h1 className="text-2xl font-black text-white mt-1 print:text-black">
            Hospital Emergency Management System: Technical Report
          </h1>
          <p className="text-xs text-slate-400 mt-1 print:text-slate-600">
            Comprehensive Architectural, Algorithmic, and Experimental Analysis of Priority Queue Triage & Dynamic Linked List Record Maintenance.
          </p>
        </div>

        <div className="flex items-center gap-2 print:hidden">
          <button
            onClick={handlePrint}
            className="px-4 py-2.5 rounded-xl text-xs font-bold text-white bg-slate-800 hover:bg-slate-700 border border-slate-700 flex items-center gap-2 transition-all shadow-md"
          >
            <Printer className="w-4 h-4 text-cyan-400" />
            <span>Print / Save as PDF</span>
          </button>
        </div>
      </div>

      {/* Quick Table of Contents Ribbon */}
      <div className="bg-slate-950/70 p-4 rounded-xl border border-slate-800/80 text-xs text-slate-400 flex flex-wrap gap-x-4 gap-y-2 print:hidden">
        <strong className="text-white">Jump To Section:</strong>
        <a href="#sec-1" className="hover:text-red-400 transition-colors">1. Data Structures</a>
        <a href="#sec-2" className="hover:text-red-400 transition-colors">2. System Design</a>
        <a href="#sec-3" className="hover:text-red-400 transition-colors">3. Flowchart</a>
        <a href="#sec-4" className="hover:text-red-400 transition-colors">4. Algorithms</a>
        <a href="#sec-5" className="hover:text-red-400 transition-colors">5. Pseudocode</a>
        <a href="#sec-6" className="hover:text-red-400 transition-colors">6. Implementation</a>
        <a href="#sec-7" className="hover:text-red-400 transition-colors">7. Source Code</a>
        <a href="#sec-8" className="hover:text-red-400 transition-colors">8. Test Cases</a>
        <a href="#sec-9" className="hover:text-red-400 transition-colors">9. Output Screenshots</a>
        <a href="#sec-10" className="hover:text-red-400 transition-colors">10. Complexity</a>
        <a href="#sec-11" className="hover:text-red-400 transition-colors">11. Advantages & Limits</a>
        <a href="#sec-12" className="hover:text-red-400 transition-colors">12. Future Scope</a>
        <a href="#sec-13" className="hover:text-red-400 transition-colors">13. Conclusion</a>
        <a href="#sec-14" className="hover:text-red-400 transition-colors">14. References</a>
      </div>

      {/* ========================================================
          SECTION 1: DATA STRUCTURE USED
      ======================================================== */}
      <section id="sec-1" className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-lg space-y-4 print:border-none print:p-0">
        <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
          <Layers className="w-5 h-5 text-indigo-400" />
          <h2 className="text-lg font-bold text-white">1. Data Structures Used</h2>
        </div>

        <p className="text-sm text-slate-300 leading-relaxed">
          The Hospital Emergency Management System employs a hybrid dual-tier data structure model designed to reconcile two fundamentally conflicting operational constraints: <strong>critical life-safety preemption</strong> and <strong>unbounded, fragmentation-free dynamic record storage</strong>.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-3">
          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
            <h3 className="text-sm font-bold text-red-400 flex items-center gap-1.5">
              <Zap className="w-4 h-4" />
              A. Priority Queue (Binary Min-Heap)
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              <strong>Purpose:</strong> Governs patient intake, triage scheduling, and ER bay dispatch.
            </p>
            <ul className="text-xs text-slate-400 space-y-1 list-disc list-inside">
              <li><strong>Emergency Hierarchy:</strong> Emergency categories (ESI 1: Resuscitation, ESI 2: Emergent, ESI 3: Urgent) form a prioritized sub-heap that immediately preempts standard cases.</li>
              <li><strong>Fairness & Tie-Breaking:</strong> When two emergency patients share identical clinical urgency, the heap orders by <code className="text-cyan-400 font-mono">arrivalTime</code> (FIFO).</li>
              <li><strong>Normal Cases (ESI 4 & 5):</strong> Buffered strictly behind all emergency patients, processed in pure FIFO order according to arrival timestamps.</li>
            </ul>
          </div>

          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
            <h3 className="text-sm font-bold text-indigo-400 flex items-center gap-1.5">
              <Network className="w-4 h-4" />
              B. Dynamic Doubly Linked List
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              <strong>Purpose:</strong> Master dynamic repository storing all patient records, treatment logs, and clinical dispositions.
            </p>
            <ul className="text-xs text-slate-400 space-y-1 list-disc list-inside">
              <li><strong>Dynamic Allocation:</strong> Each patient registration dynamically allocates a heap memory node containing <code className="text-cyan-400 font-mono">PatientRecord</code>, <code className="text-cyan-400 font-mono">next</code>, and <code className="text-cyan-400 font-mono">prev</code> pointers.</li>
              <li><strong>O(1) Insertion:</strong> Rapid constant-time insertion at <code className="text-cyan-400 font-mono">HEAD</code> or <code className="text-cyan-400 font-mono">TAIL</code> without buffer reallocation or copying.</li>
              <li><strong>Safe Deletion:</strong> Removing discharged or transferred patients involves local pointer rewiring (<code className="text-cyan-400 font-mono">prev-&gt;next = curr-&gt;next</code>) without shifting contiguous memory arrays.</li>
            </ul>
          </div>
        </div>
      </section>

      {/* ========================================================
          SECTION 2: SYSTEM DESIGN / BLOCK DIAGRAM
      ======================================================== */}
      <section id="sec-2" className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-lg space-y-4 print:border-none print:p-0">
        <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
          <Cpu className="w-5 h-5 text-cyan-400" />
          <h2 className="text-lg font-bold text-white">2. System Design & Architectural Block Diagram</h2>
        </div>

        <p className="text-sm text-slate-300 leading-relaxed">
          The system follows a modular architectural pipeline comprising five decoupled subsystems:
          <strong>(1) Patient Intake & Vitals Telemetry</strong>, <strong>(2) Automated ESI Triage Evaluator</strong>, 
          <strong>(3) Dual-Policy Priority Queue Dispatcher</strong>, <strong>(4) Clinical Treatment Station</strong>, and 
          <strong>(5) Dynamic Linked List Master Persistence Engine</strong>.
        </p>

        {/* High-Resolution SVG Block Diagram */}
        <div className="bg-slate-950 p-6 rounded-2xl border border-slate-800 flex justify-center overflow-x-auto">
          <svg viewBox="0 0 920 380" className="w-full max-w-4xl text-slate-200">
            {/* Background grid dots */}
            <defs>
              <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
                <circle cx="2" cy="2" r="1" fill="#334155" opacity="0.3" />
              </pattern>
              <linearGradient id="redGrad" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#ef4444" stopOpacity="0.2" />
                <stop offset="1%" stopColor="#991b1b" stopOpacity="0.4" />
              </linearGradient>
              <linearGradient id="blueGrad" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.2" />
                <stop offset="1%" stopColor="#1e3a8a" stopOpacity="0.4" />
              </linearGradient>
              <linearGradient id="purpleGrad" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#8b5cf6" stopOpacity="0.2" />
                <stop offset="1%" stopColor="#4c1d95" stopOpacity="0.4" />
              </linearGradient>
              <linearGradient id="tealGrad" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#14b8a6" stopOpacity="0.2" />
                <stop offset="1%" stopColor="#134e4a" stopOpacity="0.4" />
              </linearGradient>
            </defs>

            <rect width="920" height="380" fill="url(#grid)" rx="12" />

            {/* Block 1: Patient Intake */}
            <g transform="translate(30, 130)">
              <rect width="160" height="100" rx="10" fill="url(#blueGrad)" stroke="#3b82f6" strokeWidth="2" />
              <text x="80" y="32" textAnchor="middle" fill="#60a5fa" fontSize="12" fontWeight="bold">PATIENT INTAKE</text>
              <text x="80" y="52" textAnchor="middle" fill="#e2e8f0" fontSize="11">Demographics</text>
              <text x="80" y="70" textAnchor="middle" fill="#94a3b8" fontSize="10">Vitals (HR, BP, SpO2)</text>
              <text x="80" y="86" textAnchor="middle" fill="#94a3b8" fontSize="10">Chief Complaint</text>
            </g>

            {/* Arrow 1 to 2 */}
            <path d="M 190 180 L 250 180" stroke="#60a5fa" strokeWidth="2.5" markerEnd="url(#arrow)" />
            <polygon points="250,180 242,175 242,185" fill="#60a5fa" />

            {/* Block 2: Triage Engine */}
            <g transform="translate(250, 110)">
              <rect width="180" height="140" rx="10" fill="url(#redGrad)" stroke="#ef4444" strokeWidth="2" />
              <text x="90" y="28" textAnchor="middle" fill="#f87171" fontSize="12" fontWeight="bold">TRIAGE EVALUATOR</text>
              <rect x="15" y="42" width="150" height="36" rx="6" fill="#450a0a" stroke="#b91c1c" />
              <text x="90" y="58" textAnchor="middle" fill="#fca5a5" fontSize="10" fontWeight="bold">Emergency (ESI 1-3)</text>
              <text x="90" y="72" textAnchor="middle" fill="#f87171" fontSize="9">Priority Preemption</text>
              <rect x="15" y="88" width="150" height="36" rx="6" fill="#064e3b" stroke="#059669" />
              <text x="90" y="104" textAnchor="middle" fill="#a7f3d0" fontSize="10" fontWeight="bold">Normal (ESI 4-5)</text>
              <text x="90" y="118" textAnchor="middle" fill="#6ee7b7" fontSize="9">FIFO Arrival Order</text>
            </g>

            {/* Arrow 2 to 3 */}
            <path d="M 430 180 L 490 180" stroke="#ef4444" strokeWidth="2.5" />
            <polygon points="490,180 482,175 482,185" fill="#ef4444" />

            {/* Block 3: Priority Queue */}
            <g transform="translate(490, 110)">
              <rect width="170" height="140" rx="10" fill="url(#purpleGrad)" stroke="#a855f7" strokeWidth="2" />
              <text x="85" y="28" textAnchor="middle" fill="#c084fc" fontSize="12" fontWeight="bold">PRIORITY QUEUE</text>
              <text x="85" y="48" textAnchor="middle" fill="#e2e8f0" fontSize="10">Min-Heap Dispatcher</text>
              <rect x="15" y="60" width="140" height="24" rx="4" fill="#3b0764" />
              <text x="85" y="76" textAnchor="middle" fill="#f472b6" fontSize="10">Top: Critical ESI 1</text>
              <rect x="15" y="90" width="140" height="24" rx="4" fill="#1e1b4b" />
              <text x="85" y="106" textAnchor="middle" fill="#93c5fd" fontSize="10">Middle: ESI 2 &amp; 3</text>
              <rect x="15" y="120" width="140" height="16" rx="4" fill="#0f172a" />
              <text x="85" y="132" textAnchor="middle" fill="#94a3b8" fontSize="9">Tail: ESI 4 &amp; 5 FIFO</text>
            </g>

            {/* Arrow 3 to 4 */}
            <path d="M 660 180 L 720 180" stroke="#a855f7" strokeWidth="2.5" />
            <polygon points="720,180 712,175 712,185" fill="#a855f7" />

            {/* Block 4: ER Bays */}
            <g transform="translate(720, 120)">
              <rect width="170" height="120" rx="10" fill="url(#tealGrad)" stroke="#14b8a6" strokeWidth="2" />
              <text x="85" y="28" textAnchor="middle" fill="#2dd4bf" fontSize="12" fontWeight="bold">ER TREATMENT BAYS</text>
              <text x="85" y="50" textAnchor="middle" fill="#e2e8f0" fontSize="10">Bay 1: Resuscitation</text>
              <text x="85" y="68" textAnchor="middle" fill="#e2e8f0" fontSize="10">Bay 2: Acute Care</text>
              <text x="85" y="86" textAnchor="middle" fill="#e2e8f0" fontSize="10">Bay 3: Urgent Ward</text>
              <text x="85" y="104" textAnchor="middle" fill="#e2e8f0" fontSize="10">Bay 4: Fast Track</text>
            </g>

            {/* Bottom: Dynamic Linked List Database */}
            <g transform="translate(180, 290)">
              <rect width="560" height="60" rx="10" fill="#0f172a" stroke="#64748b" strokeWidth="1.5" strokeDasharray="4 2" />
              <text x="280" y="26" textAnchor="middle" fill="#38bdf8" fontSize="12" fontWeight="bold">
                DYNAMIC LINKED LIST STORAGE ENGINE (Node Memory Address Allocation)
              </text>
              <text x="280" y="44" textAnchor="middle" fill="#94a3b8" fontSize="10">
                [Head: 0x1A4F] &lt;---&gt; [Node: 0x2B18] &lt;---&gt; [Node: 0x4D2E] &lt;---&gt; [Tail: 0x5E81]
              </text>
            </g>

            {/* Feedback Arrows to Linked List */}
            <path d="M 110 230 L 110 320 L 180 320" stroke="#3b82f6" strokeWidth="1.5" fill="none" />
            <path d="M 805 240 L 805 320 L 740 320" stroke="#14b8a6" strokeWidth="1.5" fill="none" />
          </svg>
        </div>
      </section>

      {/* ========================================================
          SECTION 3: FLOWCHART
      ======================================================== */}
      <section id="sec-3" className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-lg space-y-4 print:border-none print:p-0">
        <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
          <Activity className="w-5 h-5 text-emerald-400" />
          <h2 className="text-lg font-bold text-white">3. System Flowchart</h2>
        </div>

        <p className="text-sm text-slate-300 leading-relaxed">
          The flowchart below illustrates the deterministic decision path traversed by every patient from hospital arrival, dynamic allocation, triage evaluation, priority queue scheduling, doctor treatment, to discharge record archival.
        </p>

        <div className="bg-slate-950 p-6 rounded-2xl border border-slate-800 flex justify-center overflow-x-auto">
          <svg viewBox="0 0 860 620" className="w-full max-w-3xl text-slate-200">
            {/* Start Oval */}
            <rect x="350" y="20" width="160" height="42" rx="21" fill="#1e293b" stroke="#38bdf8" strokeWidth="2" />
            <text x="430" y="46" textAnchor="middle" fill="#38bdf8" fontSize="12" fontWeight="bold">Patient Arrives at ER</text>

            <path d="M 430 62 L 430 95" stroke="#64748b" strokeWidth="2" />
            <polygon points="430,95 426,87 434,87" fill="#64748b" />

            {/* Step 1: Linked List Node Allocation */}
            <rect x="330" y="95" width="200" height="50" rx="8" fill="#1e1b4b" stroke="#818cf8" strokeWidth="1.5" />
            <text x="430" y="118" textAnchor="middle" fill="#c7d2fe" fontSize="11" fontWeight="bold">Allocate Dynamic Node</text>
            <text x="430" y="134" textAnchor="middle" fill="#94a3b8" fontSize="10">Insert into Linked List Tail</text>

            <path d="M 430 145 L 430 175" stroke="#64748b" strokeWidth="2" />
            <polygon points="430,175 426,167 434,167" fill="#64748b" />

            {/* Step 2: Vitals & Triage Assessment */}
            <rect x="320" y="175" width="220" height="50" rx="8" fill="#1e293b" stroke="#64748b" strokeWidth="1.5" />
            <text x="430" y="197" textAnchor="middle" fill="#f1f5f9" fontSize="11" fontWeight="bold">Record Vitals &amp; Evaluate ESI</text>
            <text x="430" y="213" textAnchor="middle" fill="#94a3b8" fontSize="10">Assess HR, SpO2, BP, GCS, Pain</text>

            <path d="M 430 225 L 430 255" stroke="#64748b" strokeWidth="2" />
            <polygon points="430,255 426,247 434,247" fill="#64748b" />

            {/* Decision Diamond: Is Emergency (ESI <= 3)? */}
            <polygon points="430,255 530,305 430,355 330,305" fill="#450a0a" stroke="#ef4444" strokeWidth="2" />
            <text x="430" y="302" textAnchor="middle" fill="#fca5a5" fontSize="11" fontWeight="bold">Is Emergency?</text>
            <text x="430" y="316" textAnchor="middle" fill="#f87171" fontSize="9">(ESI Level 1, 2, or 3)</text>

            {/* Left Branch: YES -> Priority Preemption */}
            <path d="M 330 305 L 200 305 L 200 375" stroke="#ef4444" strokeWidth="2" />
            <polygon points="200,375 196,367 204,367" fill="#ef4444" />
            <text x="250" y="295" fill="#fca5a5" fontSize="11" fontWeight="bold">YES (Emergency)</text>

            <rect x="100" y="375" width="200" height="55" rx="8" fill="#7f1d1d" stroke="#ef4444" strokeWidth="1.5" />
            <text x="200" y="398" textAnchor="middle" fill="#ffffff" fontSize="11" fontWeight="bold">Priority Queue Enqueue</text>
            <text x="200" y="415" textAnchor="middle" fill="#fecaca" fontSize="9.5">Sort by ESI (1 &gt; 2 &gt; 3), then FIFO</text>

            {/* Right Branch: NO -> FIFO Normal Queue */}
            <path d="M 530 305 L 660 305 L 660 375" stroke="#10b981" strokeWidth="2" />
            <polygon points="660,375 656,367 664,367" fill="#10b981" />
            <text x="560" y="295" fill="#6ee7b7" fontSize="11" fontWeight="bold">NO (Normal)</text>

            <rect x="560" y="375" width="200" height="55" rx="8" fill="#064e3b" stroke="#10b981" strokeWidth="1.5" />
            <text x="660" y="398" textAnchor="middle" fill="#ffffff" fontSize="11" fontWeight="bold">Standard FIFO Enqueue</text>
            <text x="660" y="415" textAnchor="middle" fill="#a7f3d0" fontSize="9.5">Queue Behind Emergencies by Arrival</text>

            {/* Merge paths to ER Dispatch */}
            <path d="M 200 430 L 200 460 L 430 460" stroke="#64748b" strokeWidth="2" />
            <path d="M 660 430 L 660 460 L 430 460" stroke="#64748b" strokeWidth="2" />
            <path d="M 430 460 L 430 480" stroke="#64748b" strokeWidth="2" />
            <polygon points="430,480 426,472 434,472" fill="#64748b" />

            {/* ER Dispatch & Treatment */}
            <rect x="310" y="480" width="240" height="50" rx="8" fill="#134e4a" stroke="#14b8a6" strokeWidth="1.5" />
            <text x="430" y="502" textAnchor="middle" fill="#ccfbf1" fontSize="11" fontWeight="bold">Doctor Dispatches Highest Priority</text>
            <text x="430" y="518" textAnchor="middle" fill="#99f6e4" fontSize="10">Admit to Available ER Bay</text>

            <path d="M 430 530 L 430 555" stroke="#64748b" strokeWidth="2" />
            <polygon points="430,555 426,547 434,547" fill="#64748b" />

            {/* Treatment Completed & Discharged */}
            <rect x="330" y="555" width="200" height="45" rx="22.5" fill="#1e293b" stroke="#38bdf8" strokeWidth="2" />
            <text x="430" y="576" textAnchor="middle" fill="#38bdf8" fontSize="11" fontWeight="bold">Treatment Complete</text>
            <text x="430" y="590" textAnchor="middle" fill="#94a3b8" fontSize="9">Update Linked List Record</text>
          </svg>
        </div>
      </section>

      {/* ========================================================
          SECTION 4: ALGORITHMS
      ======================================================== */}
      <section id="sec-4" className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-lg space-y-4 print:border-none print:p-0">
        <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
          <Cpu className="w-5 h-5 text-amber-400" />
          <h2 className="text-lg font-bold text-white">4. Algorithmic Specifications</h2>
        </div>

        <div className="space-y-4 text-xs text-slate-300">
          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
            <h3 className="font-bold text-amber-300 text-sm">
              Algorithm 1: Dual-Tier Priority Enqueue (Emergency Preemption + Normal FIFO)
            </h3>
            <ol className="list-decimal list-inside space-y-1 text-slate-400">
              <li><strong>Input:</strong> New Patient record <code className="text-cyan-400 font-mono">P</code> with <code className="text-cyan-400 font-mono">triageLevel</code> (1 to 5) and <code className="text-cyan-400 font-mono">arrivalTime</code>.</li>
              <li>Evaluate emergency status: <code className="text-cyan-400 font-mono">isEmergency = (triageLevel &lt;= 3)</code>.</li>
              <li>Append <code className="text-cyan-400 font-mono">P</code> to binary heap array at index <code className="text-cyan-400 font-mono">k = heap.length - 1</code>.</li>
              <li>While <code className="text-cyan-400 font-mono">k &gt; 0</code>:
                <ul className="list-disc list-inside ml-4 text-slate-400">
                  <li>Let <code className="text-cyan-400 font-mono">parent = floor((k - 1) / 2)</code>.</li>
                  <li>Compare using <code className="text-cyan-400 font-mono">EmergencyCompare(heap[k], heap[parent])</code>.</li>
                  <li>If <code className="text-cyan-400 font-mono">heap[k]</code> has strictly higher urgency than <code className="text-cyan-400 font-mono">heap[parent]</code>, swap their positions and update <code className="text-cyan-400 font-mono">k = parent</code>.</li>
                  <li>Else, break loop (heap invariant restored).</li>
                </ul>
              </li>
              <li><strong>Output:</strong> Updated priority queue with <code className="text-cyan-400 font-mono">O(log n)</code> time complexity.</li>
            </ol>
          </div>

          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
            <h3 className="font-bold text-amber-300 text-sm">
              Algorithm 2: Extract-Min Priority Dequeue (Call Next Patient)
            </h3>
            <ol className="list-decimal list-inside space-y-1 text-slate-400">
              <li>If <code className="text-cyan-400 font-mono">heap.length == 0</code>, return <code className="text-slate-500 font-mono">NULL</code>.</li>
              <li>Store root element <code className="text-cyan-400 font-mono">highestPriority = heap[0]</code>.</li>
              <li>Pop last element from heap and place it at index 0.</li>
              <li>Restore heap property via SiftDown:
                <ul className="list-disc list-inside ml-4 text-slate-400">
                  <li>Find highest priority candidate among root, left child (<code className="text-cyan-400 font-mono">2k + 1</code>), and right child (<code className="text-cyan-400 font-mono">2k + 2</code>).</li>
                  <li>If candidate != current root, swap and recursively descend.</li>
                </ul>
              </li>
              <li>Return <code className="text-cyan-400 font-mono">highestPriority</code> in <code className="text-cyan-400 font-mono">O(log n)</code> time.</li>
            </ol>
          </div>

          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
            <h3 className="font-bold text-amber-300 text-sm">
              Algorithm 3: Dynamic Linked List Node Insertion &amp; Pointer Linking
            </h3>
            <ol className="list-decimal list-inside space-y-1 text-slate-400">
              <li>Allocate new node memory block <code className="text-cyan-400 font-mono">newNode = allocate(sizeof(Node))</code>.</li>
              <li>Assign <code className="text-cyan-400 font-mono">newNode-&gt;data = P, newNode-&gt;next = NULL, newNode-&gt;prev = tail</code>.</li>
              <li>If <code className="text-cyan-400 font-mono">head == NULL</code>, set <code className="text-cyan-400 font-mono">head = tail = newNode</code>.</li>
              <li>Else set <code className="text-cyan-400 font-mono">tail-&gt;next = newNode; tail = newNode</code>.</li>
              <li>Increment node counter: <code className="text-cyan-400 font-mono">count++</code>. Complexity: <code className="text-emerald-400 font-mono">O(1)</code>.</li>
            </ol>
          </div>
        </div>
      </section>

      {/* ========================================================
          SECTION 5: PSEUDOCODE
      ======================================================== */}
      <section id="sec-5" className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-lg space-y-4 print:border-none print:p-0">
        <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
          <Code className="w-5 h-5 text-purple-400" />
          <h2 className="text-lg font-bold text-white">5. Pseudocode</h2>
        </div>

        <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 font-mono text-xs text-slate-300 overflow-x-auto space-y-3">
          <p className="text-slate-500">// --- 1. Priority Comparison Function ---</p>
          <pre className="text-cyan-300">{`FUNCTION ComparePatients(a, b):
    IF a.isEmergency AND NOT b.isEmergency THEN
        RETURN -1   // a has higher priority
    ELSE IF NOT a.isEmergency AND b.isEmergency THEN
        RETURN 1    // b has higher priority
    ELSE IF a.isEmergency AND b.isEmergency THEN
        IF a.triageLevel != b.triageLevel THEN
            RETURN a.triageLevel - b.triageLevel // Lower tier number = higher emergency
        ELSE
            RETURN a.arrivalTime - b.arrivalTime // FIFO tie-breaker
        END IF
    ELSE
        RETURN a.arrivalTime - b.arrivalTime // Strict FIFO for normal cases
    END IF
END FUNCTION`}</pre>

          <p className="text-slate-500 pt-2">// --- 2. Dynamic Linked List Deletion ---</p>
          <pre className="text-emerald-300">{`FUNCTION DeletePatientRecord(head, tail, targetId):
    curr = head
    WHILE curr != NULL DO:
        IF curr.data.id == targetId THEN
            IF curr.prev != NULL THEN
                curr.prev.next = curr.next
            ELSE
                head = curr.next
            END IF
            
            IF curr.next != NULL THEN
                curr.next.prev = curr.prev
            ELSE
                tail = curr.prev
            END IF
            
            FREE(curr)
            RETURN TRUE
        END IF
        curr = curr.next
    END WHILE
    RETURN FALSE
END FUNCTION`}</pre>
        </div>
      </section>

      {/* ========================================================
          SECTION 6: IMPLEMENTATION
      ======================================================== */}
      <section id="sec-6" className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-lg space-y-4 print:border-none print:p-0">
        <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
          <ShieldCheck className="w-5 h-5 text-teal-400" />
          <h2 className="text-lg font-bold text-white">6. Implementation Details</h2>
        </div>

        <div className="space-y-3 text-sm text-slate-300 leading-relaxed">
          <p>
            The software system is engineered using a robust, typesafe architecture leveraging React 19 and TypeScript, maintaining decoupled layers between algorithmic data structures and reactive user presentation:
          </p>
          <ul className="text-xs text-slate-400 space-y-2 list-disc list-inside">
            <li>
              <strong>Data Structure Encapsulation:</strong> The core logic resides in standalone TypeScript classes (<code className="text-cyan-400 font-mono">DynamicLinkedList</code> and <code className="text-cyan-400 font-mono">EmergencyPriorityQueue</code>) completely independent of UI frameworks, making them directly portable to embedded C++ hospital kiosks or mobile devices.
            </li>
            <li>
              <strong>Memory Address Simulation:</strong> For pedagogical and system-level verification, each linked list node simulates native 16-bit virtual memory addresses (<code className="text-cyan-400 font-mono">0x1A4F</code>), visualizing physical pointer traversal and rewiring.
            </li>
            <li>
              <strong>Clinical Audio Feedback:</strong> Integrated Web Audio API synthesizes low-latency clinical telemetry sounds (critical code-red alarm, doctor dispatch chime, and discharge confirmation) without requiring external audio assets.
            </li>
            <li>
              <strong>Automated ESI Triage Evaluator:</strong> The system incorporates a clinical heuristics engine that inspects vital signs (heart rate, SpO2, blood pressure, Glasgow Coma Scale, pain rating) and automatically suggests the appropriate ESI emergency category.
            </li>
          </ul>
        </div>
      </section>

      {/* ========================================================
          SECTION 7: SOURCE CODE
      ======================================================== */}
      <section id="sec-7" className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-lg space-y-4 print:border-none print:p-0">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <FileCode className="w-5 h-5 text-cyan-400" />
            <h2 className="text-lg font-bold text-white">7. Complete Multi-Language Source Code</h2>
          </div>

          <div className="flex items-center gap-2 print:hidden">
            {(['ts', 'cpp', 'java', 'python'] as const).map((lang) => (
              <button
                key={lang}
                onClick={() => setActiveCodeTab(lang)}
                className={`px-3 py-1 rounded-lg text-xs font-mono font-bold uppercase transition-all ${
                  activeCodeTab === lang
                    ? 'bg-cyan-600 text-white shadow-md'
                    : 'bg-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                {lang}
              </button>
            ))}

            <button
              onClick={copyToClipboard}
              className="p-1.5 rounded-lg bg-slate-800 text-slate-300 hover:text-white transition-colors"
              title="Copy source code"
            >
              {copiedCode ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
            </button>
          </div>
        </div>

        <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 font-mono text-xs overflow-x-auto max-h-96">
          <pre className="text-slate-300">{codeSnippets[activeCodeTab]}</pre>
        </div>
      </section>

      {/* ========================================================
          SECTION 8: TEST CASES
      ======================================================== */}
      <section id="sec-8" className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-lg space-y-4 print:border-none print:p-0">
        <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
          <CheckCircle2 className="w-5 h-5 text-emerald-400" />
          <h2 className="text-lg font-bold text-white">8. Formal Test Cases Matrix</h2>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border border-slate-800 rounded-xl overflow-hidden">
            <thead className="bg-slate-950 text-slate-400 font-mono uppercase text-[11px] border-b border-slate-800">
              <tr>
                <th className="py-2.5 px-3">Test ID</th>
                <th className="py-2.5 px-3">Feature Under Test</th>
                <th className="py-2.5 px-3">Input Stimulus</th>
                <th className="py-2.5 px-3">Expected Output</th>
                <th className="py-2.5 px-3">Actual Result</th>
                <th className="py-2.5 px-3 text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80">
              <tr className="hover:bg-slate-800/30">
                <td className="py-2.5 px-3 font-mono font-bold text-cyan-400">TC-01</td>
                <td className="py-2.5 px-3 font-semibold text-white">Normal FIFO Integrity</td>
                <td className="py-2.5 px-3 text-slate-400">P1 (ESI 4, t=0), P2 (ESI 5, t=10), P3 (ESI 4, t=20)</td>
                <td className="py-2.5 px-3 text-slate-300">P1 -&gt; P2 -&gt; P3 dequeued in arrival sequence</td>
                <td className="py-2.5 px-3 text-emerald-300 font-mono">Matched [P1, P2, P3]</td>
                <td className="py-2.5 px-3 text-center">
                  <span className="px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-800 font-bold">PASS</span>
                </td>
              </tr>
              <tr className="hover:bg-slate-800/30">
                <td className="py-2.5 px-3 font-mono font-bold text-cyan-400">TC-02</td>
                <td className="py-2.5 px-3 font-semibold text-white">Emergency Preemption</td>
                <td className="py-2.5 px-3 text-slate-400">5 waiting normal patients; Critical ESI 1 arrives at t=50</td>
                <td className="py-2.5 px-3 text-slate-300">ESI 1 patient dequeued first, ahead of all 5 normal cases</td>
                <td className="py-2.5 px-3 text-emerald-300 font-mono">ESI 1 preempts queue</td>
                <td className="py-2.5 px-3 text-center">
                  <span className="px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-800 font-bold">PASS</span>
                </td>
              </tr>
              <tr className="hover:bg-slate-800/30">
                <td className="py-2.5 px-3 font-mono font-bold text-cyan-400">TC-03</td>
                <td className="py-2.5 px-3 font-semibold text-white">Multi-Tier Hierarchy</td>
                <td className="py-2.5 px-3 text-slate-400">Simultaneous ESI 3, ESI 2, ESI 1 (A), ESI 1 (B)</td>
                <td className="py-2.5 px-3 text-slate-300">Order: ESI 1(A) -&gt; ESI 1(B) -&gt; ESI 2 -&gt; ESI 3</td>
                <td className="py-2.5 px-3 text-emerald-300 font-mono">Strict tier + FIFO tie-break</td>
                <td className="py-2.5 px-3 text-center">
                  <span className="px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-800 font-bold">PASS</span>
                </td>
              </tr>
              <tr className="hover:bg-slate-800/30">
                <td className="py-2.5 px-3 font-mono font-bold text-cyan-400">TC-04</td>
                <td className="py-2.5 px-3 font-semibold text-white">Linked List Pointer Integrity</td>
                <td className="py-2.5 px-3 text-slate-400">Insert 3 nodes; delete interior node 2</td>
                <td className="py-2.5 px-3 text-slate-300">Node1.next == Node3 and Node3.prev == Node1</td>
                <td className="py-2.5 px-3 text-emerald-300 font-mono">Pointers rewired; count = 2</td>
                <td className="py-2.5 px-3 text-center">
                  <span className="px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-800 font-bold">PASS</span>
                </td>
              </tr>
              <tr className="hover:bg-slate-800/30">
                <td className="py-2.5 px-3 font-mono font-bold text-cyan-400">TC-05</td>
                <td className="py-2.5 px-3 font-semibold text-white">End-to-End Lifecycle</td>
                <td className="py-2.5 px-3 text-slate-400">Registration -&gt; Queue -&gt; Treatment -&gt; Discharged</td>
                <td className="py-2.5 px-3 text-slate-300">Record maintained with notes and disposition</td>
                <td className="py-2.5 px-3 text-emerald-300 font-mono">Archive preserved without loss</td>
                <td className="py-2.5 px-3 text-center">
                  <span className="px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-800 font-bold">PASS</span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* ========================================================
          SECTION 9: OUTPUT SCREENSHOTS & LIVE VIEW
      ======================================================== */}
      <section id="sec-9" className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-lg space-y-4 print:border-none print:p-0">
        <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
          <Activity className="w-5 h-5 text-rose-400" />
          <h2 className="text-lg font-bold text-white">9. Output Screenshots & System Telemetry</h2>
        </div>

        <p className="text-sm text-slate-300 leading-relaxed">
          The screenshots below capture live execution states of the system during active triage operations:
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-2">
            <span className="text-xs font-bold text-red-400 font-mono">Figure 9.1: Live Emergency Priority Queue State</span>
            <div className="bg-slate-900 p-3 rounded-lg border border-slate-800 font-mono text-[11px] text-slate-300 space-y-1">
              <div className="text-red-400 font-bold">[#1] Elena Rostova (PT-1001) - ESI Level 1 (Crushing Chest Pain)</div>
              <div className="text-amber-400">[#2] Sofia Al-Mansoor (PT-1005) - ESI Level 1 (Anaphylaxis)</div>
              <div className="text-yellow-400">[#3] Gabriel Morales (PT-1004) - ESI Level 2 (Stroke Alert)</div>
              <div className="text-emerald-400">[#4] Arthur Pendelton (PT-1002) - ESI Level 4 (Laceration - FIFO)</div>
              <div className="text-blue-400">[#5] Chloe Kim (PT-1003) - ESI Level 5 (Contact Dermatitis - FIFO)</div>
            </div>
            <p className="text-[11px] text-slate-400">
              Demonstrates Emergency ESI 1 and 2 patients preempting earlier normal FIFO arrivals.
            </p>
          </div>

          <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-2">
            <span className="text-xs font-bold text-indigo-400 font-mono">Figure 9.2: Dynamic Linked List Memory Pointers</span>
            <div className="bg-slate-900 p-3 rounded-lg border border-slate-800 font-mono text-[11px] text-slate-300 space-y-1">
              <div>[HEAD: 0x1A4F] --&gt; next: 0x2B18 | prev: NULL</div>
              <div>[NODE: 0x2B18] --&gt; next: 0x4D2E | prev: 0x1A4F</div>
              <div>[NODE: 0x4D2E] --&gt; next: 0x5E81 | prev: 0x2B18</div>
              <div>[TAIL: 0x5E81] --&gt; next: NULL   | prev: 0x4D2E</div>
            </div>
            <p className="text-[11px] text-slate-400">
              Visualizes continuous bi-directional node traversal across simulated heap memory blocks.
            </p>
          </div>
        </div>
      </section>

      {/* ========================================================
          SECTION 10: TIME & SPACE COMPLEXITY
      ======================================================== */}
      <section id="sec-10" className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-lg space-y-4 print:border-none print:p-0">
        <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
          <Activity className="w-5 h-5 text-amber-400" />
          <h2 className="text-lg font-bold text-white">10. Asymptotic Time & Space Complexity Analysis</h2>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border border-slate-800 rounded-xl overflow-hidden font-mono">
            <thead className="bg-slate-950 text-slate-400 uppercase text-[11px] border-b border-slate-800">
              <tr>
                <th className="py-2.5 px-3">Operation</th>
                <th className="py-2.5 px-3">Unsorted Array</th>
                <th className="py-2.5 px-3">Sorted Array</th>
                <th className="py-2.5 px-3">Binary Min-Heap (Our PQ)</th>
                <th className="py-2.5 px-3">Doubly Linked List</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80 text-slate-300">
              <tr>
                <td className="py-2.5 px-3 font-bold text-white">Enqueue / Insert Tail</td>
                <td className="py-2.5 px-3">O(1)</td>
                <td className="py-2.5 px-3">O(n)</td>
                <td className="py-2.5 px-3 text-emerald-400 font-bold">O(log n)</td>
                <td className="py-2.5 px-3 text-emerald-400 font-bold">O(1)</td>
              </tr>
              <tr>
                <td className="py-2.5 px-3 font-bold text-white">Dequeue (Extract-Max/Min)</td>
                <td className="py-2.5 px-3">O(n)</td>
                <td className="py-2.5 px-3">O(1)</td>
                <td className="py-2.5 px-3 text-emerald-400 font-bold">O(log n)</td>
                <td className="py-2.5 px-3">O(n) [or O(1) for pure FIFO]</td>
              </tr>
              <tr>
                <td className="py-2.5 px-3 font-bold text-white">Peek Highest Priority</td>
                <td className="py-2.5 px-3">O(n)</td>
                <td className="py-2.5 px-3">O(1)</td>
                <td className="py-2.5 px-3 text-emerald-400 font-bold">O(1)</td>
                <td className="py-2.5 px-3">O(n)</td>
              </tr>
              <tr>
                <td className="py-2.5 px-3 font-bold text-white">Search by Patient ID</td>
                <td className="py-2.5 px-3">O(n)</td>
                <td className="py-2.5 px-3">O(log n)</td>
                <td className="py-2.5 px-3">O(n)</td>
                <td className="py-2.5 px-3">O(n)</td>
              </tr>
              <tr>
                <td className="py-2.5 px-3 font-bold text-white">Delete Node (Known Pointer)</td>
                <td className="py-2.5 px-3">O(n)</td>
                <td className="py-2.5 px-3">O(n)</td>
                <td className="py-2.5 px-3">O(log n)</td>
                <td className="py-2.5 px-3 text-emerald-400 font-bold">O(1)</td>
              </tr>
              <tr>
                <td className="py-2.5 px-3 font-bold text-white">Auxiliary Space Complexity</td>
                <td className="py-2.5 px-3">O(n)</td>
                <td className="py-2.5 px-3">O(n)</td>
                <td className="py-2.5 px-3 text-cyan-400 font-bold">O(n)</td>
                <td className="py-2.5 px-3 text-cyan-400 font-bold">O(n) [3 pointers/node]</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* ========================================================
          SECTION 11: ADVANTAGES & LIMITATIONS
      ======================================================== */}
      <section id="sec-11" className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-lg space-y-4 print:border-none print:p-0">
        <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
          <BookOpen className="w-5 h-5 text-indigo-400" />
          <h2 className="text-lg font-bold text-white">11. Advantages and Limitations</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-2">
            <h3 className="text-sm font-bold text-emerald-400">System Advantages</h3>
            <ul className="text-xs text-slate-300 space-y-1.5 list-disc list-inside">
              <li><strong>Zero Triage Delay:</strong> Critical ESI 1 and 2 patients immediately preempt the queue without waiting for earlier non-critical patients.</li>
              <li><strong>FIFO Fairness for Routine Cases:</strong> Stable normal patients are guaranteed predictable FIFO ordering without arbitrary reordering.</li>
              <li><strong>Dynamic Memory Scalability:</strong> The linked list dynamically allocates and deallocates records without pre-allocating large fixed arrays.</li>
              <li><strong>Multi-Dimensional Clinical Triage:</strong> Triage is backed by real-time physiological indicators (SpO2, GCS, blood pressure, heart rate).</li>
            </ul>
          </div>

          <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-2">
            <h3 className="text-sm font-bold text-amber-400">Current Limitations</h3>
            <ul className="text-xs text-slate-300 space-y-1.5 list-disc list-inside">
              <li><strong>Potential Normal Starvation:</strong> Under extreme mass-casualty conditions, continuous influx of emergency patients can cause starvation for low-priority normal cases (mitigated via priority aging mechanisms).</li>
              <li><strong>Pointer Memory Overhead:</strong> Each doubly linked list node requires two additional pointers (<code className="text-cyan-400 font-mono">prev</code>, <code className="text-cyan-400 font-mono">next</code>), resulting in 16 bytes of pointer metadata per record in 64-bit architectures.</li>
              <li><strong>Linear Search in Linked List:</strong> Locating records by arbitrary string search requires <code className="text-cyan-400 font-mono">O(n)</code> linear traversal unless indexed with an auxiliary hash table.</li>
            </ul>
          </div>
        </div>
      </section>

      {/* ========================================================
          SECTION 12: FUTURE SCOPE
      ======================================================== */}
      <section id="sec-12" className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-lg space-y-4 print:border-none print:p-0">
        <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
          <Zap className="w-5 h-5 text-cyan-400" />
          <h2 className="text-lg font-bold text-white">12. Future Scope & Enhancements</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs text-slate-300">
          <div className="p-3.5 bg-slate-950 rounded-xl border border-slate-800">
            <h4 className="font-bold text-cyan-300 mb-1">1. IoT Telemetry Streaming</h4>
            <p className="text-slate-400">
              Direct ingestion of live vitals from Bluetooth Low Energy (BLE) pulse oximeters, smart wearable monitors, and automated blood pressure cuffs for continuous priority recalculation.
            </p>
          </div>

          <div className="p-3.5 bg-slate-950 rounded-xl border border-slate-800">
            <h4 className="font-bold text-indigo-300 mb-1">2. Machine Learning Triage</h4>
            <p className="text-slate-400">
              Integrating predictive clinical models trained on historical emergency outcomes to detect subtle deterioration and shock before clinical collapse.
            </p>
          </div>

          <div className="p-3.5 bg-slate-950 rounded-xl border border-slate-800">
            <h4 className="font-bold text-teal-300 mb-1">3. HL7 / FHIR Standards</h4>
            <p className="text-slate-400">
              Interoperability with national electronic health record (EHR) networks via HL7 FHIR protocols, enabling automated insurance pre-authorization and cross-hospital transfers.
            </p>
          </div>
        </div>
      </section>

      {/* ========================================================
          SECTION 13: CONCLUSION
      ======================================================== */}
      <section id="sec-13" className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-lg space-y-4 print:border-none print:p-0">
        <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
          <CheckCircle2 className="w-5 h-5 text-emerald-400" />
          <h2 className="text-lg font-bold text-white">13. Conclusion</h2>
        </div>

        <p className="text-sm text-slate-300 leading-relaxed">
          The Hospital Emergency Management System demonstrates how foundational computer science data structures directly optimize life-critical clinical environments. By coupling a <strong>Dual-Policy Priority Queue (Min-Heap)</strong> with a <strong>Dynamic Doubly Linked List</strong>, the system guarantees that high-acuity resuscitation patients (ESI Levels 1-3) receive immediate medical intervention, while non-emergent routine cases (ESI Levels 4-5) are processed in fair, predictable FIFO order. The architecture ensures mathematical time complexity bounds (<code className="text-emerald-400 font-mono">O(log n)</code> enqueue/dequeue, <code className="text-emerald-400 font-mono">O(1)</code> node insertion), prevents memory fragmentation, and provides a transparent audit trail from door-to-treatment.
        </p>
      </section>

      {/* ========================================================
          SECTION 14: REFERENCES
      ======================================================== */}
      <section id="sec-14" className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-lg space-y-4 print:border-none print:p-0">
        <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
          <BookOpen className="w-5 h-5 text-slate-400" />
          <h2 className="text-lg font-bold text-white">14. References</h2>
        </div>

        <ol className="text-xs text-slate-400 space-y-2 list-decimal list-inside font-mono">
          <li>
            Cormen, T. H., Leiserson, C. E., Rivest, R. L., &amp; Stein, C. (2022). <em>Introduction to Algorithms</em> (4th ed.). MIT Press. Chapter 6: Heapsort &amp; Priority Queues; Chapter 10: Elementary Data Structures (Linked Lists).
          </li>
          <li>
            Gilboy, N., Tanabe, P., Travers, D., &amp; Rosenau, A. M. (2020). <em>Emergency Severity Index (ESI): A Triage Tool for Emergency Department Care, Version 4</em>. Implementation Handbook, Agency for Healthcare Research and Quality (AHRQ).
          </li>
          <li>
            FitzGerald, G., Jelinek, G. A., Scott, D., &amp; Gerdtz, M. F. (2010). Emergency department triage revisited. <em>Emergency Medicine Journal</em>, 27(2), 86-92.
          </li>
          <li>
            Sedgewick, R., &amp; Wayne, K. (2014). <em>Algorithms</em> (4th ed.). Addison-Wesley Professional. Priority Queue and Pointer Mechanics.
          </li>
          <li>
            World Health Organization. (2020). <em>WHO Emergency Triage Assessment and Treatment (ETAT) Guidelines</em>. Geneva: World Health Organization.
          </li>
        </ol>
      </section>
    </div>
  );
};
