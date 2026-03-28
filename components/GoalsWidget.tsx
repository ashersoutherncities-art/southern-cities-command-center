'use client';

import { useState, useEffect } from 'react';
import { api } from '@/lib/api';

interface Goal {
  id: number;
  title: string;
  description: string;
  category: string;
  timeframe: string;
  target_date: string;
  progress: number;
}

export default function GoalsWidget({ onUpdate }: { onUpdate?: () => void }) {
  const [goals, setGoals] = useState<Goal[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'daily' | 'weekly' | 'monthly'>('all');

  useEffect(() => {
    loadGoals();
  }, [filter]);

  const loadGoals = async () => {
    try {
      const data = await api.getGoals(filter === 'all' ? {} : { timeframe: filter });
      setGoals(data);
    } catch (error) {
      console.error('Error loading goals:', error);
    } finally {
      setLoading(false);
    }
  };

  const getCategoryIcon = (category: string) => {
    const icons: Record<string, string> = {
      personal: '🌟',
      health: '💪',
      business: '💼',
      financial: '💰',
      learning: '📚',
    };
    return icons[category] || '🎯';
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
          🎯 Goals
        </h2>
        <div className="flex gap-1">
          {['all', 'daily', 'weekly', 'monthly'].map(f => (
            <button
              key={f}
              onClick={() => setFilter(f as any)}
              className={`px-2 py-1 text-xs rounded ${
                filter === f
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400'
              }`}
            >
              {f.charAt(0).toUpperCase() + f.slice(1)}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-3 max-h-80 overflow-y-auto">
        {loading ? (
          <div className="text-center py-8 text-gray-500">Loading...</div>
        ) : goals.length === 0 ? (
          <div className="text-center py-8 text-gray-500">No goals set</div>
        ) : (
          goals.map(goal => (
            <div
              key={goal.id}
              className="p-3 rounded-lg border border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow"
            >
              <div className="flex items-start gap-2 mb-2">
                <span className="text-lg">{getCategoryIcon(goal.category)}</span>
                <div className="flex-1 min-w-0">
                  <h3 className="text-sm font-medium text-gray-900 dark:text-white">
                    {goal.title}
                  </h3>
                  {goal.description && (
                    <p className="text-xs text-gray-600 dark:text-gray-400 mt-1 line-clamp-2">
                      {goal.description}
                    </p>
                  )}
                </div>
              </div>

              {/* Progress Bar */}
              <div className="mb-2">
                <div className="flex items-center justify-between text-xs text-gray-600 dark:text-gray-400 mb-1">
                  <span>Progress</span>
                  <span className="font-semibold">{goal.progress}%</span>
                </div>
                <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-purple-400 to-purple-600 transition-all duration-500"
                    style={{ width: `${goal.progress}%` }}
                  />
                </div>
              </div>

              {/* Meta Info */}
              <div className="flex items-center justify-between">
                <span className="text-xs px-2 py-0.5 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400">
                  {goal.timeframe}
                </span>
                {goal.target_date && (
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    📅 {new Date(goal.target_date).toLocaleDateString()}
                  </span>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
