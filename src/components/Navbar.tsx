import React, { useEffect, useState } from 'react';
import { 
  Activity, 
  AlertTriangle, 
  Bed, 
  BookOpen, 
  CheckCircle2, 
  Clock, 
  FileText, 
  Network, 
  Plus, 
  Volume2, 
  VolumeX, 
  Zap 
} from 'lucide-react';
import { getMuted, setMuted } from '../utils/audio';

interface NavbarProps {
  activeTab: 'floor' | 'linkedlist' | 'records' | 'tests' | 'report';
  setActiveTab: (tab: 'floor' | 'linkedlist' | 'records' | 'tests' | 'report') => void;
  onOpenTriage: () => void;
  onSimulateCodeRed: () => void;
  queueCount: number;
  emergencyQueueCount: number;
  occupiedBaysCount: number;
  totalBaysCount: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  onOpenTriage,
  onSimulateCodeRed,
  queueCount,
  emergencyQueueCount,
  occupiedBaysCount,
  totalBaysCount,
}) => {
  const [currentTime, setCurrentTime] = useState<string>('');
  const [muted, setMutedState] = useState<boolean>(getMuted());

  useEffect(() => {
    const update = () => {
      const now = new Date();
      setCurrentTime(
        now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })
      );
    };
    update();
    const interval = setInterval(update, 1000);
    return () => clearInterval(interval);
  }, []);

  const toggleMute = () => {
    const newMuted = !muted;
    setMuted(newMuted);
    setMutedState(newMuted);
  };

  return (
    <header className="sticky top-0 z-40 bg-slate-950/90 backdrop-blur-md border-b border-slate-800 text-slate-100">
      {/* Top emergency status ribbon */}
      <div className="bg-gradient-to-r from-red-950/80 via-slate-900 to-amber-950/70 px-4 py-1.5 border-b border-red-900/40 text-xs flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 font-semibold tracking-wide text-red-400">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
            </span>
            STATUS: ER TRIAGE ACTIVE
          </div>
          <span className="text-slate-600">|</span>
          <div className="flex items-center gap-1 text-slate-300">
            <Clock className="w-3.5 h-3.5 text-slate-400" />
            <span className="font-mono text-slate-200">{currentTime || '12:00:00'}</span>
          </div>
          <span className="text-slate-600 hidden sm:inline">|</span>
          <div className="hidden sm:flex items-center gap-1 text-slate-300">
            <Bed className="w-3.5 h-3.5 text-cyan-400" />
            <span>ER Bays:</span>
            <span className="font-semibold text-cyan-300">
              {occupiedBaysCount}/{totalBaysCount} Active
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1 bg-red-950/80 text-red-300 border border-red-800/60 px-2 py-0.5 rounded text-[11px] font-medium">
              <AlertTriangle className="w-3 h-3 text-red-400" />
              {emergencyQueueCount} Critical/Emergent
            </span>
            <span className="inline-flex items-center gap-1 bg-emerald-950/80 text-emerald-300 border border-emerald-800/60 px-2 py-0.5 rounded text-[11px] font-medium">
              <CheckCircle2 className="w-3 h-3 text-emerald-400" />
              {queueCount - emergencyQueueCount} Normal FIFO
            </span>
          </div>

          <button
            onClick={toggleMute}
            title={muted ? 'Unmute alerts' : 'Mute alerts'}
            className="p-1 rounded hover:bg-slate-800 text-slate-400 hover:text-slate-200 transition-colors"
          >
            {muted ? <VolumeX className="w-3.5 h-3.5 text-slate-500" /> : <Volume2 className="w-3.5 h-3.5 text-emerald-400" />}
          </button>
        </div>
      </div>

      {/* Main Bar */}
      <div className="max-w-7xl mx-auto px-4 py-3 flex flex-wrap items-center justify-between gap-4">
        {/* Brand */}
        <div className="flex items-center gap-3 cursor-pointer" onClick={() => setActiveTab('floor')}>
          <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-red-600 via-rose-600 to-amber-600 flex items-center justify-center shadow-lg shadow-red-950/50 border border-red-400/30">
            <Activity className="w-6 h-6 text-white stroke-[2.5]" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xl font-bold tracking-tight bg-gradient-to-r from-white via-slate-100 to-slate-300 bg-clip-text text-transparent">
                PULSE-EMS
              </span>
              <span className="text-[10px] font-bold tracking-wider uppercase px-1.5 py-0.5 rounded bg-red-900/50 text-red-300 border border-red-700/50">
                LEVEL 1 TRAUMA
              </span>
            </div>
            <p className="text-xs text-slate-400">Hospital Emergency & Triage Priority Engine</p>
          </div>
        </div>

        {/* Tab Navigation */}
        <nav className="flex items-center gap-1 bg-slate-900/90 p-1 rounded-xl border border-slate-800 overflow-x-auto text-xs">
          <button
            onClick={() => setActiveTab('floor')}
            className={`px-3 py-1.5 rounded-lg font-medium flex items-center gap-1.5 transition-all ${
              activeTab === 'floor'
                ? 'bg-red-600 text-white shadow-md shadow-red-950'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
            }`}
          >
            <Activity className="w-3.5 h-3.5" />
            <span>ER Floor & Queue</span>
            {queueCount > 0 && (
              <span className="ml-1 px-1.5 py-0.2 rounded-full text-[10px] bg-slate-950/70 text-slate-200">
                {queueCount}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('linkedlist')}
            className={`px-3 py-1.5 rounded-lg font-medium flex items-center gap-1.5 transition-all ${
              activeTab === 'linkedlist'
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-950'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
            }`}
          >
            <Network className="w-3.5 h-3.5" />
            <span>Linked List Visualizer</span>
          </button>

          <button
            onClick={() => setActiveTab('records')}
            className={`px-3 py-1.5 rounded-lg font-medium flex items-center gap-1.5 transition-all ${
              activeTab === 'records'
                ? 'bg-blue-600 text-white shadow-md shadow-blue-950'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Patient Records</span>
          </button>

          <button
            onClick={() => setActiveTab('tests')}
            className={`px-3 py-1.5 rounded-lg font-medium flex items-center gap-1.5 transition-all ${
              activeTab === 'tests'
                ? 'bg-emerald-600 text-white shadow-md shadow-emerald-950'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
            }`}
          >
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Test Cases</span>
          </button>

          <button
            onClick={() => setActiveTab('report')}
            className={`px-3 py-1.5 rounded-lg font-medium flex items-center gap-1.5 transition-all ${
              activeTab === 'report'
                ? 'bg-amber-600 text-white shadow-md shadow-amber-950'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>Technical Report</span>
          </button>
        </nav>

        {/* Action Buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={onSimulateCodeRed}
            title="Inject an emergency resuscitation patient to test priority preemption"
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold bg-red-950/80 text-red-200 border border-red-700/80 hover:bg-red-900 transition-all hover:scale-[1.02] shadow-sm"
          >
            <Zap className="w-3.5 h-3.5 text-red-400 fill-red-400" />
            <span className="hidden sm:inline">Simulate</span> Influx
          </button>

          <button
            onClick={onOpenTriage}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white shadow-md shadow-red-950/60 transition-all hover:scale-[1.02]"
          >
            <Plus className="w-4 h-4 stroke-[2.5]" />
            <span>Triage Patient</span>
          </button>
        </div>
      </div>
    </header>
  );
};
