export type Operation = 
  | 'sa' | 'sb' | 'ss' 
  | 'pa' | 'pb' 
  | 'ra' | 'rb' | 'rr' 
  | 'rra' | 'rrb' | 'rrr';

export interface HistoryItem {
  op: Operation;
  timestamp: number;
  stackA: number[];
  stackB: number[];
}

export interface PushSwapState {
  initialStackA: number[];
  stackA: number[];
  stackB: number[];
  history: HistoryItem[];
  stepCount: number;
  viewIndex: number | null; // null means viewing the latest state
}
