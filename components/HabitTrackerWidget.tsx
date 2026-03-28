'use client';

import { useState, useEffect } from 'react';
import { api } from '@/lib/api';

interface Habit {
  id: number;
  name: string;
  category: string;
  current_streak: number;
  longest_streak: number;
  completed_today?: boolean;
}

export default function HabitTrackerWidget({ onUpdate }: { onUpdate?: () => void }) {
  const [habits, setHabits] = useState<Habit[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAll, setShowAll] = useState(false);

  useEffect(() => {
    loadHabits();
  }, []);

  const loadHabits = async () => {
    try {
      const data = await api.getTodayHabits();
      setHabits(data);
    } catch (error) {
      console.error('Error loading habits:', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleHabit = async (habit: Habit) => {
    try {
      if (habit.completed_today) {
        const today = new Date().toISOString().split('T')[0];
        await api.uncompleteHabit(habit.id, today);
      } else {
        await api.completeHabit(habit.id);
      }
      loadHabits();
      onUpdate?.();
    } catch (error) {
      console.error('Error toggling habit:', error);
    }
  };

  const getCategoryIcon = (category: string) => {
    const icons: Record<string, string> = {
      health: '💪',
      productivity: '⚡',
      learning: '📚',
      personal: '🌟',
    };
    return icons[category] || '✓';
  };

  const completedCount = habits.filter(h => h.completed_today).length;
  const completionPercentage = habits.length > 0 ? Math.round((completedCount / habits.length) * 100) : 0;

  const displayHabits = showAll ? habits : habits.slice(0, 5);

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
          ✨ Daily Habits
        </h2>
        <div className="text-right">
          <div className="text-2xl font-bold text-gray-900 dark:text-white">
            {completedCount}/{habits.length}
          </div>
          <div className="text-xs text-gray-500 dark:text-gray-400">
            {completionPercentage}% complete
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="mb-4">
        <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-green-400 to-green-600 transition-all duration-500"
            style={{ width: `${completionPercentage}%` }}
          />
        </div>
      </div>

      {/* Habit List */}
      <div className="space-y-2 max-h-80 overflow-y-auto">
        {loading ? (
          <div className="text-center py-8 text-gray-500">Loading...</div>
        ) : habits.length === 0 ? (
          <div className="text-center py-8 text-gray-500">No habits yet</div>
        ) : (
          displayHabits.map(habit => (
            <div
              key={habit.id}
              className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors cursor-pointer"
              onClick={() => toggleHabit(habit)}
            >
              <button className="flex-shrink-0">
                <div
                  className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${
                    habit.completed_today
                      ? 'bg-green-500 border-green-500'
                      : 'border-gray-300 dark:border-gray-600 hover:border-green-500'
                  }`}
                >
                  {habit.completed_today && (
                    <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  )}
                </div>
              </button>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-sm">{getCategoryIcon(habit.category)}</span>
                  <h3
                    className={`text-sm font-medium ${
                      habit.completed_today
                        ? 'text-gray-400 dark:text-gray-500 line-through'
                        : 'text-gray-900 dark:text-white'
                    }`}
                  >
                    {habit.name}
                  </h3>
                </div>
              </div>

              {habit.current_streak > 0 && (
                <div className="flex items-center gap-1 text-xs">
                  <span className="text-orange-500">🔥</span>
                  <span className="font-semibold text-gray-700 dark:text-gray-300">
                    {habit.current_streak}
                  </span>
                </div>
              )}
            </div>
          ))
        )}
      </div>

      {habits.length > 5 && (
        <button
          onClick={() => setShowAll(!showAll)}
          className="w-full mt-3 text-sm text-blue-600 dark:text-blue-400 hover:underline"
        >
          {showAll ? 'Show less' : `Show ${habits.length - 5} more`}
        </button>
      )}
    </div>
  );
}
