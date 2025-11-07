'use client';

import { useEffect, useState } from 'react';
import { Plus, Folder, Clock } from 'lucide-react';

interface Project {
  id: string;
  name: string;
  color: string;
  tasks: any[];
  timeEntries: any[];
}

export default function ProjectList() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const res = await fetch(`/api/projects`);
      const { data } = await res.json();
      setProjects(data);
    } catch (error) {
      console.error('Failed to fetch projects:', error);
    } finally {
      setLoading(false);
    }
  };

  const getTotalTime = (project: Project) => {
    const total = project.timeEntries.reduce((acc, entry) => acc + (entry.duration || 0), 0);
    const hours = Math.floor(total / 3600);
    const mins = Math.floor((total % 3600) / 60);
    return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
  };

  if (loading) {
    return (
      <div className="space-y-3">
        {[1, 2].map((i) => (
          <div key={i} className="bg-white dark:bg-gray-800 rounded-xl p-4 animate-pulse">
            <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded mb-2"></div>
            <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Projects</h2>
        <button
          onClick={() => {
            // Navigate to create project page
          }}
          className="bg-blue-500 text-white p-2 rounded-lg hover:bg-blue-600 active:bg-blue-700"
        >
          <Plus className="w-5 h-5" />
        </button>
      </div>

      <div className="space-y-3">
        {projects.length === 0 ? (
          <div className="text-center py-8 text-gray-500">No projects found</div>
        ) : (
          projects.map((project) => (
            <div
              key={project.id}
              className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow cursor-pointer"
              onClick={() => {
                // Navigate to project details
              }}
            >
              <div className="flex items-start gap-3">
                <div
                  className="w-10 h-10 rounded-lg flex items-center justify-center"
                  style={{ backgroundColor: `${project.color}20` }}
                >
                  <Folder className="w-5 h-5" style={{ color: project.color }} />
                </div>

                <div className="flex-1 min-w-0">
                  <h3 className="font-medium mb-1">{project.name}</h3>

                  <div className="flex items-center gap-4 text-xs text-gray-500">
                    <div className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {getTotalTime(project)}
                    </div>
                    <div>{project.tasks.length} tasks</div>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

