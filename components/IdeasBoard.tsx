'use client';

import { useState, useEffect } from 'react';
import { api } from '@/lib/api';

interface Idea {
  id: number;
  title: string;
  description: string;
  status: string;
  category: string;
  priority: string;
  estimated_value: string;
}

export default function IdeasBoard({ onUpdate }: { onUpdate?: () => void }) {
  const [ideas, setIdeas] = useState<Idea[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadIdeas();
  }, []);

  const loadIdeas = async () => {
    try {
      const data = await api.getIdeas();
      setIdeas(data as Idea[]);
    } catch (error) {
      console.error('Error loading ideas:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateIdeaStatus = async (id: number, newStatus: string) => {
    try {
      await api.updateIdea(id, { status: newStatus });
      loadIdeas();
      onUpdate?.();
    } catch (error) {
      console.error('Error updating idea:', error);
    }
  };

  const statusColumns = [
    { key: 'backlog', label: 'Backlog', color: 'gray' },
    { key: 'researching', label: 'Research', color: 'blue' },
    { key: 'planning', label: 'Planning', color: 'yellow' },
    { key: 'active', label: 'Active', color: 'green' },
  ];

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      backlog: 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300',
      researching: 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300',
      planning: 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300',
      active: 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300',
    };
    return colors[status] || colors.backlog;
  };

  const getPriorityBadge = (priority: string) => {
    const badges: Record<string, string> = {
      high: '🔥',
      medium: '⭐',
      low: '💭',
    };
    return badges[priority] || badges.medium;
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
          💡 Ideas Board
        </h2>
        <span className="text-sm text-gray-500 dark:text-gray-400">
          {ideas.length} ideas
        </span>
      </div>

      <div className="space-y-3 max-h-96 overflow-y-auto">
        {loading ? (
          <div className="text-center py-8 text-gray-500">Loading...</div>
        ) : ideas.length === 0 ? (
          <div className="text-center py-8 text-gray-500">No ideas yet</div>
        ) : (
          ideas.map(idea => (
            <div
              key={idea.id}
              className="p-3 rounded-lg border border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between gap-2 mb-2">
                <h3 className="text-sm font-medium text-gray-900 dark:text-white flex-1">
                  {getPriorityBadge(idea.priority)} {idea.title}
                </h3>
              </div>
              
              {idea.description && (
                <p className="text-xs text-gray-600 dark:text-gray-400 mb-2 line-clamp-2">
                  {idea.description}
                </p>
              )}
              
              <div className="flex items-center justify-between gap-2">
                <select
                  value={idea.status}
                  onChange={(e) => updateIdeaStatus(idea.id, e.target.value)}
                  className={`text-xs px-2 py-1 rounded ${getStatusColor(idea.status)} border-0 cursor-pointer`}
                >
                  {statusColumns.map(col => (
                    <option key={col.key} value={col.key}>
                      {col.label}
                    </option>
                  ))}
                </select>
                
                <div className="flex items-center gap-2">
                  {idea.category && (
                    <span className="text-xs px-2 py-0.5 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400">
                      {idea.category}
                    </span>
                  )}
                </div>
              </div>
              
              {idea.estimated_value && (
                <div className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                  💰 {idea.estimated_value}
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
