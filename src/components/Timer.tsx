import { useCountdown } from '@/hooks';
import React, { forwardRef } from 'react';

interface TimerProps {
  running: boolean;
  onFinished: () => void;
}

// The REST API has a custom rate limit for searching.
// For requests using Basic Authentication, OAuth, or client ID and secret, you can make up to 30 requests per minute.
// For unauthenticated requests, the rate limit allows you to make up to 10 requests per minute.
// ref: https://docs.github.com/en/rest/search?apiVersion=2022-11-28#rate-limit

// so we define the counter amount as 6 (10 per minute)
const COUNTER_PER_REQUEST = 6;

export const Timer = forwardRef<HTMLDivElement, TimerProps>(
  ({ running, onFinished }, ref): JSX.Element => {
    const { time } = useCountdown({
      initCount: COUNTER_PER_REQUEST,
      initRunning: running,
      onFinished,
    });

    // currently hidden, could be shown as well with some adjustments/conditions, depends on the UX we want
    return (
      <h2 ref={ref} style={{ display: 'none' }}>
        {time}
      </h2>
    );
  },
);
