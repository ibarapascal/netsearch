import { debounce } from 'lodash';
import { useCallback, useState } from 'react';

interface UseDebounceReturn<T> {
  state: T;
  setState: (value: T) => void;
}

/**
 * The hook to debounce state, to use for props, etc
 * @param initialState the default value
 * @param wait the debounce time
 * @returns
 */
export function useDebounce<S>(
  initialState: S | (() => S),
  wait: number = 1000,
): UseDebounceReturn<S> {
  const [state, setState] = useState<S>(initialState);

  const setDebounce = debounce((value: S) => {
    setState(value);
  }, wait);

  const setDebouncedState = useCallback(
    (value: S) => {
      setDebounce(value);
    },
    [setDebounce],
  );

  return { state, setState: setDebouncedState };
}
