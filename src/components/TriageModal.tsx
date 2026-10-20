import React, { useState } from 'react';
import { 
  Activity, 
  AlertOctagon, 
  AlertTriangle, 
  Check, 
  Heart, 
  Info, 
  Sparkles, 
  Stethoscope, 
  Thermometer, 
  Wind, 
  X 
} from 'lucide-react';
import { PatientRecord, TriageLevel, VitalSigns } from '../types/ems';

interface TriageModalProps {
  isOpen: boolean;
  onClose: () => void;
  onRegister: (patientData: Omit<PatientRecord, 'id' | 'memoryAddress' | 'status' | 'arrivalTime' | 'priorityScore'>) => void;
}

const PRESETS = [
  {
    name: 'Cardiac Arrest / STEMI (Level 1)',
    chiefComplaint: 'Crushing central chest pain, diaphoresis, radiating to left arm and jaw. Unstable vitals.',
    triageLevel: 1 as TriageLevel,
    vitals: { heartRate: 135, systolicBP: 80, diastolicBP: 50, spo2: 88, temperature: 36.6, respiratoryRate: 28, painScore: 10, gcs: 13 },
  },
  {
    name: 'Stroke Alert / FAST+ (Level 2)',
    chiefComplaint: 'Sudden onset right-sided hemiplegia, facial droop, slurred speech started 25 mins ago.',
    triageLevel: 2 as TriageLevel,
    vitals: { heartRate: 94, systolicBP: 190, diastolicBP: 110, spo2: 97, temperature: 37.0, respiratoryRate: 18, painScore: 4, gcs: 14 },
  },
  {
    name: 'Acute Appendicitis (Level 3)',
    chiefComplaint: 'Right lower quadrant abdominal pain, rebound tenderness, nausea, low-grade pyrexia.',
    triageLevel: 3 as TriageLevel,
    vitals: { heartRate: 105, systolicBP: 130, diastolicBP: 84, spo2: 99, temperature: 38.4, respiratoryRate: 20, painScore: 8, gcs: 15 },
  },
  {
    name: 'Ankle Sprain (Level 4 - Normal FIFO)',
    chiefComplaint: 'Inversion injury of left ankle during basketball. Able to bear weight with pain.',
    triageLevel: 4 as TriageLevel,
    vitals: { heartRate: 76, systolicBP: 122, diastolicBP: 80, spo2: 100, temperature: 36.8, respiratoryRate: 16, painScore: 5, gcs: 15 },
  },
  {
    name: 'Medication Refill (Level 5 - Normal FIFO)',
    chiefComplaint: 'Asymptomatic hypertension prescription renewal, ran out of Amlodipine 3 days ago.',
    triageLevel: 5 as TriageLevel,
    vitals: { heartRate: 72, systolicBP: 128, diastolicBP: 82, spo2: 99, temperature: 36.6, respiratoryRate: 14, painScore: 0, gcs: 15 },
  },
];

