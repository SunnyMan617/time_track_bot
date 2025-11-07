'use client';

import Timer from './components/Timer';
import StatsCard from './components/StatsCard';
import TaskList from './components/TaskList';
import ProjectList from './components/ProjectList';

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-2xl mx-auto p-4 space-y-6">
        {/* Header */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm">
          <h1 className="text-2xl font-bold mb-1">
            Welcome to Time Tracker!
          </h1>
          <p className="text-gray-600 dark:text-gray-400 text-sm">
            Track your time and boost productivity
          </p>
        </div>

        {/* Timer */}
        <Timer />

        {/* Stats */}
        <StatsCard />

        {/* Tasks */}
        <TaskList />

        {/* Projects */}
        <ProjectList />

        {/* Footer */}
        <div className="text-center text-xs text-gray-500 py-4">
          Time Tracker Bot • v1.0.0
        </div>
      </div>
    </div>
  );
}
