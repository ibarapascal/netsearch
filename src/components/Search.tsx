import { useDebounce } from '@/hooks';
import { SearchParams } from '@/types';
import { Input, message } from 'antd';
import React, {
  ChangeEvent,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';

import { Content } from './Content';
import classes from './Search.module.scss';
import { Timer } from './Timer';

const INIT_PAGINATION = {
  page: 1,
  rowsPerPage: 5,
};

export function Search(): JSX.Element {
  const { state: debouncedInput, setState: setDebouncedInput } =
    useDebounce<string>('', 500);
  const handleChangeSearchInput = (e: ChangeEvent<HTMLInputElement>): void => {
    setDebouncedInput(e.target.value);
  };

  // reason to use Ref here
  // - to achieve a trigger-handler mode for the cached throttling request
  const isFinishedRef = useRef<boolean>(true);
  const [throttledParams, setThrottledParams] = useState<SearchParams>({
    input: '',
    ...INIT_PAGINATION,
  });
  // reason to use Ref here for pagination
  // - since we are throttling the requests, the UI status needs to keep corresponding with the data, so it's necessary to hold a backside value
  // - we are using a rendering-controled timer, update states could make the condition more complex
  const pageRef = useRef<number>(INIT_PAGINATION.page);
  const rowsPerPageRef = useRef<number>(INIT_PAGINATION.rowsPerPage);

  /**
   * Set the throttled state to re-render the component with previously throttled value to
   * - pass it to the child-component as a prop to make it re-render (make new request with it)
   * - reset the timer for the next throttling
   */
  const handleSetThrottled = useCallback(() => {
    setThrottledParams((params) => {
      // reset the current page if search condition / page size changes
      const resetPage =
        params.input !== debouncedInput ||
        params.rowsPerPage !== rowsPerPageRef.current;
      if (resetPage) {
        pageRef.current = INIT_PAGINATION.page;
      }
      return {
        input: debouncedInput,
        rowsPerPage: rowsPerPageRef.current,
        page: pageRef.current,
      };
    });
  }, [debouncedInput]);

  /**
   * Triggered once the timer finished, check if changes been made during the throttled time
   */
  const handleThrottleFinished = (): void => {
    // trigger the throttled if search condition or pagination changes
    const checkIfIsThrottled =
      throttledParams.input !== debouncedInput ||
      throttledParams.page !== pageRef.current ||
      throttledParams.rowsPerPage !== rowsPerPageRef.current;
    if (checkIfIsThrottled) {
      handleSetThrottled();
    } else {
      isFinishedRef.current = true;
    }
  };

  // give user an alert message about the throttling
  // optionally to use `useImperativeHandle` for further customization
  const timerRef = useRef<HTMLDivElement>(null);
  const noticeTimer = useCallback(() => {
    const leftTimeInSeconds = timerRef.current?.innerText ?? '0';
    const noticeText =
      leftTimeInSeconds === '0'
        ? 'Refreshing now..'
        : `Throttling.. refreshing in ${leftTimeInSeconds}s`;
    message.warning(noticeText, 1);
  }, []);

  /**
   * Common handler for both search condition and pagination changes
   */
  const throttleHandler = useCallback(() => {
    if (isFinishedRef.current) {
      isFinishedRef.current = false;
      handleSetThrottled();
    } else {
      noticeTimer();
    }
  }, [handleSetThrottled, noticeTimer]);

  const handleChangePagination = (
    currentPage: number,
    pageSize?: number,
  ): void => {
    pageRef.current = currentPage;
    rowsPerPageRef.current = pageSize ?? INIT_PAGINATION.rowsPerPage;
    throttleHandler();
  };

  useEffect(() => {
    if (debouncedInput) {
      throttleHandler();
    }
  }, [debouncedInput, throttleHandler]);

  return (
    <div>
      <div className={classes.Header}>
        The demo to search my Github content with debounce, throttle, and
        pagination
      </div>
      <div className={classes.Body}>
        <h2>Search</h2>
        <Input onChange={handleChangeSearchInput} />
        <Timer
          key={JSON.stringify(throttledParams)}
          ref={timerRef}
          running={!!debouncedInput}
          onFinished={handleThrottleFinished}
        />
        <h2>Result</h2>
        <Content
          // // optionally to add customized styles for the throttled effect
          // {...(condition && {
          //   className: classes.ContentInactive,
          // })}
          params={throttledParams}
          onChangePagination={handleChangePagination}
        />
      </div>
    </div>
  );
}
