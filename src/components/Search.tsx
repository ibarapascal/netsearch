import { useDebounce } from '@/hooks';
import { Input, message } from 'antd';
import React, { ChangeEvent, useEffect, useRef, useState } from 'react';

import { Content } from './Content';
import classes from './Search.module.scss';
import { Timer } from './Timer';

export function Search(): JSX.Element {
  const { state: debouncedInput, setState: setDebouncedInput } =
    useDebounce<string>('', 500);
  const handleChangeSearchInput = (e: ChangeEvent<HTMLInputElement>): void => {
    setDebouncedInput(e.target.value);
  };

  const isFinishedRef = useRef<boolean>(true);
  const [throttledInput, setThrottledInput] = useState<string>('');
  const handleThrottleFinished = (): void => {
    if (throttledInput !== debouncedInput) {
      setThrottledInput(debouncedInput);
    } else {
      isFinishedRef.current = true;
    }
  };

  const timerRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (debouncedInput) {
      if (isFinishedRef.current) {
        isFinishedRef.current = false;
        setThrottledInput(debouncedInput);
      } else {
        const leftTimeInSeconds = timerRef.current?.innerText ?? 0;
        message.warning(`Throttling.. refreshing in ${leftTimeInSeconds}s`, 1);
      }
    }
  }, [debouncedInput]);

  return (
    <div>
      <div className={classes.header}>
        The demo to search my Github content with debounce, throttle, and
        pagination
      </div>
      <div className={classes.body}>
        <h2>Search</h2>
        <Input onChange={handleChangeSearchInput} />
        <Timer
          key={throttledInput}
          ref={timerRef}
          running={!!debouncedInput}
          onFinished={handleThrottleFinished}
        />
        <h2>Result</h2>
        <Content searchKeyword={throttledInput} />
      </div>
    </div>
  );
}
