'use client';

import { useState, useEffect } from 'react';
import { Play, Square, Clock } from 'lucide-react';
import { hapticFeedback } from '@/src/lib/telegram';

interface TimerProps {
  userId: string;
  onStart?: () => void;
  onStop?: () => void;
}

export default function Timer({ userId, onStart, onStop }: TimerProps) {
  const [isRunning, setIsRunning] = useState(false);
  const [activeEntry, setActiveEntry] = useState<any>(null);
  const [elapsed, setElapsed] = useState(0);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchActiveTimer();
  }, [userId]);

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;

    if (isRunning && activeEntry) {
      interval = setInterval(() => {
        const startTime = new Date(activeEntry.startTime).getTime();
        const now = Date.now();
        setElapsed(Math.floor((now - startTime) / 1000));
      }, 1000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isRunning, activeEntry]);

  const fetchActiveTimer = async () => {
    try {
      const res = await fetch(`/api/time?userId=${userId}&action=active`);
      const { data } = await res.json();

      if (data) {
        setActiveEntry(data);
        setIsRunning(true);
        const startTime = new Date(data.startTime).getTime();
        const now = Date.now();
        setElapsed(Math.floor((now - startTime) / 1000));
      }
    } catch (error) {
      console.error('Failed to fetch active timer:', error);
    }
  };

  const startTimer = async () => {
    setLoading(true);
    hapticFeedback('impact', 'light');

    try {
      const res = await fetch('/api/time', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'start',
          userId,
        }),
      });

      const { data, error } = await res.json();

      if (error) {
        alert(error);
        return;
      }

      setActiveEntry(data);
      setIsRunning(true);
      setElapsed(0);
      hapticFeedback('notification', 'success');
      onStart?.();
    } catch (error) {
      console.error('Failed to start timer:', error);
      hapticFeedback('notification', 'error');
    } finally {
      setLoading(false);
    }
  };

  const stopTimer = async () => {
    if (!activeEntry) return;

    setLoading(true);
    hapticFeedback('impact', 'medium');

    try {
      const res = await fetch('/api/time', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'stop',
          userId,
          entryId: activeEntry.id,
        }),
      });

      const { data, error } = await res.json();

      if (error) {
        alert(error);
        return;
      }

      setActiveEntry(null);
      setIsRunning(false);
      setElapsed(0);
      hapticFeedback('notification', 'success');
      onStop?.();
    } catch (error) {
      console.error('Failed to stop timer:', error);
      hapticFeedback('notification', 'error');
    } finally {
      setLoading(false);
    }
  };

  const formatTime = (seconds: number) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs
      .toString()
      .padStart(2, '0')}`;
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Clock className="w-5 h-5 text-blue-500" />
          <h2 className="text-xl font-semibold">Timer</h2>
        </div>
      </div>

      <div className="text-center">
        <div className="text-5xl font-bold mb-6 font-mono">{formatTime(elapsed)}</div>

        <button
          onClick={isRunning ? stopTimer : startTimer}
          disabled={loading}
          className={`
            w-full py-4 rounded-xl font-semibold text-white transition-all
            flex items-center justify-center gap-2
            ${
              isRunning
                ? 'bg-red-500 hover:bg-red-600 active:bg-red-700'
                : 'bg-blue-500 hover:bg-blue-600 active:bg-blue-700'
            }
            disabled:opacity-50 disabled:cursor-not-allowed
          `}
        >
          {loading ? (
            <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
          ) : isRunning ? (
            <>
              <Square className="w-5 h-5" />
              Stop Timer
            </>
          ) : (
            <>
              <Play className="w-5 h-5" />
              Start Timer
            </>
          )}
        </button>

        {activeEntry?.task && (
          <div className="mt-4 text-sm text-gray-600 dark:text-gray-400">
            Tracking: {activeEntry.task.title}
          </div>
        )}
      </div>
    </div>
  );
}