export const TriageModal: React.FC<TriageModalProps> = ({ isOpen, onClose, onRegister }) => {
  const [name, setName] = useState('');
  const [age, setAge] = useState<number>(35);
  const [gender, setGender] = useState<'Male' | 'Female' | 'Other'>('Male');
  const [contact, setContact] = useState('+1 (555) 019-2834');
  const [bloodGroup, setBloodGroup] = useState('O+');
  const [chiefComplaint, setChiefComplaint] = useState('');
  
  // Vitals
  const [vitals, setVitals] = useState<VitalSigns>({
    heartRate: 80,
    systolicBP: 120,
    diastolicBP: 80,
    spo2: 98,
    temperature: 37.0,
    respiratoryRate: 16,
    painScore: 3,
    gcs: 15,
  });

  const [triageLevel, setTriageLevel] = useState<TriageLevel>(3);
  const [autoCalculated, setAutoCalculated] = useState<TriageLevel>(3);

  if (!isOpen) return null;

  // Real-time ESI scoring logic
  const computeESI = (v: VitalSigns, complaint: string): TriageLevel => {
    // Level 1: Immediate life threat
    if (v.spo2 < 90 || v.gcs <= 12 || v.heartRate > 140 || v.heartRate < 40 || v.systolicBP < 80) {
      return 1;
    }
    const lowerComplaint = complaint.toLowerCase();
    if (
      lowerComplaint.includes('arrest') || 
      lowerComplaint.includes('unresponsive') || 
      lowerComplaint.includes('anaphylaxis') || 
      lowerComplaint.includes('stemi')
    ) {
      return 1;
    }

    // Level 2: High risk, severe distress
    if (
      v.systolicBP > 185 || 
      v.heartRate > 120 || 
      v.spo2 < 94 || 
      v.painScore >= 8 || 
      lowerComplaint.includes('stroke') || 
      lowerComplaint.includes('chest pain') || 
      lowerComplaint.includes('severe bleeding')
    ) {
      return 2;
    }

    // Level 3: Urgent (multiple resources)
    if (
      v.temperature >= 38.5 || 
      v.heartRate > 100 || 
      v.painScore >= 6 || 
      lowerComplaint.includes('fracture') || 
      lowerComplaint.includes('abdominal')
    ) {
      return 3;
    }

    // Level 4: Less urgent (single resource)
    if (v.painScore >= 3 || lowerComplaint.includes('sprain') || lowerComplaint.includes('laceration')) {
      return 4;
    }

    // Level 5: Non-urgent
    return 5;
  };

  const handleVitalsChange = (field: keyof VitalSigns, value: number) => {
    const updated = { ...vitals, [field]: value };
    setVitals(updated);
    const suggested = computeESI(updated, chiefComplaint);
    setAutoCalculated(suggested);
  };

  const handleApplyPreset = (preset: typeof PRESETS[0]) => {
    setChiefComplaint(preset.chiefComplaint);
    setVitals(preset.vitals);
    setTriageLevel(preset.triageLevel);
    setAutoCalculated(preset.triageLevel);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const isEmergency = triageLevel <= 3;

    onRegister({
      name,
      age,
      gender,
      contact,
      bloodGroup,
      chiefComplaint: chiefComplaint.trim() || 'General assessment requested',
      triageLevel,
      isEmergency,
      vitals,
    });

    onClose();
  };

  const triageColors: Record<TriageLevel, { bg: string; text: string; label: string; desc: string }> = {
    1: { bg: 'bg-red-600', text: 'text-red-400', label: 'Level 1: Resuscitation (Emergency)', desc: 'Immediate life-saving intervention needed within seconds.' },
    2: { bg: 'bg-amber-600', text: 'text-amber-400', label: 'Level 2: Emergent (Emergency)', desc: 'High risk or severe distress. Doctor within 10 minutes.' },
    3: { bg: 'bg-yellow-600', text: 'text-yellow-400', label: 'Level 3: Urgent (Emergency)', desc: 'Potentially unstable. Needs multiple diagnostic resources.' },
    4: { bg: 'bg-emerald-600', text: 'text-emerald-400', label: 'Level 4: Less Urgent (Normal FIFO)', desc: 'Stable condition. Follows FIFO arrival queue.' },
    5: { bg: 'bg-blue-600', text: 'text-blue-400', label: 'Level 5: Non-Urgent (Normal FIFO)', desc: 'Routine clinic or refill. Strict FIFO queuing.' },
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-3xl bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl shadow-black overflow-hidden my-8">
        {/* Header */}
        <div className="bg-gradient-to-r from-red-950/80 via-slate-900 to-slate-900 p-5 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-red-600/20 border border-red-500/40 flex items-center justify-center">
              <Stethoscope className="w-5 h-5 text-red-400" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                Emergency Patient Registration & Triage
              </h2>
              <p className="text-xs text-slate-400">
                Dynamic Priority Queue Enqueue & Linked List Allocation
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Quick presets */}
        <div className="px-5 py-3 bg-slate-950/60 border-b border-slate-800/80">
          <div className="text-xs font-semibold text-slate-400 mb-2 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            Fast Presets for Testing Queue Preemption:
          </div>
          <div className="flex flex-wrap gap-2">
            {PRESETS.map((p, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleApplyPreset(p)}
                className={`text-[11px] px-2.5 py-1 rounded-lg border font-medium transition-all ${
                  p.triageLevel <= 3
                    ? 'bg-red-950/40 text-red-300 border-red-800/50 hover:bg-red-900/60'
                    : 'bg-emerald-950/40 text-emerald-300 border-emerald-800/50 hover:bg-emerald-900/60'
                }`}
              >
                {p.name}
              </button>
            ))}
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-5 max-h-[75vh] overflow-y-auto">
          {/* Patient Demographics */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3 flex items-center gap-2">
              <Activity className="w-3.5 h-3.5 text-red-400" />
              1. Patient Demographics
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Full Name *</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Samuel Vance"
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-sm text-white placeholder-slate-500 focus:outline-none focus:border-red-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Age</label>
                <input
                  type="number"
                  min="0"
                  max="120"
                  value={age}
                  onChange={(e) => setAge(parseInt(e.target.value) || 0)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-sm text-white focus:outline-none focus:border-red-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Gender</label>
                <select
                  value={gender}
                  onChange={(e) => setGender(e.target.value as 'Male' | 'Female' | 'Other')}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-sm text-white focus:outline-none focus:border-red-500"
                >
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Contact Phone</label>
                <input
                  type="text"
                  value={contact}
                  onChange={(e) => setContact(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-sm text-white focus:outline-none focus:border-red-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Blood Group</label>
                <select
                  value={bloodGroup}
                  onChange={(e) => setBloodGroup(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-sm text-white focus:outline-none focus:border-red-500"
                >
                  {['O+', 'O-', 'A+', 'A-', 'B+', 'B-', 'AB+', 'AB-'].map((b) => (
                    <option key={b} value={b}>{b}</option>
                  ))}
                </select>
              </div>

              <div className="md:col-span-1">
                <label className="block text-xs font-medium text-slate-300 mb-1">Simulated Memory Slot</label>
                <div className="w-full px-3 py-2 bg-slate-950/70 border border-dashed border-slate-700 rounded-lg text-xs font-mono text-cyan-400 flex items-center justify-between">
                  <span>malloc(sizeof(Node))</span>
                  <span className="text-slate-400">Dynamic</span>
                </div>
              </div>
            </div>
          </div>

          {/* Chief Complaint */}
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">
              Chief Medical Complaint & Clinical Presentation *
            </label>
            <textarea
              rows={2}
              required
              value={chiefComplaint}
              onChange={(e) => {
                setChiefComplaint(e.target.value);
                const suggested = computeESI(vitals, e.target.value);
                setAutoCalculated(suggested);
              }}
              placeholder="Describe primary symptoms, pain radiation, onset, and relevant clinical triggers..."
              className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-sm text-white placeholder-slate-500 focus:outline-none focus:border-red-500"
            />
          </div>

          {/* Vital Signs Assessment */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3 flex items-center gap-2">
              <Heart className="w-3.5 h-3.5 text-rose-400" />
              2. Triage Vital Signs Assessment
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-950/70 p-3 rounded-xl border border-slate-800/80">
              <div>
                <label className="block text-[11px] text-slate-400 mb-1 flex items-center gap-1">
                  <Heart className="w-3 h-3 text-red-400" /> Heart Rate (bpm)
                </label>
                <input
                  type="number"
                  value={vitals.heartRate}
                  onChange={(e) => handleVitalsChange('heartRate', Number(e.target.value))}
                  className="w-full px-2.5 py-1.5 bg-slate-900 border border-slate-700 rounded text-sm text-white"
                />
              </div>

              <div>
                <label className="block text-[11px] text-slate-400 mb-1 flex items-center gap-1">
                  <Activity className="w-3 h-3 text-purple-400" /> Blood Pressure
                </label>
                <div className="flex items-center gap-1">
                  <input
                    type="number"
                    value={vitals.systolicBP}
                    onChange={(e) => handleVitalsChange('systolicBP', Number(e.target.value))}
                    className="w-1/2 px-2 py-1.5 bg-slate-900 border border-slate-700 rounded text-sm text-white"
                    placeholder="Sys"
                  />
                  <span className="text-slate-500">/</span>
                  <input
                    type="number"
                    value={vitals.diastolicBP}
                    onChange={(e) => handleVitalsChange('diastolicBP', Number(e.target.value))}
                    className="w-1/2 px-2 py-1.5 bg-slate-900 border border-slate-700 rounded text-sm text-white"
                    placeholder="Dia"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] text-slate-400 mb-1 flex items-center gap-1">
                  <Wind className="w-3 h-3 text-cyan-400" /> SpO2 (%)
                </label>
                <input
                  type="number"
                  value={vitals.spo2}
                  onChange={(e) => handleVitalsChange('spo2', Number(e.target.value))}
                  className="w-full px-2.5 py-1.5 bg-slate-900 border border-slate-700 rounded text-sm text-white"
                />
              </div>

              <div>
                <label className="block text-[11px] text-slate-400 mb-1 flex items-center gap-1">
                  <Thermometer className="w-3 h-3 text-amber-400" /> Temp (°C)
                </label>
                <input
                  type="number"
                  step="0.1"
                  value={vitals.temperature}
                  onChange={(e) => handleVitalsChange('temperature', Number(e.target.value))}
                  className="w-full px-2.5 py-1.5 bg-slate-900 border border-slate-700 rounded text-sm text-white"
                />
              </div>

              <div>
                <label className="block text-[11px] text-slate-400 mb-1">Resp Rate (/min)</label>
                <input
                  type="number"
                  value={vitals.respiratoryRate}
                  onChange={(e) => handleVitalsChange('respiratoryRate', Number(e.target.value))}
                  className="w-full px-2.5 py-1.5 bg-slate-900 border border-slate-700 rounded text-sm text-white"
                />
              </div>

              <div>
                <label className="block text-[11px] text-slate-400 mb-1">Pain Score (0-10)</label>
                <input
                  type="number"
                  min="0"
                  max="10"
                  value={vitals.painScore}
                  onChange={(e) => handleVitalsChange('painScore', Number(e.target.value))}
                  className="w-full px-2.5 py-1.5 bg-slate-900 border border-slate-700 rounded text-sm text-white"
                />
              </div>

              <div>
                <label className="block text-[11px] text-slate-400 mb-1">GCS Score (3-15)</label>
                <input
                  type="number"
                  min="3"
                  max="15"
                  value={vitals.gcs}
                  onChange={(e) => handleVitalsChange('gcs', Number(e.target.value))}
                  className="w-full px-2.5 py-1.5 bg-slate-900 border border-slate-700 rounded text-sm text-white"
                />
              </div>

              <div className="flex flex-col justify-end">
                <button
                  type="button"
                  onClick={() => setTriageLevel(autoCalculated)}
                  className="px-2.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-cyan-300 text-xs rounded border border-slate-700 flex items-center justify-center gap-1"
                >
                  <Sparkles className="w-3 h-3" />
                  Auto: Level {autoCalculated}
                </button>
              </div>
            </div>
          </div>

          {/* Priority Assignment */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
                <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
                3. Emergency Priority Assignment (ESI Triage Category)
              </h3>
              <span className="text-[11px] text-cyan-400 flex items-center gap-1">
                <Info className="w-3 h-3" />
                Levels 1-3 = Emergency Queue | Levels 4-5 = Normal FIFO
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-5 gap-2">
              {([1, 2, 3, 4, 5] as TriageLevel[]).map((lvl) => {
                const config = triageColors[lvl];
                const isSelected = triageLevel === lvl;
                return (
                  <button
                    key={lvl}
                    type="button"
                    onClick={() => setTriageLevel(lvl)}
                    className={`p-3 rounded-xl border text-left transition-all relative ${
                      isSelected
                        ? `${config.bg} text-white border-white/40 ring-2 ring-white/20 shadow-lg scale-[1.02]`
                        : 'bg-slate-950/80 border-slate-800 text-slate-300 hover:bg-slate-800'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-bold">ESI {lvl}</span>
                      {lvl <= 3 ? (
                        <span className="text-[9px] uppercase px-1 py-0.5 rounded bg-black/40 font-semibold">
                          EMERGENCY
                        </span>
                      ) : (
                        <span className="text-[9px] uppercase px-1 py-0.5 rounded bg-black/30 text-slate-300">
                          NORMAL FIFO
                        </span>
                      )}
                    </div>
                    <div className="text-[11px] font-medium leading-tight">
                      {lvl === 1 && 'Resuscitation'}
                      {lvl === 2 && 'Emergent'}
                      {lvl === 3 && 'Urgent'}
                      {lvl === 4 && 'Less Urgent'}
                      {lvl === 5 && 'Non-Urgent'}
                    </div>
                  </button>
                );
              })}
            </div>

            <div className="mt-3 p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs flex items-center gap-2.5">
              <div className="w-2.5 h-2.5 rounded-full bg-red-500 shrink-0 animate-pulse"></div>
              <div className="text-slate-300">
                <span className="font-semibold text-white">
                  {triageColors[triageLevel].label}:
                </span>{' '}
                {triageColors[triageLevel].desc}
              </div>
            </div>
          </div>

          {/* Footer buttons */}
          <div className="pt-3 border-t border-slate-800 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-red-600 via-rose-600 to-amber-600 hover:from-red-500 hover:to-amber-500 shadow-lg shadow-red-950 flex items-center gap-2 transition-all"
            >
              <Check className="w-4 h-4 stroke-[2.5]" />
              <span>Enroll Patient & Enqueue</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
