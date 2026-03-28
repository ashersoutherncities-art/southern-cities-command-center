'use client';

import { useState, useEffect } from 'react';
import { api } from '@/lib/api';

interface WeightEntry {
  id: number;
  weight_lbs: number;
  date: string;
  notes?: string;
}

interface WeightStats {
  current: number | null;
  weeklyAvg: number | null;
  monthlyAvg: number | null;
  goal: { goal_weight: number; target_date?: string } | null;
  lastEntry: string | null;
}

export default function WeightTrackerWidget({ onUpdate }: { onUpdate?: () => void }) {
  const [stats, setStats] = useState<WeightStats | null>(null);
  const [entries, setEntries] = useState<WeightEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddEntry, setShowAddEntry] = useState(false);
  const [newWeight, setNewWeight] = useState('');
  const [timeframe, setTimeframe] = useState<30 | 90 | 365>(30);

  useEffect(() => {
    loadData();
  }, [timeframe]);

  const loadData = async () => {
    try {
      const [statsData, entriesData] = await Promise.all([
        api.getWeightStats(),
        api.getWeightEntries(timeframe),
      ]);
      setStats(statsData);
      setEntries(entriesData);
    } catch (error) {
      console.error('Error loading weight data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddEntry = async () => {
    if (!newWeight || isNaN(parseFloat(newWeight))) return;

    try {
      await api.addWeightEntry({ weight_lbs: parseFloat(newWeight) });
      setNewWeight('');
      setShowAddEntry(false);
      loadData();
      onUpdate?.();
    } catch (error) {
      console.error('Error adding weight entry:', error);
    }
  };

  if (loading) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-1/3 mb-4"></div>
          <div className="h-32 bg-gray-200 dark:bg-gray-700 rounded"></div>
        </div>
      </div>
    );
  }

  const progressToGoal = stats?.goal && stats?.current
    ? ((stats.current - (entries[0]?.weight_lbs || stats.current)) / 
       ((entries[0]?.weight_lbs || stats.current) - stats.goal.goal_weight)) * 100
    : 0;

  const trend = entries.length >= 2
    ? entries[entries.length - 1].weight_lbs - entries[0].weight_lbs
    : 0;

  const minWeight = Math.min(...entries.map(e => e.weight_lbs), stats?.goal?.goal_weight || Infinity);
  const maxWeight = Math.max(...entries.map(e => e.weight_lbs));
  const range = maxWeight - minWeight;

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
          ⚖️ Weight Tracker
        </h2>
        <button
          onClick={() => setShowAddEntry(!showAddEntry)}
          className="text-sm px-3 py-1 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
        >
          {showAddEntry ? 'Cancel' : '+ Add'}
        </button>
      </div>

      {/* Quick Entry Form */}
      {showAddEntry && (
        <div className="mb-4 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
          <div className="flex gap-2">
            <input
              type="number"
              step="0.1"
              value={newWeight}
              onChange={(e) => setNewWeight(e.target.value)}
              placeholder="Weight (lbs)"
              className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
              onKeyPress={(e) => e.key === 'Enter' && handleAddEntry()}
            />
            <button
              onClick={handleAddEntry}
              className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
            >
              Save
            </button>
          </div>
        </div>
      )}

      {/* Current Stats */}
      <div className="grid grid-cols-2 gap-3 mb-4">
        <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
          <div className="text-xs text-blue-600 dark:text-blue-400 mb-1">Current</div>
          <div className="text-2xl font-bold text-blue-700 dark:text-blue-300">
            {stats?.current ? `${stats.current.toFixed(1)} lbs` : 'N/A'}
          </div>
        </div>
        
        <div className="p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
          <div className="text-xs text-purple-600 dark:text-purple-400 mb-1">Goal</div>
          <div className="text-2xl font-bold text-purple-700 dark:text-purple-300">
            {stats?.goal ? `${stats.goal.goal_weight.toFixed(1)} lbs` : 'Not set'}
          </div>
        </div>

        <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
          <div className="text-xs text-green-600 dark:text-green-400 mb-1">7-Day Avg</div>
          <div className="text-lg font-bold text-green-700 dark:text-green-300">
            {stats?.weeklyAvg ? `${stats.weeklyAvg.toFixed(1)} lbs` : 'N/A'}
          </div>
        </div>

        <div className="p-3 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
          <div className="text-xs text-orange-600 dark:text-orange-400 mb-1">
            {timeframe}-Day Trend
          </div>
          <div className={`text-lg font-bold ${trend < 0 ? 'text-green-600' : trend > 0 ? 'text-red-600' : 'text-gray-600'}`}>
            {trend !== 0 ? `${trend > 0 ? '+' : ''}${trend.toFixed(1)} lbs` : 'Stable'}
          </div>
        </div>
      </div>

      {/* Timeframe Selector */}
      <div className="flex gap-2 mb-4">
        {[30, 90, 365].map(days => (
          <button
            key={days}
            onClick={() => setTimeframe(days as any)}
            className={`flex-1 px-2 py-1 text-xs rounded ${
              timeframe === days
                ? 'bg-blue-500 text-white'
                : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400'
            }`}
          >
            {days}d
          </button>
        ))}
      </div>

      {/* Mini Chart */}
      <div className="relative h-32 mb-2">
        {entries.length === 0 ? (
          <div className="flex items-center justify-center h-full text-gray-500">
            No data yet
          </div>
        ) : (
          <>
            {/* Goal line */}
            {stats?.goal && (
              <div
                className="absolute left-0 right-0 border-t-2 border-dashed border-purple-400"
                style={{
                  bottom: `${((stats.goal.goal_weight - minWeight) / range) * 100}%`,
                }}
              >
                <span className="absolute -top-2 right-0 text-xs text-purple-600 dark:text-purple-400 bg-white dark:bg-gray-800 px-1">
                  Goal
                </span>
              </div>
            )}

            {/* Line chart */}
            <svg className="w-full h-full" preserveAspectRatio="none">
              <polyline
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                className="text-blue-500"
                points={entries
                  .map((entry, i) => {
                    const x = (i / (entries.length - 1)) * 100;
                    const y = 100 - ((entry.weight_lbs - minWeight) / range) * 100;
                    return `${x},${y}`;
                  })
                  .join(' ')}
              />
              
              {/* Data points */}
              {entries.map((entry, i) => {
                const x = (i / (entries.length - 1)) * 100;
                const y = 100 - ((entry.weight_lbs - minWeight) / range) * 100;
                return (
                  <circle
                    key={entry.id}
                    cx={`${x}%`}
                    cy={`${y}%`}
                    r="3"
                    className="fill-blue-500"
                  />
                );
              })}
            </svg>
          </>
        )}
      </div>

      {/* Y-axis labels */}
      <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400">
        <span>{minWeight.toFixed(0)} lbs</span>
        <span>{maxWeight.toFixed(0)} lbs</span>
      </div>
    </div>
  );
}
