import { useState, useCallback, useMemo } from 'react';
import { Operation, PushSwapState, HistoryItem } from '../types';

export function usePushSwap(initialSize: number = 20) {
  const generateRandomStack = (size: number) => {
    const arr = Array.from({ length: size }, (_, i) => i + 1);
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  };

  const createInitialState = (stackA: number[]): PushSwapState => ({
    initialStackA: [...stackA],
    stackA: [...stackA],
    stackB: [],
    history: [],
    stepCount: 0,
    viewIndex: null,
  });

  const [state, setState] = useState<PushSwapState>(() => createInitialState(generateRandomStack(initialSize)));

  const reset = useCallback((size: number = initialSize) => {
    setState(createInitialState(generateRandomStack(size)));
  }, [initialSize]);

  const setCustomStack = useCallback((numbers: number[]) => {
    setState(createInitialState(numbers));
  }, []);

  const setViewIndex = useCallback((index: number | null) => {
    setState(prev => ({ ...prev, viewIndex: index }));
  }, []);

  const isOpValid = useCallback((op: Operation, sA: number[], sB: number[]) => {
    switch (op) {
      case 'sa':
      case 'ra':
      case 'rra':
        return sA.length >= 2;
      case 'sb':
      case 'rb':
      case 'rrb':
        return sB.length >= 2;
      case 'ss':
      case 'rr':
      case 'rrr':
        return sA.length >= 2 && sB.length >= 2;
      case 'pa':
        return sB.length > 0;
      case 'pb':
        return sA.length > 0;
      default:
        return false;
    }
  }, []);

  const undo = useCallback(() => {
    setState(prev => {
      if (prev.history.length === 0 || prev.viewIndex !== null) return prev;
      
      const newHistory = prev.history.slice(0, -1);
      const lastState = newHistory.length > 0 
        ? newHistory[newHistory.length - 1] 
        : { stackA: prev.initialStackA, stackB: [] };

      return {
        ...prev,
        stackA: [...lastState.stackA],
        stackB: [...lastState.stackB],
        history: newHistory,
        stepCount: prev.stepCount - 1,
      };
    });
  }, []);

  const execute = useCallback((op: Operation) => {
    setState(prev => {
      // If we are viewing history, we can't execute (per user request)
      if (prev.viewIndex !== null) return prev;

      // Prevent no-op operations (per user request)
      if (!isOpValid(op, prev.stackA, prev.stackB)) return prev;

      let { stackA, stackB, history, stepCount } = { ...prev };
      stackA = [...stackA];
      stackB = [...stackB];

      switch (op) {
        case 'sa':
          if (stackA.length > 1) [stackA[0], stackA[1]] = [stackA[1], stackA[0]];
          break;
        case 'sb':
          if (stackB.length > 1) [stackB[0], stackB[1]] = [stackB[1], stackB[0]];
          break;
        case 'ss':
          if (stackA.length > 1) [stackA[0], stackA[1]] = [stackA[1], stackA[0]];
          if (stackB.length > 1) [stackB[0], stackB[1]] = [stackB[1], stackB[0]];
          break;
        case 'pa':
          if (stackB.length > 0) {
            stackA = [stackB[0], ...stackA];
            stackB = stackB.slice(1);
          }
          break;
        case 'pb':
          if (stackA.length > 0) {
            stackB = [stackA[0], ...stackB];
            stackA = stackA.slice(1);
          }
          break;
        case 'ra':
          if (stackA.length > 1) stackA = [...stackA.slice(1), stackA[0]];
          break;
        case 'rb':
          if (stackB.length > 1) stackB = [...stackB.slice(1), stackB[0]];
          break;
        case 'rr':
          if (stackA.length > 1) stackA = [...stackA.slice(1), stackA[0]];
          if (stackB.length > 1) stackB = [...stackB.slice(1), stackB[0]];
          break;
        case 'rra':
          if (stackA.length > 1) stackA = [stackA[stackA.length - 1], ...stackA.slice(0, -1)];
          break;
        case 'rrb':
          if (stackB.length > 1) stackB = [stackB[stackB.length - 1], ...stackB.slice(0, -1)];
          break;
        case 'rrr':
          if (stackA.length > 1) stackA = [stackA[stackA.length - 1], ...stackA.slice(0, -1)];
          if (stackB.length > 1) stackB = [stackB[stackB.length - 1], ...stackB.slice(0, -1)];
          break;
      }

      const newItem: HistoryItem = {
        op,
        timestamp: Date.now(),
        stackA: [...stackA],
        stackB: [...stackB],
      };

      return {
        ...prev,
        stackA,
        stackB,
        history: [...history, newItem],
        stepCount: stepCount + 1,
      };
    });
  }, []);

  const currentStacks = useMemo(() => {
    if (state.viewIndex === null) {
      return { stackA: state.stackA, stackB: state.stackB };
    }
    const item = state.history[state.viewIndex];
    return { stackA: item.stackA, stackB: item.stackB };
  }, [state.viewIndex, state.stackA, state.stackB, state.history]);

  const complexity = useMemo(() => {
    const n = state.initialStackA.length;
    if (n <= 3) return "O(1)";
    if (n <= 5) return "O(N)";
    return "O(N log N)";
  }, [state.initialStackA.length]);

  const canExecute = useCallback((op: Operation) => {
    return isOpValid(op, state.stackA, state.stackB);
  }, [isOpValid, state.stackA, state.stackB]);

  return {
    ...state,
    ...currentStacks,
    execute,
    reset,
    undo,
    setCustomStack,
    setViewIndex,
    canExecute,
    complexity,
    totalSize: state.initialStackA.length,
    isViewingHistory: state.viewIndex !== null
  };
}
