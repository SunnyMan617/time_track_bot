'use client';

import { useEffect, useState } from 'react';
import { Clock, CheckCircle, Target, Folder } from 'lucide-react';

interface StatsCardProps {
  userId: string;
}

export default function StatsCard({ userId }: StatsCardProps) {
  const [stats, setStats] = useState({
    today: 0,
    thisWeek: 0,
    thisMonth: 0,
    totalTasks: 0,
    completedTasks: 0,
    activeProjects: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, [userId]);

  const fetchStats = async () => {
    try {
      const res = await fetch(`/api/time?userId=${userId}&action=stats`);
      const { data } = await res.json();
      setStats(data);
    } catch (error) {
      console.error('Failed to fetch stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDuration = (seconds: number) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    return hrs > 0 ? `${hrs}h ${mins}m` : `${mins}m`;
  };

  if (loading) {
    return (
      <div className="grid grid-cols-2 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="bg-white dark:bg-gray-800 rounded-xl p-4 animate-pulse">
            <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded mb-2"></div>
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-4">
      <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-4 text-white">
        <Clock className="w-6 h-6 mb-2 opacity-80" />
        <div className="text-2xl font-bold">{formatDuration(stats.today)}</div>
        <div className="text-xs opacity-80">Today</div>
      </div>

      <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl p-4 text-white">
        <CheckCircle className="w-6 h-6 mb-2 opacity-80" />
        <div className="text-2xl font-bold">{stats.completedTasks}</div>
        <div className="text-xs opacity-80">Completed</div>
      </div>

      <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl p-4 text-white">
        <Target className="w-6 h-6 mb-2 opacity-80" />
        <div className="text-2xl font-bold">{stats.totalTasks}</div>
        <div className="text-xs opacity-80">Total Tasks</div>
      </div>

      <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl p-4 text-white">
        <Folder className="w-6 h-6 mb-2 opacity-80" />
        <div className="text-2xl font-bold">{stats.activeProjects}</div>
        <div className="text-xs opacity-80">Projects</div>
      </div>
    </div>
  );
}

