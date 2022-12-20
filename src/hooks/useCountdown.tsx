import { useCallback, useEffect, useState } from 'react';

interface UseCountdownReturn {
  // the left amount of the count
  time: number;
}

interface UseCountdownProps {
  // the amount to count
  initCount?: number;
  // flag to run the counter
  initRunning?: boolean;
  // count step, default as 1000 (1 second)
  step?: number;
  // callback once finish the count
  onFinished?: () => void;
}

/**
 * The hook to countdown till zero
 */
export function useCountdown({
  initCount = 10,
  initRunning = true,
  step = 1000,
  onFinished = (): void => {},
}: UseCountdownProps): UseCountdownReturn {
  const [time, setTime] = useState<number>(initCount);

  const timer = useCallback(
    () =>
      setTimeout(() => {
        if (time > 0) {
          setTime((t) => t - 1);
        } else {
          onFinished && onFinished();
        }
      }, step),
    [time, onFinished, step],
  );

  if (!initRunning) {
    clearTimeout(timer());
  }

  useEffect(() => {
    initRunning && timer();
  }, [timer, initRunning]);

  return { time };
}
