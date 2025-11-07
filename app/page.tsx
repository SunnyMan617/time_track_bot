'use client';

import { useEffect, useState } from 'react';
import { initTelegramWebApp, getTelegramUser } from '@/src/lib/telegram';
import Timer from './components/Timer';
import StatsCard from './components/StatsCard';
import TaskList from './components/TaskList';
import ProjectList from './components/ProjectList';

export default function Home() {
  const [user, setUser] = useState<any>(null);
  const [userId, setUserId] = useState<string>('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const webApp = initTelegramWebApp();
    const telegramUser = getTelegramUser();

    if (telegramUser) {
      authenticateUser(webApp?.initData || '');
    } else {
      // For development/testing
      setLoading(false);
    }
  }, []);

  const authenticateUser = async (initData: string) => {
    try {
      const res = await fetch('/api/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ initData }),
      });

      const { user, error } = await res.json();

      if (error) {
        console.error('Authentication failed:', error);
        return;
      }

      setUser(user);
      setUserId(user.id);
    } catch (error) {
      console.error('Authentication error:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading...</p>
        </div>
      </div>
    );
  }

  if (!userId && !loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center p-4">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-2">Welcome to Time Tracker</h1>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            Please open this app from Telegram
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-2xl mx-auto p-4 space-y-6">
        {/* Header */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm">
          <h1 className="text-2xl font-bold mb-1">
            Welcome back{user?.firstName ? `, ${user.firstName}` : ''}!
          </h1>
          <p className="text-gray-600 dark:text-gray-400 text-sm">
            Track your time and boost productivity
          </p>
        </div>

        {/* Timer */}
        <Timer userId={userId} />

        {/* Stats */}
        <StatsCard userId={userId} />

        {/* Tasks */}
        <TaskList userId={userId} />

        {/* Projects */}
        <ProjectList userId={userId} />

        {/* Footer */}
        <div className="text-center text-xs text-gray-500 py-4">
          Time Tracker Bot • v1.0.0
        </div>
      </div>
    </div>
  );
}
