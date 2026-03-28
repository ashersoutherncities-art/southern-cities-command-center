'use client';

import { useState, useEffect } from 'react';
import { api } from '@/lib/api';

interface CalendarEvent {
  id: number;
  title: string;
  start: string;
  duration: number;
}

export default function CalendarWidget() {
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadEvents();
  }, []);

  const loadEvents = async () => {
    try {
      const data = await api.getCalendar();
      setEvents(data);
    } catch (error) {
      console.error('Error loading calendar:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    if (date.toDateString() === today.toDateString()) return 'Today';
    if (date.toDateString() === tomorrow.toDateString()) return 'Tomorrow';
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
          📅 Calendar
        </h2>
      </div>

      <div className="space-y-2 max-h-64 overflow-y-auto">
        {loading ? (
          <div className="text-center py-8 text-gray-500">Loading...</div>
        ) : events.length === 0 ? (
          <div className="text-center py-8 text-gray-500">No upcoming events</div>
        ) : (
          events.map(event => (
            <div
              key={event.id}
              className="p-3 rounded-lg border border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow"
            >
              <h3 className="text-sm font-medium text-gray-900 dark:text-white mb-1">
                {event.title}
              </h3>
              <div className="flex items-center gap-2 text-xs text-gray-600 dark:text-gray-400">
                <span>{formatDate(event.start)}</span>
                <span>•</span>
                <span>{formatTime(event.start)}</span>
                <span>•</span>
                <span>{event.duration} min</span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
