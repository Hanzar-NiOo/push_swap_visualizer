import { motion, AnimatePresence } from 'motion/react';

interface StackVisualizerProps {
  stack: number[];
  totalSize: number;
  label: string;
  colorClass: string;
  borderColorClass: string;
}

export function StackVisualizer({ stack, totalSize, label, colorClass, borderColorClass }: StackVisualizerProps) {
  return (
    <div className="bg-surface-container-lowest border border-outline-variant/10 rounded-sm relative overflow-hidden flex flex-col h-full">
      <div className={`absolute top-2 ${label === 'STACK_A' ? 'left-2' : 'right-2'} z-10`}>
        <span className={`text-[10px] font-bold ${colorClass}/50 font-label`}>{label}</span>
      </div>
      <div className="flex-1 flex flex-col justify-start items-center p-4 gap-0.5 overflow-y-auto custom-scrollbar">
        <AnimatePresence initial={false}>
          {stack.map((val) => {
            const widthPercent = (val / totalSize) * 95;
            return (
              <motion.div
                key={val}
                layout
                initial={{ opacity: 0, scaleX: 0 }}
                animate={{ opacity: 1, scaleX: 1 }}
                exit={{ opacity: 0, scaleX: 0 }}
                transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                className={`h-4 ${colorClass} shadow-[0_0_8px_rgba(0,255,200,0.2)] origin-center relative group cursor-default`}
                style={{ width: `${widthPercent}%` }}
              >
                {/* Tooltip */}
                <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-[#ffffff] border border-outline-variant/30 px-2 py-1 rounded-sm opacity-0 group-hover:opacity-100 transition-all pointer-events-none z-20 shadow-xl scale-90 group-hover:scale-100">
                  <span className="text-[10px] font-mono font-bold text-black">{val}</span>
                  {/* Tooltip Arrow */}
                  <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-[#ffffff] border-r border-b border-outline-variant/30 rotate-45"></div>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </div>
  );
}
