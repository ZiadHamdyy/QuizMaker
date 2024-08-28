import React from 'react';
import { useTimer } from 'react-timer-hook';

interface MyTimerProps {
  expiryTimestamp: Date;
}

export function MyTimer({ expiryTimestamp }: MyTimerProps) {
  const {
    seconds,
    minutes,
    hours,
    days,
  } = useTimer({ expiryTimestamp, onExpire: () => console.warn('onExpire called') });


  return (
    <div style={{textAlign: 'center'}}>
      <div style={{fontSize: '100px'}}>
        <span>{days}</span>:<span>{hours}</span>:<span>{minutes}</span>:<span>{seconds}</span>
      </div>
    </div>
  );
}