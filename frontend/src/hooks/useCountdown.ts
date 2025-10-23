'use client';

import { useState, useEffect } from 'react';

export function useCountdown(initialTime: number, onComplete?: () => void) {
  const [timeLeft, setTimeLeft] = useState(initialTime);
  const [isActive, setIsActive] = useState(true);

  useEffect(() => {
    if (!isActive || timeLeft <= 0) {
      if (timeLeft <= 0 && onComplete) {
        onComplete();
      }
      return;
    }

    const timer = setTimeout(() => {
      setTimeLeft(prevTime => prevTime - 1);
    }, 1000);

    return () => clearTimeout(timer);
  }, [timeLeft, isActive, onComplete]);

  const start = () => setIsActive(true);
  const pause = () => setIsActive(false);
  const reset = () => {
    setIsActive(false);
    setTimeLeft(initialTime);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  return {
    timeLeft,
    formattedTime: formatTime(timeLeft),
    isActive,
    start,
    pause,
    reset,
  };
}
