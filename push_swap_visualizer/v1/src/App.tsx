import { Terminal, Settings, RotateCcw, Plus, Undo2, ArrowLeft } from 'lucide-react';
import { usePushSwap } from './hooks/usePushSwap';
import { StackVisualizer } from './components/StackVisualizer';
import { Operation } from './types';
import { useState } from 'react';

export default function App() {
  const { 
    stackA, stackB, history, stepCount, totalSize, complexity, 
    execute, reset, undo, setCustomStack, setViewIndex, viewIndex, isViewingHistory, canExecute 
  } = usePushSwap(20);
  const [inputValue, setInputValue] = useState('');

  const handleAddNumbers = () => {
    if (!inputValue.trim()) return;
    const nums = inputValue.split(/[\s,]+/).map(n => parseInt(n.trim())).filter(n => !isNaN(n));
    if (nums.length > 0) {
      setCustomStack(nums);
      setInputValue('');
    }
  };

  const OpButton = ({ op, label, colorClass }: { op: Operation, label: string, colorClass: string }) => {
    const isValid = canExecute(op);
    const isDisabled = isViewingHistory || !isValid;

    return (
      <button
        disabled={isDisabled}
        onClick={() => execute(op)}
        className={`h-10 border border-outline-variant/30 text-[11px] font-bold ${colorClass} 
          ${isDisabled ? 'opacity-20 cursor-not-allowed' : 'hover:bg-white/5 active:scale-95 cursor-pointer'} 
          transition-all`}
      >
        {label}
      </button>
    );
  };

  return (
    <div className="h-screen flex flex-col bg-background text-on-surface font-body selection:bg-primary-container/30 overflow-hidden">
      {/* Header */}
      <header className="flex justify-between items-center w-full px-6 h-14 bg-surface shadow-[0_0_12px_rgba(0,255,200,0.1)] border-b border-outline-variant/10 z-50">
        <div className="flex items-center gap-3">
          <Terminal className="text-primary-container w-4 h-4" />
          <h1 className="text-lg font-bold text-primary-container tracking-widest font-headline uppercase">
            PUSH_SWAP_VISUALIZER
          </h1>
        </div>
        <div className="flex items-center gap-2">
          <button 
            onClick={() => reset()}
            className="flex items-center justify-center w-8 h-8 rounded-sm transition-all duration-200 active:scale-95 hover:bg-primary-container/10 text-outline"
            title="Reset Stacks"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
          <button className="flex items-center justify-center w-8 h-8 rounded-sm transition-all duration-200 active:scale-95 hover:bg-primary-container/10 text-outline">
            <Settings className="w-4 h-4" />
          </button>
        </div>
      </header>

      <main className="flex-1 flex overflow-hidden">
        {/* Left Column: Stacks Visualization */}
        <div className="flex-1 flex flex-col p-4 gap-4 overflow-hidden">
          {/* History Mode Banner */}
          {isViewingHistory && (
            <div className="bg-tertiary-fixed/10 border border-tertiary-fixed/30 p-2 rounded-sm flex justify-between items-center animate-pulse">
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold text-tertiary-fixed uppercase tracking-widest">History Mode Active</span>
              </div>
              <button 
                onClick={() => setViewIndex(null)}
                className="bg-tertiary-fixed/20 border border-tertiary-fixed/40 px-2 py-1 rounded-sm text-[10px] font-bold text-tertiary-fixed hover:bg-tertiary-fixed/30 transition-all flex items-center gap-2"
              >
                <ArrowLeft className="w-3 h-3" />
                Go Back
              </button>
            </div>
          )}

          <div className="flex-1 grid grid-cols-2 gap-4 min-h-0">
            <StackVisualizer 
              stack={stackA} 
              totalSize={totalSize} 
              label="STACK_A" 
              colorClass="bg-primary-container" 
              borderColorClass="border-primary-container"
            />
            <StackVisualizer 
              stack={stackB} 
              totalSize={totalSize} 
              label="STACK_B" 
              colorClass="bg-secondary-fixed" 
              borderColorClass="border-secondary-fixed"
            />
          </div>
        </div>

        {/* Right Column: Controls & History */}
        <aside className="w-80 bg-surface-container-low border-l border-outline-variant/10 flex flex-col overflow-hidden">
          <div className="flex-1 flex flex-col p-4 gap-6 overflow-y-auto custom-scrollbar">
            {/* Complexity & State */}
            <section className="flex flex-col gap-4">
              <div className="flex justify-between items-end">
                <div className="flex flex-col">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-outline mb-1 font-label">Current State</span>
                  <div className="flex gap-2">
                    <div className="bg-secondary-container/20 px-2 py-1 rounded-sm border border-outline-variant/15">
                      <span className="text-[10px] font-mono text-secondary-fixed">
                        STEPS: {stepCount.toString().padStart(4, '0')}
                      </span>
                    </div>
                    <div className="bg-surface-container-highest px-2 py-1 rounded-sm border border-outline-variant/15">
                      <span className="text-[10px] font-mono text-tertiary-fixed">
                        SIZE: {totalSize}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-outline mb-1 font-label">Complexity</span>
                  <p className="text-lg font-headline font-bold text-primary-fixed leading-none">{complexity}</p>
                </div>
              </div>
              
              <button
                disabled={isViewingHistory || history.length === 0}
                onClick={undo}
                className={`w-full bg-primary-container/10 px-3 py-2 rounded-sm border border-primary-container/30 flex items-center justify-center gap-2 transition-all
                  ${isViewingHistory || history.length === 0 ? 'opacity-20 cursor-not-allowed' : 'hover:bg-primary-container/20 active:scale-95 cursor-pointer'}
                `}
              >
                <Undo2 className="w-4 h-4 text-primary-container" />
                <span className="text-[10px] font-mono text-primary-container font-bold uppercase tracking-widest">Undo Last Operation</span>
              </button>
            </section>

            {/* Custom Input Section */}
            <section className={`flex flex-col gap-2 transition-opacity ${isViewingHistory ? 'opacity-30 pointer-events-none' : ''}`}>
              <span className="text-[10px] font-bold text-outline font-label uppercase tracking-widest">Load Custom Stack</span>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  placeholder="e.g. 5, 2, 8, 1"
                  className="flex-1 bg-surface-container-lowest border border-outline-variant/30 rounded-sm px-3 py-2 text-xs font-mono text-on-surface focus:outline-none focus:border-primary-container/50 transition-colors"
                  onKeyDown={(e) => e.key === 'Enter' && handleAddNumbers()}
                />
                <button
                  onClick={handleAddNumbers}
                  className="bg-primary-container/10 text-primary-container border border-primary-container/30 px-3 py-2 rounded-sm text-[10px] font-bold uppercase tracking-widest hover:bg-primary-container/20 active:scale-95 transition-all"
                >
                  <Plus className="w-3 h-3" />
                </button>
              </div>
            </section>

            {/* Controls */}
            <section className="flex flex-col gap-4">
              <div className="flex flex-col gap-2">
                <span className="text-[10px] font-bold text-outline font-label uppercase tracking-tighter">SWAP</span>
                <div className="grid grid-cols-3 gap-1">
                  <OpButton op="sa" label="sa" colorClass="text-primary-fixed" />
                  <OpButton op="sb" label="sb" colorClass="text-secondary-fixed" />
                  <OpButton op="ss" label="ss" colorClass="text-on-surface" />
                </div>
              </div>
              
              <div className="flex flex-col gap-2">
                <span className="text-[10px] font-bold text-outline font-label uppercase tracking-tighter">PUSH</span>
                <div className="grid grid-cols-2 gap-1">
                  <OpButton op="pa" label="pa" colorClass="text-primary-fixed" />
                  <OpButton op="pb" label="pb" colorClass="text-secondary-fixed" />
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <span className="text-[10px] font-bold text-outline font-label uppercase tracking-tighter">ROTATE</span>
                <div className="grid grid-cols-3 gap-1">
                  <OpButton op="ra" label="ra" colorClass="text-primary-fixed" />
                  <OpButton op="rb" label="rb" colorClass="text-secondary-fixed" />
                  <OpButton op="rr" label="rr" colorClass="text-on-surface" />
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <span className="text-[10px] font-bold text-outline font-label uppercase tracking-tighter">REVERSE ROTATE</span>
                <div className="grid grid-cols-3 gap-1">
                  <OpButton op="rra" label="rra" colorClass="text-primary-fixed" />
                  <OpButton op="rrb" label="rrb" colorClass="text-secondary-fixed" />
                  <OpButton op="rrr" label="rrr" colorClass="text-on-surface" />
                </div>
              </div>
            </section>

            {/* History */}
            <section className="flex flex-col gap-2 border-t border-outline-variant/10 pt-4">
              <div className="flex justify-between items-center">
                <span className="text-[10px] font-bold text-outline font-label uppercase tracking-widest">Operation History</span>
                <span className="text-[10px] font-mono text-primary-fixed/40">Total: {history.length}</span>
              </div>
              <div className="flex flex-wrap gap-1.5 max-h-[150px] overflow-y-auto custom-scrollbar p-1">
                {history.map((item, i) => (
                  <div 
                    key={i} 
                    onClick={() => setViewIndex(i)}
                    className={`group relative bg-surface-container-highest px-2 py-1 flex items-center gap-2 border-l-2 cursor-pointer transition-all hover:brightness-125 ${
                      viewIndex === i ? 'ring-1 ring-tertiary-fixed brightness-125' : ''
                    } ${
                      item.op.startsWith('s') ? 'border-on-surface' : 
                      item.op.startsWith('p') ? 'border-secondary-fixed' : 
                      'border-primary-container'
                    }`}
                  >
                    <span className={`text-[10px] font-mono ${
                      item.op.startsWith('s') ? 'text-on-surface' : 
                      item.op.startsWith('p') ? 'text-secondary-fixed' : 
                      'text-primary-fixed'
                    }`}>{item.op}</span>
                  </div>
                ))}
                {history.length === 0 && (
                  <span className="text-[10px] font-mono text-outline/30 italic">No operations yet</span>
                )}
              </div>
            </section>
          </div>
        </aside>
      </main>
    </div>
  );
}
