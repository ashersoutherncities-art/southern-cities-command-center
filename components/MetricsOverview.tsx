'use client';

import { useState, useEffect } from 'react';
import { api } from '@/lib/api';

export default function MetricsOverview() {
  const [metrics, setMetrics] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadMetrics();
  }, []);

  const loadMetrics = async () => {
    try {
      const data = await api.getMetrics();
      setMetrics(data as Metric[]);
    } catch (error) {
      console.error('Error loading metrics:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map(i => (
          <div key={i} className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow animate-pulse">
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2 mb-2"></div>
            <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
          </div>
        ))}
      </div>
    );
  }

  if (!metrics) return null;

  const cards = [
    {
      title: 'Tasks',
      value: metrics.tasks.pending,
      subtitle: `${metrics.tasks.urgent} urgent`,
      color: 'blue',
      icon: '✓',
    },
    {
      title: 'Active Projects',
      value: metrics.projects.active,
      subtitle: `${Math.round(metrics.projects.avgProgress)}% avg progress`,
      color: 'green',
      icon: '📊',
    },
    {
      title: 'Ideas',
      value: metrics.ideas.active,
      subtitle: `${metrics.ideas.total} total`,
      color: 'purple',
      icon: '💡',
    },
    {
      title: 'Active Goals',
      value: metrics.goals.total,
      subtitle: `${Math.round(metrics.goals.avgProgress)}% progress`,
      color: 'orange',
      icon: '🎯',
    },
  ];

  const colorClasses: Record<string, string> = {
    blue: 'bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400',
    green: 'bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400',
    purple: 'bg-purple-50 dark:bg-purple-900/20 text-purple-700 dark:text-purple-400',
    orange: 'bg-orange-50 dark:bg-orange-900/20 text-orange-700 dark:text-orange-400',
  };

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {cards.map((card) => (
        <div
          key={card.title}
          className={`${colorClasses[card.color]} rounded-lg p-4 shadow-sm`}
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium opacity-80">{card.title}</span>
            <span className="text-2xl">{card.icon}</span>
          </div>
          <div className="text-3xl font-bold mb-1">{card.value}</div>
          <div className="text-xs opacity-70">{card.subtitle}</div>
        </div>
      ))}
    </div>
  );
}
