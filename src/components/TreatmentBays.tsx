import React, { useState } from 'react';
import { 
  Activity, 
  AlertCircle, 
  Bed, 
  CheckCircle, 
  Clock, 
  FileCheck, 
  Heart, 
  LogOut, 
  Pill, 
  Plus, 
  Stethoscope, 
  UserCheck 
} from 'lucide-react';
import { PatientRecord, TreatmentBay } from '../types/ems';

interface TreatmentBaysProps {
  bays: TreatmentBay[];
  patientsMap: Map<string, PatientRecord>;
  onCompleteTreatment: (patientId: string, bayId: string, disposition: string, notes: string) => void;
  onCallNextToBay: (bayId: string) => void;
  hasWaitingPatients: boolean;
}

export const TreatmentBays: React.FC<TreatmentBaysProps> = ({
  bays,
  patientsMap,
  onCompleteTreatment,
  onCallNextToBay,
  hasWaitingPatients,
}) => {
  const [activeDischargePatientId, setActiveDischargePatientId] = useState<string | null>(null);
  const [activeDischargeBayId, setActiveDischargeBayId] = useState<string | null>(null);
  const [disposition, setDisposition] = useState<string>('Discharged Home with Prescription');
  const [clinicalNotes, setClinicalNotes] = useState<string>('');

  const handleOpenDischarge = (patient: PatientRecord, bayId: string) => {
    setActiveDischargePatientId(patient.id);
    setActiveDischargeBayId(bayId);
    setClinicalNotes(patient.physicianNotes || 'Treatment protocol administered successfully. Patient stabilized.');
    setDisposition('Discharged Home with Prescription');
  };

  const handleConfirmDischarge = () => {
    if (activeDischargePatientId && activeDischargeBayId) {
      onCompleteTreatment(
        activeDischargePatientId,
        activeDischargeBayId,
        disposition,
        clinicalNotes
      );
      setActiveDischargePatientId(null);
      setActiveDischargeBayId(null);
      setClinicalNotes('');
    }
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl shadow-xl overflow-hidden flex flex-col">
      {/* Bays Header */}
      <div className="p-4 bg-slate-950/80 border-b border-slate-800 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Bed className="w-5 h-5 text-cyan-400" />
          <h2 className="text-base font-bold text-white">Emergency Treatment Bays</h2>
          <span className="text-xs px-2 py-0.5 rounded-full bg-cyan-950 text-cyan-300 border border-cyan-800/80">
            {bays.filter((b) => b.isOccupied).length} / {bays.length} Occupied
          </span>
        </div>
        <p className="text-xs text-slate-400 hidden sm:block">
          Physician Station & Real-Time Treatment Completion
        </p>
      </div>

      {/* Grid of 4 bays */}
      <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-4">
        {bays.map((bay) => {
          const patient = bay.currentPatientId ? patientsMap.get(bay.currentPatientId) : null;

          return (
            <div
              key={bay.id}
              className={`rounded-xl border transition-all ${
                bay.isOccupied
                  ? 'bg-slate-950 border-red-900/60 shadow-lg shadow-red-950/20'
                  : 'bg-slate-950/50 border-dashed border-slate-800 hover:border-slate-700'
              }`}
            >
              {/* Bay top bar */}
              <div className="p-3 border-b border-slate-800/80 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span
                    className={`w-2.5 h-2.5 rounded-full ${
                      bay.isOccupied ? 'bg-red-500 animate-pulse' : 'bg-emerald-500'
                    }`}
                  ></span>
                  <span className="text-sm font-bold text-white">{bay.name}</span>
                  <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-900 text-slate-400 border border-slate-800">
                    {bay.code}
                  </span>
                </div>

                <span
                  className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded border ${
                    bay.isOccupied
                      ? 'bg-red-950/80 text-red-300 border-red-800/80'
                      : 'bg-emerald-950/80 text-emerald-300 border-emerald-800/80'
                  }`}
                >
                  {bay.isOccupied ? 'OCCUPIED' : 'READY / AVAILABLE'}
                </span>
              </div>

              {/* Bay Content */}
              <div className="p-3">
                {bay.isOccupied && patient ? (
                  <div className="space-y-3">
                    {/* Patient summary */}
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-white text-base">{patient.name}</span>
                          <span className="text-xs font-mono text-cyan-400">{patient.id}</span>
                          <span className="text-[11px] text-slate-400">
                            {patient.age}y / {patient.gender}
                          </span>
                        </div>
                        <p className="text-xs text-slate-300 mt-1 line-clamp-2">
                          <span className="text-red-400 font-semibold">Chief:</span> {patient.chiefComplaint}
                        </p>
                      </div>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-red-950 text-red-300 border border-red-800 shrink-0">
                        ESI Level {patient.triageLevel}
                      </span>
                    </div>

                    {/* Vitals in treatment */}
                    <div className="grid grid-cols-4 gap-1.5 bg-slate-900/90 p-2 rounded-lg border border-slate-800 text-[11px] font-mono">
                      <div className="text-center">
                        <span className="block text-[9px] text-slate-500">HR</span>
                        <span className="text-red-400 font-bold">{patient.vitals.heartRate} bpm</span>
                      </div>
                      <div className="text-center">
                        <span className="block text-[9px] text-slate-500">BP</span>
                        <span className="text-slate-300 font-bold">{patient.vitals.systolicBP}/{patient.vitals.diastolicBP}</span>
                      </div>
                      <div className="text-center">
                        <span className="block text-[9px] text-slate-500">SpO2</span>
                        <span className="text-cyan-400 font-bold">{patient.vitals.spo2}%</span>
                      </div>
                      <div className="text-center">
                        <span className="block text-[9px] text-slate-500">GCS</span>
                        <span className="text-amber-400 font-bold">{patient.vitals.gcs}/15</span>
                      </div>
                    </div>

                    {/* Attending Team */}
                    <div className="text-[11px] text-slate-400 flex items-center justify-between border-t border-slate-800/60 pt-2">
                      <span className="flex items-center gap-1">
                        <Stethoscope className="w-3 h-3 text-cyan-400" />
                        {bay.attendingDoctor}
                      </span>
                      <span className="text-slate-500">{bay.attendingNurse}</span>
                    </div>

                    {/* Treatment Applied list */}
                    {patient.treatmentsApplied && patient.treatmentsApplied.length > 0 && (
                      <div className="text-xs text-slate-300 bg-slate-900/40 p-2 rounded border border-slate-800/60">
                        <span className="text-[10px] font-semibold text-slate-400 block mb-1">
                          Procedures / Medications Administered:
                        </span>
                        <div className="flex flex-wrap gap-1">
                          {patient.treatmentsApplied.map((t, idx) => (
                            <span
                              key={idx}
                              className="text-[10px] px-1.5 py-0.5 rounded bg-slate-800 text-slate-200 border border-slate-700"
                            >
                              {t}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Action buttons */}
                    <div className="pt-2 flex items-center justify-end gap-2">
                      <button
                        onClick={() => handleOpenDischarge(patient, bay.id)}
                        className="w-full py-2 px-3 rounded-lg text-xs font-bold text-white bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 shadow-md shadow-emerald-950 flex items-center justify-center gap-1.5 transition-all"
                      >
                        <FileCheck className="w-4 h-4" />
                        <span>Complete Treatment & Save Record</span>
                      </button>
                    </div>
                  </div>
                ) : (
                  /* Empty bay state */
                  <div className="py-6 text-center space-y-2">
                    <p className="text-xs text-slate-400">
                      Attending: <strong className="text-slate-300">{bay.attendingDoctor}</strong>
                    </p>
                    <p className="text-[11px] text-slate-500">
                      Nursing Staff: {bay.attendingNurse}
                    </p>

                    <div className="pt-2">
                      <button
                        disabled={!hasWaitingPatients}
                        onClick={() => onCallNextToBay(bay.id)}
                        className="px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-cyan-300 border border-slate-700 disabled:opacity-40 disabled:cursor-not-allowed transition-all inline-flex items-center gap-1.5"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>Admit Highest Priority Waiting Patient</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Discharge / Complete Treatment Modal */}
      {activeDischargePatientId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="w-full max-w-lg bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl p-5 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-emerald-400" />
                Complete Treatment & Discharge
              </h3>
              <button
                onClick={() => setActiveDischargePatientId(null)}
                className="text-slate-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Clinical Discharge Disposition
              </label>
              <select
                value={disposition}
                onChange={(e) => setDisposition(e.target.value)}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-sm text-white focus:outline-none focus:border-emerald-500"
              >
                <option value="Discharged Home with Prescription">Discharged Home with Prescription</option>
                <option value="Admitted to Intensive Care Unit (ICU)">Admitted to Intensive Care Unit (ICU)</option>
                <option value="Admitted to General Medical Ward">Admitted to General Medical Ward</option>
                <option value="Transferred to Specialized Surgical Center">Transferred to Specialized Surgical Center</option>
                <option value="Transferred to Cardiac Cath Lab">Transferred to Cardiac Cath Lab</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Final Clinical Notes & Summary (Stored in Linked List Node)
              </label>
              <textarea
                rows={3}
                value={clinicalNotes}
                onChange={(e) => setClinicalNotes(e.target.value)}
                placeholder="Enter discharge instructions, medications, follow-up..."
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-sm text-white focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-800">
              <button
                type="button"
                onClick={() => setActiveDischargePatientId(null)}
                className="px-3.5 py-1.5 rounded-lg text-xs font-medium text-slate-400 hover:text-white"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmDischarge}
                className="px-4 py-2 rounded-lg text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-500 shadow-md shadow-emerald-950 flex items-center gap-1.5"
              >
                <CheckCircle className="w-4 h-4" />
                Confirm Completion & Update Record
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
