import React, { useState } from 'react';
import { 
  AlertCircle, 
  AlertTriangle, 
  ArrowDown, 
  ArrowUp, 
  Check, 
  Clock, 
  Flame, 
  Heart, 
  HelpCircle, 
  Play, 
  RefreshCw, 
  ShieldAlert, 
  Trash2, 
  User, 
  Zap 
} from 'lucide-react';
import { PatientRecord, TriageLevel } from '../types/ems';

interface QueueManagerProps {
  queue: PatientRecord[];
  onCallPatient: (patientId: string, bayId?: string) => void;
  onUpdatePriority: (patientId: string, newLevel: TriageLevel) => void;
  onRemoveFromQueue: (patientId: string) => void;
  availableBays: { id: string; name: string }[];
}

export const QueueManager: React.FC<QueueManagerProps> = ({
  queue,
  onCallPatient,
  onUpdatePriority,
  onRemoveFromQueue,
  availableBays,
}) => {
  const [selectedBay, setSelectedBay] = useState<string>(
    availableBays.length > 0 ? availableBays[0].id : ''
  );
  const [reTriagePatientId, setReTriagePatientId] = useState<string | null>(null);

  const emergencyPatients = queue.filter((p) => p.isEmergency);
  const normalPatients = queue.filter((p) => !p.isEmergency);
  const nextPatient = queue.length > 0 ? queue[0] : null;

  const formatWaitTime = (arrival: number): string => {
    const diff = Math.max(0, Math.floor((Date.now() - arrival) / (60 * 1000)));
    if (diff < 1) return '< 1 min';
    if (diff < 60) return `${diff}m`;
    const hours = Math.floor(diff / 60);
    const mins = diff % 60;
    return `${hours}h ${mins}m`;
  };

  const getTriageBadge = (level: TriageLevel) => {
    switch (level) {
      case 1:
        return {
          bg: 'bg-red-500/20 text-red-300 border-red-500/50',
          dot: 'bg-red-500',
          label: 'L1: Resuscitation (Emergency)',
        };
      case 2:
        return {
          bg: 'bg-amber-500/20 text-amber-300 border-amber-500/50',
          dot: 'bg-amber-500',
          label: 'L2: Emergent (Emergency)',
        };
      case 3:
        return {
          bg: 'bg-yellow-500/20 text-yellow-300 border-yellow-500/50',
          dot: 'bg-yellow-500',
          label: 'L3: Urgent (Emergency)',
        };
      case 4:
        return {
          bg: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/50',
          dot: 'bg-emerald-500',
          label: 'L4: Less Urgent (FIFO)',
        };
      case 5:
        return {
          bg: 'bg-blue-500/20 text-blue-300 border-blue-500/50',
          dot: 'bg-blue-500',
          label: 'L5: Non-Urgent (FIFO)',
        };
    }
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl shadow-xl overflow-hidden flex flex-col">
      {/* Queue Header */}
      <div className="p-4 bg-slate-950/80 border-b border-slate-800 flex flex-wrap items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <Flame className="w-5 h-5 text-red-500" />
              Live Emergency Triage Queue
            </h2>
            <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-red-950 text-red-300 border border-red-800/80">
              {queue.length} Waiting
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Priority Queue (Min-Heap): Emergencies prioritized first; normal cases follow FIFO.
          </p>
        </div>

        {/* Dispatch action button */}
        <div className="flex items-center gap-2">
          {availableBays.length > 0 ? (
            <div className="flex items-center gap-2">
              <select
                value={selectedBay}
                onChange={(e) => setSelectedBay(e.target.value)}
                className="px-2.5 py-1.5 bg-slate-900 border border-slate-700 rounded-lg text-xs text-white focus:outline-none focus:border-red-500"
              >
                {availableBays.map((bay) => (
                  <option key={bay.id} value={bay.id}>
                    Assign to: {bay.name}
                  </option>
                ))}
              </select>

              <button
                disabled={!nextPatient}
                onClick={() => nextPatient && onCallPatient(nextPatient.id, selectedBay)}
                className="px-3 py-1.5 rounded-lg text-xs font-bold text-white bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 shadow-md shadow-red-950 flex items-center gap-1.5 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Play className="w-3.5 h-3.5 fill-white" />
                <span>Call Highest Priority</span>
              </button>
            </div>
          ) : (
            <div className="px-3 py-1.5 rounded-lg bg-amber-950/60 border border-amber-800/60 text-[11px] font-medium text-amber-300 flex items-center gap-1.5">
              <AlertTriangle className="w-3.5 h-3.5" />
              <span>All ER Bays Full (Queue Buffered)</span>
            </div>
          )}
        </div>
      </div>

      {/* Next Patient Highlight Banner */}
      {nextPatient && (
        <div className="p-3.5 bg-gradient-to-r from-red-950/70 via-slate-900 to-slate-950 border-b border-red-900/50 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-red-600 flex items-center justify-center text-white font-black text-sm shadow-md shadow-red-950 animate-pulse">
              #1
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-red-300 uppercase tracking-wider">
                  Next To Be Dispatched:
                </span>
                <span className="text-sm font-bold text-white">{nextPatient.name}</span>
                <span className="font-mono text-xs text-slate-400">({nextPatient.id})</span>
              </div>
              <p className="text-xs text-slate-300 truncate max-w-lg">
                <span className="font-semibold text-red-400">Chief: </span>
                {nextPatient.chiefComplaint}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span
              className={`px-2 py-0.5 rounded text-[11px] font-semibold border ${
                getTriageBadge(nextPatient.triageLevel).bg
              }`}
            >
              {getTriageBadge(nextPatient.triageLevel).label}
            </span>
            <div className="text-xs font-mono text-slate-400 flex items-center gap-1">
              <Clock className="w-3 h-3 text-slate-500" />
              {formatWaitTime(nextPatient.arrivalTime)}
            </div>
          </div>
        </div>
      )}

      {/* Queue breakdown counts */}
      <div className="px-4 py-2 bg-slate-950/50 border-b border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-red-500"></span>
            <strong className="text-white">{emergencyPatients.length}</strong> Emergency Priority
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
            <strong className="text-white">{normalPatients.length}</strong> Normal FIFO
          </span>
        </div>
        <span className="text-[11px] text-slate-500 italic hidden sm:inline">
          Priority formula: Level 1 &gt; 2 &gt; 3 &gt; (Normal FIFO by Arrival)
        </span>
      </div>

      {/* Queue items list */}
      <div className="p-3 divide-y divide-slate-800/60 max-h-[460px] overflow-y-auto">
        {queue.length === 0 ? (
          <div className="py-12 text-center text-slate-500">
            <Check className="w-8 h-8 mx-auto text-emerald-500 mb-2 opacity-80" />
            <p className="text-sm font-medium text-slate-400">Queue is Clear</p>
            <p className="text-xs mt-1">No patients currently waiting for triage dispatch.</p>
          </div>
        ) : (
          queue.map((patient, index) => {
            const badge = getTriageBadge(patient.triageLevel);
            const isEditing = reTriagePatientId === patient.id;

            return (
              <div
                key={patient.id}
                className={`py-3 px-2 rounded-xl transition-all ${
                  index === 0
                    ? 'bg-red-950/20 hover:bg-red-950/30'
                    : patient.isEmergency
                    ? 'hover:bg-slate-800/40'
                    : 'hover:bg-slate-800/30'
                }`}
              >
                <div className="flex flex-wrap items-center justify-between gap-3">
                  {/* Left: Position and basic info */}
                  <div className="flex items-start gap-3">
                    <div
                      className={`w-7 h-7 rounded-lg flex items-center justify-center font-bold text-xs shrink-0 ${
                        patient.isEmergency
                          ? 'bg-red-900/60 text-red-200 border border-red-700/60'
                          : 'bg-slate-800 text-slate-300 border border-slate-700'
                      }`}
                    >
                      #{index + 1}
                    </div>

                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-semibold text-white text-sm">
                          {patient.name}
                        </span>
                        <span className="text-xs font-mono text-cyan-400">
                          {patient.id}
                        </span>
                        <span className="text-[11px] text-slate-400">
                          {patient.age}y / {patient.gender} / {patient.bloodGroup}
                        </span>
                        <span className="font-mono text-[10px] text-slate-500 px-1 py-0.2 rounded bg-slate-950 border border-slate-800">
                          addr: {patient.memoryAddress}
                        </span>
                      </div>

                      <p className="text-xs text-slate-300 mt-1 max-w-xl">
                        {patient.chiefComplaint}
                      </p>

                      {/* Vital signs summary chips */}
                      <div className="flex items-center gap-2 mt-2 flex-wrap text-[11px] text-slate-400 font-mono">
                        <span className="px-1.5 py-0.5 rounded bg-slate-950 border border-slate-800 flex items-center gap-1">
                          <Heart className="w-3 h-3 text-red-400" /> {patient.vitals.heartRate} bpm
                        </span>
                        <span className="px-1.5 py-0.5 rounded bg-slate-950 border border-slate-800">
                          BP: {patient.vitals.systolicBP}/{patient.vitals.diastolicBP}
                        </span>
                        <span className="px-1.5 py-0.5 rounded bg-slate-950 border border-slate-800">
                          SpO2: {patient.vitals.spo2}%
                        </span>
                        <span className="px-1.5 py-0.5 rounded bg-slate-950 border border-slate-800">
                          Pain: {patient.vitals.painScore}/10
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Right: Triage Tag, Wait Time & Actions */}
                  <div className="flex items-center gap-2">
                    <div className="text-right">
                      <div className={`px-2 py-0.5 rounded text-[11px] font-semibold border ${badge.bg}`}>
                        {badge.label}
                      </div>
                      <div className="text-[10px] text-slate-400 mt-1 flex items-center justify-end gap-1">
                        <Clock className="w-3 h-3 text-slate-500" />
                        Wait: {formatWaitTime(patient.arrivalTime)}
                      </div>
                    </div>

                    <div className="flex items-center gap-1 pl-2 border-l border-slate-800">
                      {/* Call now button */}
                      {availableBays.length > 0 && (
                        <button
                          onClick={() => onCallPatient(patient.id, selectedBay)}
                          title="Call into active bay"
                          className="p-1.5 rounded-lg bg-red-950/70 text-red-300 hover:bg-red-800 hover:text-white transition-all text-xs flex items-center gap-1"
                        >
                          <Play className="w-3 h-3 fill-current" />
                        </button>
                      )}

                      {/* Re-triage button */}
                      <button
                        onClick={() => setReTriagePatientId(isEditing ? null : patient.id)}
                        title="Re-triage (elevate or downgrade priority)"
                        className="p-1.5 rounded-lg bg-slate-800 text-slate-400 hover:text-cyan-300 hover:bg-slate-700 transition-all text-xs"
                      >
                        <RefreshCw className="w-3 h-3" />
                      </button>

                      {/* Cancel / Remove */}
                      <button
                        onClick={() => onRemoveFromQueue(patient.id)}
                        title="Remove patient from queue"
                        className="p-1.5 rounded-lg bg-slate-800 text-slate-400 hover:text-rose-400 hover:bg-slate-700 transition-all text-xs"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Inline re-triage priority switcher */}
                {isEditing && (
                  <div className="mt-2.5 p-2.5 rounded-lg bg-slate-950 border border-slate-800 flex items-center justify-between gap-2 animate-in fade-in">
                    <span className="text-xs text-slate-400 font-semibold flex items-center gap-1">
                      <ShieldAlert className="w-3.5 h-3.5 text-amber-400" />
                      Change ESI Triage Level:
                    </span>
                    <div className="flex items-center gap-1">
                      {([1, 2, 3, 4, 5] as TriageLevel[]).map((lvl) => (
                        <button
                          key={lvl}
                          onClick={() => {
                            onUpdatePriority(patient.id, lvl);
                            setReTriagePatientId(null);
                          }}
                          className={`px-2 py-1 rounded text-[11px] font-bold border ${
                            patient.triageLevel === lvl
                              ? 'bg-white text-slate-900 border-white'
                              : 'bg-slate-900 text-slate-400 border-slate-700 hover:text-white'
                          }`}
                        >
                          L{lvl}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
