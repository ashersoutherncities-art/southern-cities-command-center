'use client';

import { useState, useEffect } from 'react';
import { api } from '@/lib/api';

interface Project {
  id: number;
  name: string;
  description: string;
  status: string;
  category: string;
  progress: number;
  budget: number;
  target_completion: string;
}

export default function ProjectsWidget({ onUpdate }: { onUpdate?: () => void }) {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadProjects();
  }, []);

  const loadProjects = async () => {
    try {
      const data = await api.getProjects({ status: 'active' });
      setProjects(data as Project[]);
    } catch (error) {
      console.error('Error loading projects:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      planning: 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300',
      active: 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300',
      paused: 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300',
      completed: 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300',
    };
    return colors[status] || colors.planning;
  };

  const getCategoryIcon = (category: string) => {
    const icons: Record<string, string> = {
      development: '🏗️',
      acquisition: '🏡',
      contracting: '🔨',
      brokerage: '🤝',
      business: '💼',
    };
    return icons[category] || '📁';
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
          📊 Active Projects
        </h2>
        <span className="text-sm text-gray-500 dark:text-gray-400">
          {projects.length} active
        </span>
      </div>

      <div className="space-y-3 max-h-96 overflow-y-auto">
        {loading ? (
          <div className="text-center py-8 text-gray-500">Loading...</div>
        ) : projects.length === 0 ? (
          <div className="text-center py-8 text-gray-500">No active projects</div>
        ) : (
          projects.map(project => (
            <div
              key={project.id}
              className="p-3 rounded-lg border border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between gap-2 mb-2">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-lg">{getCategoryIcon(project.category)}</span>
                    <h3 className="text-sm font-medium text-gray-900 dark:text-white truncate">
                      {project.name}
                    </h3>
                  </div>
                  {project.description && (
                    <p className="text-xs text-gray-600 dark:text-gray-400 line-clamp-2">
                      {project.description}
                    </p>
                  )}
                </div>
                <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(project.status)}`}>
                  {project.status}
                </span>
              </div>

              {/* Progress Bar */}
              <div className="mb-2">
                <div className="flex items-center justify-between text-xs text-gray-600 dark:text-gray-400 mb-1">
                  <span>Progress</span>
                  <span className="font-semibold">{project.progress}%</span>
                </div>
                <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-green-400 to-green-600 transition-all duration-500"
                    style={{ width: `${project.progress}%` }}
                  />
                </div>
              </div>

              {/* Project Meta */}
              <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
                {project.budget > 0 && (
                  <span>💰 ${(project.budget / 1000).toFixed(0)}K</span>
                )}
                {project.target_completion && (
                  <span>📅 {new Date(project.target_completion).toLocaleDateString()}</span>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
