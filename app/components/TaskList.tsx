'use client';

import { useEffect, useState } from 'react';
import { Plus, CheckCircle, Circle, Clock, AlertCircle } from 'lucide-react';

interface Task {
  id: string;
  title: string;
  status: string;
  priority: string;
  project?: { name: string; color: string };
}

export default function TaskList() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'TODO' | 'IN_PROGRESS' | 'DONE'>('all');

  useEffect(() => {
    fetchTasks();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filter]);

  const fetchTasks = async () => {
    try {
      const url = filter === 'all' ? `/api/tasks` : `/api/tasks?status=${filter}`;
      const res = await fetch(url);
      const { data } = await res.json();
      setTasks(data);
    } catch (error) {
      console.error('Failed to fetch tasks:', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleTaskStatus = async (taskId: string, currentStatus: string) => {
    const newStatus = currentStatus === 'DONE' ? 'TODO' : 'DONE';

    try {
      await fetch('/api/tasks', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          taskId,
          status: newStatus,
        }),
      });

      fetchTasks();
    } catch (error) {
      console.error('Failed to update task:', error);
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'URGENT':
        return 'text-red-500';
      case 'HIGH':
        return 'text-orange-500';
      case 'MEDIUM':
        return 'text-yellow-500';
      default:
        return 'text-gray-400';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'DONE':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'IN_PROGRESS':
        return <Clock className="w-5 h-5 text-blue-500" />;
      default:
        return <Circle className="w-5 h-5 text-gray-400" />;
    }
  };

  if (loading) {
    return (
      <div className="space-y-3">
        {[1, 2, 3].map((i) => (
          <div key={i} className="bg-white dark:bg-gray-800 rounded-xl p-4 animate-pulse">
            <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded mb-2"></div>
            <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-2/3"></div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Tasks</h2>
        <button
          onClick={() => {
            // Navigate to create task page
          }}
          className="bg-blue-500 text-white p-2 rounded-lg hover:bg-blue-600 active:bg-blue-700"
        >
          <Plus className="w-5 h-5" />
        </button>
      </div>

      <div className="flex gap-2 overflow-x-auto pb-2">
        {['all', 'TODO', 'IN_PROGRESS', 'DONE'].map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f as 'all' | 'TODO' | 'IN_PROGRESS' | 'DONE')}
            className={`
              px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all
              ${
                filter === f
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400'
              }
            `}
          >
            {f === 'all' ? 'All' : f.replace('_', ' ')}
          </button>
        ))}
      </div>

      <div className="space-y-3">
        {tasks.length === 0 ? (
          <div className="text-center py-8 text-gray-500">No tasks found</div>
        ) : (
          tasks.map((task) => (
            <div
              key={task.id}
              className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="flex items-start gap-3">
                <button onClick={() => toggleTaskStatus(task.id, task.status)} className="mt-0.5">
                  {getStatusIcon(task.status)}
                </button>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h3
                      className={`font-medium ${
                        task.status === 'DONE' ? 'line-through text-gray-400' : ''
                      }`}
                    >
                      {task.title}
                    </h3>
                    <AlertCircle className={`w-4 h-4 ${getPriorityColor(task.priority)}`} />
                  </div>

                  {task.project && (
                    <div className="flex items-center gap-1 text-xs">
                      <div
                        className="w-2 h-2 rounded-full"
                        style={{ backgroundColor: task.project.color }}
                      ></div>
                      <span className="text-gray-500">{task.project.name}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

