'use client';

import { useEffect } from 'react';
import { useExamStore } from '@/app/store/exam-store';
import { Clock } from 'lucide-react';

export function Timer() {
  const { timeRemaining, startTimer, _timerInterval } = useExamStore();

  useEffect(() => {
    // Start timer if not already running
    if (!_timerInterval) {
      startTimer();
    }

    // Cleanup on unmount
    return () => {
      if (_timerInterval) {
        clearInterval(_timerInterval);
      }
    };
  }, [startTimer, _timerInterval]);

  // Format time as MM:SS
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Determine timer color based on remaining time
  const getTimerColor = () => {
    if (timeRemaining <= 60) return 'text-red-500';
    if (timeRemaining <= 300) return 'text-orange-500';
    return 'text-foreground';
  };

  return (
    <div className={`flex items-center gap-2 font-mono text-lg font-medium ${getTimerColor()}`}>
      <Clock className="h-5 w-5" />
      <span>{formatTime(timeRemaining)}</span>
    </div>
  );
}