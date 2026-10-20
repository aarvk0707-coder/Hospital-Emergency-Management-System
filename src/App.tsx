import React, { useMemo, useState } from 'react';
import { 
  Activity, 
  AlertOctagon, 
  AlertTriangle, 
  CheckCircle2, 
  Clock, 
  Flame, 
  Heart, 
  Info, 
  Sparkles, 
  X, 
  Zap 
} from 'lucide-react';
import { DynamicLinkedList } from './dataStructures/LinkedList';
import { EmergencyPriorityQueue } from './dataStructures/EmergencyPriorityQueue';
import { INITIAL_BAYS, INITIAL_PATIENTS } from './utils/sampleData';
import { PatientRecord, TreatmentBay, TriageLevel } from './types/ems';
import { Navbar } from './components/Navbar';
import { TriageModal } from './components/TriageModal';
import { QueueManager } from './components/QueueManager';
import { TreatmentBays } from './components/TreatmentBays';
import { LinkedListVisualizer } from './components/LinkedListVisualizer';
import { RecordsArchive } from './components/RecordsArchive';
import { TestCasesRunner } from './components/TestCasesRunner';
import { TechnicalReport } from './components/TechnicalReport';
import { playCallPatientChime, playEmergencyAlert, playTreatmentCompleteSound } from './utils/audio';

