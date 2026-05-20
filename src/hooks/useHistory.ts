import { useState, useCallback, useRef } from 'react';

export function useHistory<T>(initialState: T) {
  const [state, setStateInternal] = useState<T>(initialState);
  
  // Track meta state for canUndo/canRedo to avoid reading refs during render
  const [historyMeta, setHistoryMeta] = useState({ index: 0, length: 1 });
  
  const historyRef = useRef<T[]>([initialState]);
  const indexRef = useRef(0);

  const setState = useCallback((newState: T | ((prev: T) => T)) => {
    setStateInternal((prev) => {
      const next = typeof newState === 'function' ? (newState as (prev: T) => T)(prev) : newState;
      return next;
    });
  }, []);

  const saveState = useCallback(() => {
    setStateInternal((current) => {
      historyRef.current = [...historyRef.current.slice(0, indexRef.current + 1), current];
      indexRef.current = historyRef.current.length - 1;
      setHistoryMeta({ index: indexRef.current, length: historyRef.current.length });
      return current;
    });
  }, []);

  const undo = useCallback(() => {
    if (indexRef.current > 0) {
      indexRef.current -= 1;
      setHistoryMeta({ index: indexRef.current, length: historyRef.current.length });
      setStateInternal(historyRef.current[indexRef.current]);
    }
  }, []);

  const redo = useCallback(() => {
    if (indexRef.current < historyRef.current.length - 1) {
      indexRef.current += 1;
      setHistoryMeta({ index: indexRef.current, length: historyRef.current.length });
      setStateInternal(historyRef.current[indexRef.current]);
    }
  }, []);

  return {
    state,
    setState,
    undo,
    redo,
    saveState,
    canUndo: historyMeta.index > 0,
    canRedo: historyMeta.index < historyMeta.length - 1,
  };
}
