import React, { useState } from 'react';
import { 
  Activity, 
  ArrowUpDown, 
  CheckCircle2, 
  Clock, 
  Download, 
  Eye, 
  FileSpreadsheet, 
  FileText, 
  Filter, 
  Heart, 
  Search, 
  User 
} from 'lucide-react';
import { PatientRecord, TriageLevel } from '../types/ems';

interface RecordsArchiveProps {
  patients: PatientRecord[];
}

export const RecordsArchive: React.FC<RecordsArchiveProps> = ({ patients }) => {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [triageFilter, setTriageFilter] = useState<string>('ALL');
  const [selectedPatient, setSelectedPatient] = useState<PatientRecord | null>(null);

  const filtered = patients.filter((p) => {
    const matchesSearch =
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.id.toLowerCase().includes(search.toLowerCase()) ||
      p.chiefComplaint.toLowerCase().includes(search.toLowerCase());

    const matchesStatus = statusFilter === 'ALL' || p.status === statusFilter;

    const matchesTriage =
      triageFilter === 'ALL' ||
      (triageFilter === 'EMERGENCY' && p.isEmergency) ||
      (triageFilter === 'NORMAL' && !p.isEmergency) ||
      p.triageLevel.toString() === triageFilter;

    return matchesSearch && matchesStatus && matchesTriage;
  });

  const exportJSON = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(patients, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `Hospital_Emergency_Records_${Date.now()}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const exportCSV = () => {
    const headers = ['ID', 'MemoryAddress', 'Name', 'Age', 'Gender', 'BloodGroup', 'TriageLevel', 'IsEmergency', 'Status', 'Complaint', 'HeartRate', 'BP', 'SpO2', 'Disposition'];
    const rows = patients.map((p) => [
      p.id,
      p.memoryAddress,
      `"${p.name.replace(/"/g, '""')}"`,
      p.age,
      p.gender,
      p.bloodGroup,
      p.triageLevel,
      p.isEmergency ? 'YES' : 'NO',
      p.status,
      `"${p.chiefComplaint.replace(/"/g, '""')}"`,
      p.vitals.heartRate,
      `${p.vitals.systolicBP}/${p.vitals.diastolicBP}`,
      p.vitals.spo2,
      `"${(p.disposition || 'Pending').replace(/"/g, '""')}"`,
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', encodeURI(csvContent));
    downloadAnchor.setAttribute('download', `Hospital_Emergency_Records_${Date.now()}.csv`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  return (
    <div className="space-y-5">
      {/* Top Header Card */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 pb-4">
          <div>
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <FileText className="w-5 h-5 text-blue-400" />
              Dynamic Patient Records & Maintenance Archive
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              Complete clinical registry maintained dynamically in Linked List nodes with disposition auditing.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={exportCSV}
              className="px-3.5 py-2 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-emerald-300 border border-slate-700 transition-all flex items-center gap-1.5"
            >
              <FileSpreadsheet className="w-3.5 h-3.5" />
              <span>Export CSV</span>
            </button>

            <button
              onClick={exportJSON}
              className="px-3.5 py-2 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-cyan-300 border border-slate-700 transition-all flex items-center gap-1.5"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export JSON</span>
            </button>
          </div>
        </div>

        {/* Filter bar */}
        <div className="mt-4 grid grid-cols-1 sm:grid-cols-4 gap-3">
          <div className="relative sm:col-span-2">
            <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-500" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by ID, Name, or Medical Complaint..."
              className="w-full pl-9 pr-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-blue-500"
            />
          </div>

          <div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-blue-500"
            >
              <option value="ALL">All Statuses ({patients.length})</option>
              <option value="waiting">Waiting in Queue</option>
              <option value="in_treatment">In Treatment (Bay)</option>
              <option value="discharged">Discharged / Completed</option>
            </select>
          </div>

          <div>
            <select
              value={triageFilter}
              onChange={(e) => setTriageFilter(e.target.value)}
              className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-blue-500"
            >
              <option value="ALL">All Triage Categories</option>
              <option value="EMERGENCY">Emergency Only (ESI 1-3)</option>
              <option value="NORMAL">Normal FIFO Only (ESI 4-5)</option>
              <option value="1">ESI Level 1 (Resuscitation)</option>
              <option value="2">ESI Level 2 (Emergent)</option>
              <option value="3">ESI Level 3 (Urgent)</option>
              <option value="4">ESI Level 4 (Less Urgent)</option>
              <option value="5">ESI Level 5 (Non-Urgent)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Table of Records */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl shadow-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-950 border-b border-slate-800 text-slate-400 uppercase font-mono text-[11px]">
              <tr>
                <th className="py-3 px-4">Node / ID</th>
                <th className="py-3 px-4">Patient Name</th>
                <th className="py-3 px-4">Demographics</th>
                <th className="py-3 px-4">Triage Priority</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Vitals Snapshot</th>
                <th className="py-3 px-4">Discharged / Notes</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-8 text-center text-slate-500">
                    No matching patient records found in linked list database.
                  </td>
                </tr>
              ) : (
                filtered.map((patient) => (
                  <tr key={patient.id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="py-3 px-4 font-mono">
                      <div className="font-bold text-cyan-400">{patient.id}</div>
                      <div className="text-[10px] text-slate-500">{patient.memoryAddress}</div>
                    </td>

                    <td className="py-3 px-4">
                      <div className="font-semibold text-white text-sm">{patient.name}</div>
                      <div className="text-[11px] text-slate-400 truncate max-w-xs" title={patient.chiefComplaint}>
                        {patient.chiefComplaint}
                      </div>
                    </td>

                    <td className="py-3 px-4 text-slate-300">
                      <div>{patient.age} yrs • {patient.gender}</div>
                      <div className="text-slate-500 text-[10px]">Blood: {patient.bloodGroup}</div>
                    </td>

                    <td className="py-3 px-4">
                      <span
                        className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold uppercase border ${
                          patient.triageLevel <= 3
                            ? 'bg-red-950/80 text-red-300 border-red-800/80'
                            : 'bg-emerald-950/80 text-emerald-300 border-emerald-800/80'
                        }`}
                      >
                        ESI L{patient.triageLevel}: {patient.isEmergency ? 'EMERGENCY' : 'NORMAL FIFO'}
                      </span>
                    </td>

                    <td className="py-3 px-4">
                      <span
                        className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-semibold ${
                          patient.status === 'in_treatment'
                            ? 'bg-amber-950 text-amber-300 border border-amber-800/60'
                            : patient.status === 'discharged'
                            ? 'bg-teal-950 text-teal-300 border border-teal-800/60'
                            : 'bg-slate-800 text-slate-300 border border-slate-700'
                        }`}
                      >
                        {patient.status.replace('_', ' ')}
                      </span>
                    </td>

                    <td className="py-3 px-4 font-mono text-[11px] text-slate-300">
                      <div>HR: {patient.vitals.heartRate} | BP: {patient.vitals.systolicBP}/{patient.vitals.diastolicBP}</div>
                      <div className="text-slate-500 text-[10px]">SpO2: {patient.vitals.spo2}% | Pain: {patient.vitals.painScore}/10</div>
                    </td>

                    <td className="py-3 px-4 text-slate-400 max-w-xs truncate">
                      {patient.disposition || patient.physicianNotes || 'In observation / waiting'}
                    </td>

                    <td className="py-3 px-4 text-right">
                      <button
                        onClick={() => setSelectedPatient(patient)}
                        className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white transition-colors flex items-center gap-1 text-[11px] ml-auto"
                      >
                        <Eye className="w-3 h-3" />
                        <span>Inspect</span>
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Patient Detail Modal */}
      {selectedPatient && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl p-6 space-y-4 max-h-[85vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <User className="w-5 h-5 text-cyan-400" />
                  {selectedPatient.name}
                </h3>
                <p className="text-xs text-slate-400 font-mono">
                  ID: {selectedPatient.id} | Node Memory: {selectedPatient.memoryAddress}
                </p>
              </div>
              <button
                onClick={() => setSelectedPatient(null)}
                className="text-slate-400 hover:text-white text-lg font-bold"
              >
                ✕
              </button>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-950 p-3 rounded-xl border border-slate-800 text-xs">
              <div>
                <span className="text-slate-500 block">Age / Gender</span>
                <span className="text-white font-semibold">{selectedPatient.age}y / {selectedPatient.gender}</span>
              </div>
              <div>
                <span className="text-slate-500 block">Blood Group</span>
                <span className="text-white font-semibold">{selectedPatient.bloodGroup}</span>
              </div>
              <div>
                <span className="text-slate-500 block">Triage Level</span>
                <span className="text-white font-semibold">ESI Level {selectedPatient.triageLevel}</span>
              </div>
              <div>
                <span className="text-slate-500 block">Status</span>
                <span className="text-cyan-400 font-semibold">{selectedPatient.status}</span>
              </div>
            </div>

            <div>
              <h4 className="text-xs font-bold uppercase text-slate-400 mb-1">Chief Medical Complaint</h4>
              <p className="text-xs text-slate-200 bg-slate-950 p-3 rounded-xl border border-slate-800">
                {selectedPatient.chiefComplaint}
              </p>
            </div>

            <div>
              <h4 className="text-xs font-bold uppercase text-slate-400 mb-1">Full Vital Signs Panel</h4>
              <div className="grid grid-cols-3 sm:grid-cols-4 gap-2 text-xs font-mono bg-slate-950 p-3 rounded-xl border border-slate-800">
                <div>HR: <strong className="text-red-400">{selectedPatient.vitals.heartRate} bpm</strong></div>
                <div>BP: <strong className="text-white">{selectedPatient.vitals.systolicBP}/{selectedPatient.vitals.diastolicBP}</strong></div>
                <div>SpO2: <strong className="text-cyan-400">{selectedPatient.vitals.spo2}%</strong></div>
                <div>Temp: <strong className="text-amber-400">{selectedPatient.vitals.temperature}°C</strong></div>
                <div>RR: <strong className="text-white">{selectedPatient.vitals.respiratoryRate}/min</strong></div>
                <div>Pain: <strong className="text-rose-400">{selectedPatient.vitals.painScore}/10</strong></div>
                <div>GCS: <strong className="text-emerald-400">{selectedPatient.vitals.gcs}/15</strong></div>
              </div>
            </div>

            {selectedPatient.physicianNotes && (
              <div>
                <h4 className="text-xs font-bold uppercase text-slate-400 mb-1">Physician Clinical Notes</h4>
                <p className="text-xs text-slate-300 bg-slate-950 p-3 rounded-xl border border-slate-800">
                  {selectedPatient.physicianNotes}
                </p>
              </div>
            )}

            {selectedPatient.disposition && (
              <div>
                <h4 className="text-xs font-bold uppercase text-slate-400 mb-1">Discharge Disposition</h4>
                <div className="text-xs text-emerald-300 bg-emerald-950/40 p-3 rounded-xl border border-emerald-900/60 font-semibold">
                  {selectedPatient.disposition}
                </div>
              </div>
            )}

            <div className="pt-2 border-t border-slate-800 flex justify-end">
              <button
                onClick={() => setSelectedPatient(null)}
                className="px-4 py-2 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-white"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