export default function App() {
  const [activeTab, setActiveTab] = useState<'floor' | 'linkedlist' | 'records' | 'tests' | 'report'>('floor');
  const [isTriageOpen, setIsTriageOpen] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: 'info' | 'emergency' | 'success' } | null>(null);

  // Initialize data structures
  const [linkedList] = useState(() => new DynamicLinkedList<PatientRecord>(INITIAL_PATIENTS));
  const [priorityQueue] = useState(() => {
    const waiting = INITIAL_PATIENTS.filter((p) => p.status === 'waiting');
    return new EmergencyPriorityQueue(waiting);
  });

  // Reactive state trackers
  const [bays, setBays] = useState<TreatmentBay[]>(INITIAL_BAYS);
  const [queueState, setQueueState] = useState<PatientRecord[]>(() => priorityQueue.getSortedQueue());
  const [allPatients, setAllPatients] = useState<PatientRecord[]>(() => linkedList.toArray());
  const [linkedListNodes, setLinkedListNodes] = useState(() => linkedList.getMemorySnapshot());

  const showToast = (message: string, type: 'info' | 'emergency' | 'success' = 'info') => {
    setToast({ message, type });
    setTimeout(() => {
      setToast(null);
    }, 4500);
  };

  const refreshState = () => {
    setQueueState(priorityQueue.getSortedQueue());
    setAllPatients(linkedList.toArray());
    setLinkedListNodes(linkedList.getMemorySnapshot());
  };

  const patientsMap = useMemo(() => {
    const map = new Map<string, PatientRecord>();
    allPatients.forEach((p) => map.set(p.id, p));
    return map;
  }, [allPatients]);

  const availableBays = bays
    .filter((b) => !b.isOccupied)
    .map((b) => ({ id: b.id, name: b.name }));

  // 1. Patient Registration & Triage
  const handleRegisterPatient = (
    data: Omit<PatientRecord, 'id' | 'memoryAddress' | 'status' | 'arrivalTime' | 'priorityScore'>
  ) => {
    const newId = `PT-${1000 + allPatients.length + 1}`;
    const hexAddr = `0x${Math.floor(0x1000 + Math.random() * 0x8fff).toString(16).toUpperCase()}`;
    const newPatient: PatientRecord = {
      ...data,
      id: newId,
      memoryAddress: hexAddr,
      arrivalTime: Date.now(),
      status: 'waiting',
      priorityScore: data.isEmergency ? 100 - data.triageLevel * 10 : 30,
    };

    // Insert into dynamic linked list (O(1))
    linkedList.insertTail(newPatient, hexAddr);

    // Enqueue into priority queue (O(log n))
    priorityQueue.enqueue(newPatient);

    if (newPatient.isEmergency) {
      playEmergencyAlert();
      showToast(
        `CODE RED: ${newPatient.name} enrolled with Emergency Priority (ESI Level ${newPatient.triageLevel}). Preempting queue!`,
        'emergency'
      );
    } else {
      playCallPatientChime();
      showToast(
        `Patient ${newPatient.name} enrolled in FIFO Normal Queue (ESI Level ${newPatient.triageLevel}).`,
        'info'
      );
    }

    refreshState();
  };

  // 2. Simulate Ambulance / Emergency Influx
  const handleSimulateCodeRed = () => {
    const criticalTemplates = [
      {
        name: 'Carlos Mendoza',
        age: 52,
        gender: 'Male' as const,
        contact: '+1 (555) 944-1122',
        bloodGroup: 'O-',
        chiefComplaint: 'Severe multi-trauma from highway collision; flail chest, acute hypotensive shock',
        triageLevel: 1 as TriageLevel,
        isEmergency: true,
        vitals: { heartRate: 146, systolicBP: 74, diastolicBP: 42, spo2: 83, temperature: 36.2, respiratoryRate: 34, painScore: 10, gcs: 10 },
      },
      {
        name: 'Aisha Al-Zahrani',
        age: 31,
        gender: 'Female' as const,
        contact: '+1 (555) 303-7711',
        bloodGroup: 'A+',
        chiefComplaint: 'Acute respiratory failure in status asthmaticus; silent chest on auscultation',
        triageLevel: 1 as TriageLevel,
        isEmergency: true,
        vitals: { heartRate: 138, systolicBP: 102, diastolicBP: 68, spo2: 86, temperature: 37.1, respiratoryRate: 38, painScore: 8, gcs: 13 },
      },
      {
        name: 'Liam Zhang',
        age: 67,
        gender: 'Male' as const,
        contact: '+1 (555) 890-4411',
        bloodGroup: 'B+',
        chiefComplaint: 'Acute thunderclap headache, meningismus, suspected subarachnoid hemorrhage',
        triageLevel: 2 as TriageLevel,
        isEmergency: true,
        vitals: { heartRate: 110, systolicBP: 195, diastolicBP: 115, spo2: 95, temperature: 37.4, respiratoryRate: 22, painScore: 10, gcs: 13 },
      },
    ];

    const template = criticalTemplates[Math.floor(Math.random() * criticalTemplates.length)];
    handleRegisterPatient(template);
  };

  // 3. Call patient into ER Treatment Bay
  const handleCallPatient = (patientId: string, targetBayId?: string) => {
    const bayToUse = targetBayId
      ? bays.find((b) => b.id === targetBayId && !b.isOccupied)
      : bays.find((b) => !b.isOccupied);

    if (!bayToUse) {
      showToast('All ER bays are currently occupied. Complete a treatment first.', 'info');
      return;
    }

    const patient = priorityQueue.removeById(patientId);
    if (!patient) return;

    // Update patient record
    patient.status = 'in_treatment';
    patient.assignedBayId = bayToUse.id;
    patient.treatmentStartTime = Date.now();
    patient.attendingPhysician = bayToUse.attendingDoctor;
    patient.physicianNotes = `Admitted to ${bayToUse.name} by ${bayToUse.attendingDoctor}. Immediate clinical workup commenced.`;
    patient.treatmentsApplied = ['Initial Vitals Verification', 'Primary Survey Protocol'];

    linkedList.updateById(patientId, () => patient);

    // Update Bay state
    setBays((prev) =>
      prev.map((b) =>
        b.id === bayToUse.id
          ? { ...b, isOccupied: true, currentPatientId: patient.id }
          : b
      )
    );

    playCallPatientChime();
    showToast(`Admitted ${patient.name} to ${bayToUse.name}.`, 'success');
    refreshState();
  };

  // 4. Complete Treatment & Discharge
  const handleCompleteTreatment = (
    patientId: string,
    bayId: string,
    disposition: string,
    notes: string
  ) => {
    linkedList.updateById(patientId, (prev) => ({
      ...prev,
      status: 'discharged',
      disposition,
      physicianNotes: notes,
      treatmentEndTime: Date.now(),
    }));

    setBays((prev) =>
      prev.map((b) =>
        b.id === bayId
          ? { ...b, isOccupied: false, currentPatientId: null }
          : b
      )
    );

    playTreatmentCompleteSound();
    showToast(`Treatment complete for ${patientId}. Record archived.`, 'success');
    refreshState();
  };

  // 5. Re-triage priority
  const handleUpdatePriority = (patientId: string, newLevel: TriageLevel) => {
    const isEmergency = newLevel <= 3;
    priorityQueue.updatePriority(patientId, newLevel);
    linkedList.updateById(patientId, (prev) => ({
      ...prev,
      triageLevel: newLevel,
      isEmergency,
    }));
    showToast(`Patient ${patientId} re-triaged to ESI Level ${newLevel}. Queue adjusted.`, 'info');
    refreshState();
  };

  // 6. Remove from queue
  const handleRemoveFromQueue = (patientId: string) => {
    priorityQueue.removeById(patientId);
    linkedList.updateById(patientId, (prev) => ({
      ...prev,
      status: 'discharged',
      disposition: 'Cancelled / Departed before doctor examination',
    }));
    showToast(`Patient ${patientId} removed from waiting queue.`, 'info');
    refreshState();
  };

  // 7. Direct Linked List operations
  const handleDeleteNode = (id: string) => {
    priorityQueue.removeById(id);
    linkedList.deleteById(id);
    showToast(`Node ${id} deleted from dynamic linked list memory. Pointers rewired.`, 'info');
    refreshState();
  };

  const handleInsertDummyHead = () => {
    const id = `PT-${Math.floor(1000 + Math.random() * 9000)}`;
    const mock: PatientRecord = {
      id,
      memoryAddress: `0x${Math.floor(0x1000 + Math.random() * 0x8fff).toString(16).toUpperCase()}`,
      name: 'Dynamic Head Patient',
      age: 29,
      gender: 'Other',
      contact: '555-001',
      bloodGroup: 'O+',
      chiefComplaint: 'Simulated node inserted directly at list head',
      triageLevel: 4,
      isEmergency: false,
      arrivalTime: Date.now(),
      priorityScore: 30,
      vitals: { heartRate: 72, systolicBP: 120, diastolicBP: 80, spo2: 99, temperature: 36.8, respiratoryRate: 16, painScore: 1, gcs: 15 },
      status: 'waiting',
    };
    linkedList.insertHead(mock, mock.memoryAddress);
    priorityQueue.enqueue(mock);
    showToast(`Allocated node ${mock.id} at HEAD of dynamic linked list.`, 'info');
    refreshState();
  };

  const handleInsertDummyTail = () => {
    const id = `PT-${Math.floor(1000 + Math.random() * 9000)}`;
    const mock: PatientRecord = {
      id,
      memoryAddress: `0x${Math.floor(0x1000 + Math.random() * 0x8fff).toString(16).toUpperCase()}`,
      name: 'Dynamic Tail Patient',
      age: 38,
      gender: 'Male',
      contact: '555-002',
      bloodGroup: 'A+',
      chiefComplaint: 'Simulated node appended directly at list tail',
      triageLevel: 4,
      isEmergency: false,
      arrivalTime: Date.now(),
      priorityScore: 30,
      vitals: { heartRate: 75, systolicBP: 122, diastolicBP: 82, spo2: 98, temperature: 37.0, respiratoryRate: 16, painScore: 2, gcs: 15 },
      status: 'waiting',
    };
    linkedList.insertTail(mock, mock.memoryAddress);
    priorityQueue.enqueue(mock);
    showToast(`Allocated node ${mock.id} at TAIL of dynamic linked list.`, 'info');
    refreshState();
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-red-900 selection:text-white">
      {/* Navbar Header */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenTriage={() => setIsTriageOpen(true)}
        onSimulateCodeRed={handleSimulateCodeRed}
        queueCount={queueState.length}
        emergencyQueueCount={priorityQueue.getEmergencyCount()}
        occupiedBaysCount={bays.filter((b) => b.isOccupied).length}
        totalBaysCount={bays.length}
      />

      {/* Toast Notification Alert */}
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 max-w-md animate-in slide-in-from-bottom-5">
          <div
            className={`p-4 rounded-2xl shadow-2xl border flex items-start gap-3 backdrop-blur-md ${
              toast.type === 'emergency'
                ? 'bg-red-950/90 text-red-200 border-red-700/80'
                : toast.type === 'success'
                ? 'bg-emerald-950/90 text-emerald-200 border-emerald-700/80'
                : 'bg-slate-900/90 text-slate-200 border-slate-700/80'
            }`}
          >
            {toast.type === 'emergency' ? (
              <Flame className="w-5 h-5 text-red-400 shrink-0 mt-0.5 animate-bounce" />
            ) : toast.type === 'success' ? (
              <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
            ) : (
              <Info className="w-5 h-5 text-cyan-400 shrink-0 mt-0.5" />
            )}
            <div className="text-xs font-medium flex-1">{toast.message}</div>
            <button
              onClick={() => setToast(null)}
              className="text-slate-400 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Main View Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 space-y-6">
        {/* TAB 1: Emergency Floor & Queue */}
        {activeTab === 'floor' && (
          <div className="space-y-6 animate-in fade-in">
            {/* Clinical Overview Notice */}
            <div className="bg-gradient-to-r from-red-950/40 via-slate-900 to-slate-900 p-4 rounded-2xl border border-red-900/40 flex flex-wrap items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-ping"></span>
                <span className="font-semibold text-red-300">
                  Priority Queue Policy Enforced:
                </span>
                <span className="text-slate-300">
                  Emergency cases (ESI 1-3) immediately preempt normal cases. Normal cases (ESI 4-5) follow strict FIFO order.
                </span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={handleSimulateCodeRed}
                  className="px-2.5 py-1 rounded-lg bg-red-900/60 hover:bg-red-800 text-red-200 font-bold border border-red-700/80 transition-all text-[11px] flex items-center gap-1"
                >
                  <Zap className="w-3 h-3 text-red-400" />
                  Test Preemption (Inject ESI 1)
                </button>
              </div>
            </div>

            {/* Split layout: Queue on left, Treatment Bays on right */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              <div className="lg:col-span-6 xl:col-span-5">
                <QueueManager
                  queue={queueState}
                  onCallPatient={handleCallPatient}
                  onUpdatePriority={handleUpdatePriority}
                  onRemoveFromQueue={handleRemoveFromQueue}
                  availableBays={availableBays}
                />
              </div>

              <div className="lg:col-span-6 xl:col-span-7">
                <TreatmentBays
                  bays={bays}
                  patientsMap={patientsMap}
                  onCompleteTreatment={handleCompleteTreatment}
                  onCallNextToBay={(bayId) => {
                    if (queueState.length > 0) {
                      handleCallPatient(queueState[0].id, bayId);
                    }
                  }}
                  hasWaitingPatients={queueState.length > 0}
                />
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: Dynamic Linked List Visualizer */}
        {activeTab === 'linkedlist' && (
          <div className="animate-in fade-in">
            <LinkedListVisualizer
              nodes={linkedListNodes}
              onDeleteNode={handleDeleteNode}
              onSearchNode={() => {}}
              onInsertDummyHead={handleInsertDummyHead}
              onInsertDummyTail={handleInsertDummyTail}
            />
          </div>
        )}

        {/* TAB 3: Master Patient Records Archive */}
        {activeTab === 'records' && (
          <div className="animate-in fade-in">
            <RecordsArchive patients={allPatients} />
          </div>
        )}

        {/* TAB 4: Automated Verification Test Cases */}
        {activeTab === 'tests' && (
          <div className="animate-in fade-in">
            <TestCasesRunner />
          </div>
        )}

        {/* TAB 5: Technical Report (Complete 14 Sections + Print Mode) */}
        {activeTab === 'report' && (
          <div className="animate-in fade-in">
            <TechnicalReport />
          </div>
        )}
      </main>

      {/* Patient Registration & Triage Modal */}
      <TriageModal
        isOpen={isTriageOpen}
        onClose={() => setIsTriageOpen(false)}
        onRegister={handleRegisterPatient}
      />
    </div>
  );
}
