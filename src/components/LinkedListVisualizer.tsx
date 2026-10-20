import React, { useState } from 'react';
import { 
  ArrowLeftRight, 
  ArrowRight, 
  CornerDownRight, 
  Database, 
  Layers, 
  Network, 
  Play, 
  Plus, 
  RotateCcw, 
  Search, 
  Sparkles, 
  Trash2, 
  Zap 
} from 'lucide-react';
import { NodeMemoryView } from '../dataStructures/LinkedList';
import { PatientRecord } from '../types/ems';

interface LinkedListVisualizerProps {
  nodes: NodeMemoryView<PatientRecord>[];
  onDeleteNode: (id: string) => void;
  onSearchNode: (query: string) => void;
  onInsertDummyHead: () => void;
  onInsertDummyTail: () => void;
}

export const LinkedListVisualizer: React.FC<LinkedListVisualizerProps> = ({
  nodes,
  onDeleteNode,
  onInsertDummyHead,
  onInsertDummyTail,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [highlightedIndex, setHighlightedIndex] = useState<number | null>(null);
  const [isTraversing, setIsTraversing] = useState(false);
  const [traversalLog, setTraversalLog] = useState<string[]>([]);

  const handleTraverse = async () => {
    if (nodes.length === 0 || isTraversing) return;
    setIsTraversing(true);
    setTraversalLog(['Starting traversal from HEAD pointer...']);

    for (let i = 0; i < nodes.length; i++) {
      setHighlightedIndex(i);
      const curr = nodes[i];
      setTraversalLog((prev) => [
        ...prev,
        `Visited Node [${i}] @ ${curr.address} (ID: ${curr.data.id}, Name: ${curr.data.name}) -> Next: ${curr.nextAddress || 'NULL'}`,
      ]);
      await new Promise((r) => setTimeout(r, 600));
    }

    setTraversalLog((prev) => [...prev, 'Reached TAIL -> next == NULL. Traversal complete.']);
    setIsTraversing(false);
  };

  const handleSearch = () => {
    if (!searchQuery.trim()) {
      setHighlightedIndex(null);
      return;
    }
    const q = searchQuery.toLowerCase();
    const foundIdx = nodes.findIndex(
      (n) =>
        n.data.id.toLowerCase().includes(q) ||
        n.data.name.toLowerCase().includes(q) ||
        n.address.toLowerCase().includes(q)
    );

    if (foundIdx !== -1) {
      setHighlightedIndex(foundIdx);
      setTraversalLog([`Match found at index [${foundIdx}] @ memory address ${nodes[foundIdx].address}`]);
    } else {
      setHighlightedIndex(null);
      setTraversalLog([`Search query "${searchQuery}" not found in current linked list memory.`]);
    }
  };

  const resetHighlight = () => {
    setHighlightedIndex(null);
    setSearchQuery('');
    setTraversalLog([]);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner & Control Deck */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 pb-4">
          <div>
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-xl bg-indigo-600/20 text-indigo-400 border border-indigo-500/30">
                <Network className="w-5 h-5" />
              </div>
              <h2 className="text-lg font-bold text-white">Dynamic Doubly-Linked List Memory Visualizer</h2>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Live representation of dynamic heap-allocated patient nodes with simulated virtual memory pointers (<code className="text-cyan-400 font-mono">prev</code>, <code className="text-cyan-400 font-mono">data</code>, <code className="text-cyan-400 font-mono">next</code>).
            </p>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <button
              disabled={isTraversing || nodes.length === 0}
              onClick={handleTraverse}
              className="px-3.5 py-2 rounded-xl text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 transition-all flex items-center gap-1.5 shadow-md shadow-indigo-950"
            >
              <Play className="w-3.5 h-3.5 fill-current" />
              <span>Traverse Nodes (Step-by-Step)</span>
            </button>

            <button
              onClick={onInsertDummyHead}
              className="px-3 py-2 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-all flex items-center gap-1"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Insert At Head</span>
            </button>

            <button
              onClick={onInsertDummyTail}
              className="px-3 py-2 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-all flex items-center gap-1"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Insert At Tail</span>
            </button>
          </div>
        </div>

        {/* Memory Architecture KPI Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4">
          <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 text-center">
            <span className="block text-[11px] text-slate-400">Total Allocated Nodes</span>
            <span className="text-lg font-black text-indigo-400 font-mono">{nodes.length}</span>
          </div>

          <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 text-center">
            <span className="block text-[11px] text-slate-400">HEAD Pointer</span>
            <span className="text-sm font-bold text-emerald-400 font-mono">
              {nodes.length > 0 ? nodes[0].address : 'NULL (0x0)'}
            </span>
          </div>

          <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 text-center">
            <span className="block text-[11px] text-slate-400">TAIL Pointer</span>
            <span className="text-sm font-bold text-amber-400 font-mono">
              {nodes.length > 0 ? nodes[nodes.length - 1].address : 'NULL (0x0)'}
            </span>
          </div>

          <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 text-center">
            <span className="block text-[11px] text-slate-400">Est. Heap Memory Size</span>
            <span className="text-sm font-bold text-cyan-400 font-mono">
              {nodes.length * 96} Bytes
            </span>
          </div>
        </div>

        {/* Search Toolbar */}
        <div className="mt-4 flex flex-wrap items-center gap-2">
          <div className="relative flex-1 min-w-[240px]">
            <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-500" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              placeholder="Search node by ID (PT-1001), Name, or Memory Address (0x2B18)..."
              className="w-full pl-9 pr-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-indigo-500"
            />
          </div>

          <button
            onClick={handleSearch}
            className="px-4 py-2 rounded-xl text-xs font-semibold bg-indigo-600/80 hover:bg-indigo-600 text-white transition-all"
          >
            Find Node (O(n))
          </button>

          {(highlightedIndex !== null || searchQuery) && (
            <button
              onClick={resetHighlight}
              className="px-3 py-2 rounded-xl text-xs font-medium bg-slate-800 text-slate-400 hover:text-white transition-all flex items-center gap-1"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Reset
            </button>
          )}
        </div>
      </div>

      {/* Traversal console log */}
      {traversalLog.length > 0 && (
        <div className="p-3 bg-slate-950 border border-slate-800 rounded-xl font-mono text-xs text-cyan-300 max-h-28 overflow-y-auto space-y-1">
          <div className="text-[10px] uppercase font-bold text-slate-500">
            Memory Pointer Traversal Log:
          </div>
          {traversalLog.map((log, i) => (
            <div key={i} className="flex items-center gap-1.5">
              <CornerDownRight className="w-3 h-3 text-slate-600 shrink-0" />
              <span>{log}</span>
            </div>
          ))}
        </div>
      )}

      {/* Interactive Linked List Graphical Chain */}
      <div className="bg-slate-950 border border-slate-800 rounded-2xl p-6 overflow-x-auto shadow-2xl">
        <div className="flex items-center gap-3 min-w-max pb-4">
          {/* HEAD Pointer Tag */}
          <div className="flex flex-col items-center justify-center p-3 rounded-xl bg-emerald-950/80 border border-emerald-700/80 text-emerald-300 font-mono text-xs font-bold shrink-0">
            <span className="text-[10px] text-emerald-400 uppercase tracking-widest">POINTER</span>
            <span className="text-sm">HEAD</span>
            <ArrowRight className="w-4 h-4 text-emerald-400 mt-1" />
          </div>

          {nodes.length === 0 ? (
            <div className="px-6 py-10 text-center text-slate-500 font-mono text-sm">
              Linked List is empty: HEAD = NULL, TAIL = NULL
            </div>
          ) : (
            nodes.map((node, idx) => {
              const isFirst = idx === 0;
              const isLast = idx === nodes.length - 1;
              const isHighlighted = highlightedIndex === idx;

              return (
                <React.Fragment key={node.data.id + idx}>
                  {/* Node Card */}
                  <div
                    className={`relative rounded-xl border p-4 w-72 shrink-0 transition-all ${
                      isHighlighted
                        ? 'bg-indigo-950/90 border-indigo-400 shadow-xl shadow-indigo-950/80 ring-2 ring-indigo-400 scale-[1.03]'
                        : 'bg-slate-900/90 border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    {/* Header: Node Index & Address */}
                    <div className="flex items-center justify-between border-b border-slate-800/80 pb-2 mb-2 font-mono text-xs">
                      <span className="text-slate-400 font-semibold">
                        Node [{idx}]
                      </span>
                      <span className="px-2 py-0.5 rounded bg-slate-950 text-cyan-300 border border-cyan-900/50 text-[11px] font-bold">
                        {node.address}
                      </span>
                    </div>

                    {/* Node Payload (Patient Data) */}
                    <div className="space-y-1.5 text-xs">
                      <div className="flex items-center justify-between">
                        <strong className="text-white text-sm truncate max-w-[150px]">
                          {node.data.name}
                        </strong>
                        <span className="font-mono text-cyan-400 text-xs">{node.data.id}</span>
                      </div>

                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span
                          className={`px-1.5 py-0.5 rounded text-[10px] font-bold uppercase ${
                            node.data.triageLevel <= 3
                              ? 'bg-red-950 text-red-300 border border-red-800'
                              : 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                          }`}
                        >
                          ESI L{node.data.triageLevel}
                        </span>

                        <span
                          className={`px-1.5 py-0.5 rounded text-[10px] font-medium ${
                            node.data.status === 'in_treatment'
                              ? 'bg-amber-950 text-amber-300'
                              : node.data.status === 'discharged'
                              ? 'bg-teal-950 text-teal-300'
                              : 'bg-slate-800 text-slate-300'
                          }`}
                        >
                          {node.data.status.replace('_', ' ')}
                        </span>
                      </div>

                      <p className="text-slate-400 text-[11px] truncate" title={node.data.chiefComplaint}>
                        {node.data.chiefComplaint}
                      </p>
                    </div>

                    {/* Pointer Fields (Memory Address Slots) */}
                    <div className="mt-3 pt-2.5 border-t border-slate-800 grid grid-cols-2 gap-2 text-[10px] font-mono">
                      <div className="p-1.5 bg-slate-950 rounded border border-slate-800 text-center">
                        <span className="block text-slate-500">prev_ptr</span>
                        <span className={node.prevAddress ? 'text-amber-300 font-semibold' : 'text-slate-600'}>
                          {node.prevAddress || 'NULL'}
                        </span>
                      </div>

                      <div className="p-1.5 bg-slate-950 rounded border border-slate-800 text-center">
                        <span className="block text-slate-500">next_ptr</span>
                        <span className={node.nextAddress ? 'text-emerald-300 font-semibold' : 'text-slate-600'}>
                          {node.nextAddress || 'NULL'}
                        </span>
                      </div>
                    </div>

                    {/* Delete Node Action */}
                    <div className="mt-2.5 pt-2 border-t border-slate-800/60 flex items-center justify-between">
                      <span className="text-[10px] text-slate-500">
                        {isFirst ? 'Head Node' : isLast ? 'Tail Node' : 'Internal Node'}
                      </span>
                      <button
                        onClick={() => onDeleteNode(node.data.id)}
                        title="Delete node & rewire pointers"
                        className="p-1 text-slate-500 hover:text-red-400 hover:bg-slate-800 rounded transition-colors text-[10px] flex items-center gap-1"
                      >
                        <Trash2 className="w-3 h-3" />
                        <span>Delete</span>
                      </button>
                    </div>
                  </div>

                  {/* Pointer Arrow to Next Node */}
                  {!isLast && (
                    <div className="flex flex-col items-center justify-center px-1 shrink-0 text-slate-500">
                      <div className="flex items-center gap-1 text-xs font-mono text-emerald-400">
                        <span>next</span>
                        <ArrowRight className="w-5 h-5 text-emerald-400" />
                      </div>
                      <div className="flex items-center gap-1 text-[10px] font-mono text-amber-400 mt-1">
                        <span>prev</span>
                        <ArrowRight className="w-3.5 h-3.5 rotate-180 text-amber-400" />
                      </div>
                    </div>
                  )}
                </React.Fragment>
              );
            })
          )}

          {/* TAIL Pointer Tag */}
          {nodes.length > 0 && (
            <div className="flex flex-col items-center justify-center p-3 rounded-xl bg-amber-950/80 border border-amber-700/80 text-amber-300 font-mono text-xs font-bold shrink-0">
              <span className="text-[10px] text-amber-400 uppercase tracking-widest">POINTER</span>
              <span className="text-sm">TAIL</span>
              <span className="text-[10px] text-slate-500 mt-1">next = NULL</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
