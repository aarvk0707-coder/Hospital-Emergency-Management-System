export type TriageLevel = 1 | 2 | 3 | 4 | 5;

export interface VitalSigns {
  heartRate: number; // bpm
  systolicBP: number; // mmHg
  diastolicBP: number; // mmHg
  spo2: number; // percentage
  temperature: number; // Celsius
  respiratoryRate: number; // breaths/min
  painScore: number; // 0-10
  gcs: number; // Glasgow Coma Scale 3-15
}

export type PatientStatus = 
  | 'waiting' 
  | 'in_treatment' 
  | 'discharged' 
  | 'admitted_icu' 
  | 'transferred';

export interface PatientRecord {
  id: string; // e.g. "PT-1001"
  memoryAddress: string; // e.g. "0x7F4A" for visual linked list pointer simulation
  name: string;
  age: number;
  gender: 'Male' | 'Female' | 'Other';
  contact: string;
  bloodGroup: string;
  chiefComplaint: string;
  triageLevel: TriageLevel;
  isEmergency: boolean; // Level 1, 2, 3 = Emergency; Level 4, 5 = Normal FIFO
  arrivalTime: number; // Epoch timestamp
  priorityScore: number; // Calculated dynamic priority
  vitals: VitalSigns;
  status: PatientStatus;
  
  // Treatment details
  assignedBayId?: string;
  attendingPhysician?: string;
  physicianNotes?: string;
  treatmentsApplied?: string[];
  treatmentStartTime?: number;
  treatmentEndTime?: number;
  disposition?: string;
  
  // Linked list pointer visualization metadata
  nextPointer?: string | null; // Next memory address or null
  prevPointer?: string | null;
}

export interface TreatmentBay {
  id: string;
  name: string;
  code: string;
  category: 'Critical / Trauma' | 'Acute Emergency' | 'General Urgent' | 'Fast-Track';
  isOccupied: boolean;
  currentPatientId: string | null;
  attendingDoctor: string;
  attendingNurse: string;
}

export interface AuditLogEntry {
  id: string;
  timestamp: number;
  patientId: string;
  action: string;
  details: string;
  category: 'TRIAGE' | 'QUEUE' | 'TREATMENT' | 'LINKED_LIST' | 'DISCHARGE';
}

export interface TestCaseResult {
  id: string;
  title: string;
  category: string;
  description: string;
  input: string;
  expectedOutput: string;
  actualOutput: string;
  passed: boolean;
  executionTimeMs: number;
  logs: string[];
}
