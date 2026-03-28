'use client';

import { useState, useEffect } from 'react';
import { api } from '@/lib/api';

interface Book {
  id: number;
  title: string;
  author: string;
  status: string;
  current_page: number;
  total_pages: number;
  rating?: number;
  notes?: string;
}

interface ReadingStats {
  currently_reading: number;
  finished_this_year: number;
  finished_this_month: number;
  total_notes: number;
  avg_rating: number | null;
}

export default function ReadingWidget({ onUpdate }: { onUpdate?: () => void }) {
  const [books, setBooks] = useState<Book[]>([]);
  const [stats, setStats] = useState<ReadingStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'reading' | 'finished' | 'to-read'>('reading');

  useEffect(() => {
    loadData();
  }, [activeTab]);

  const loadData = async () => {
    try {
      const [booksData, statsData] = await Promise.all([
        api.getBooks({ status: activeTab === 'reading' ? 'reading' : activeTab === 'finished' ? 'finished' : 'to-read' }),
        api.getReadingStats(),
      ]);
      setBooks(booksData);
      setStats(statsData);
    } catch (error) {
      console.error('Error loading reading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateBookProgress = async (bookId: number, newPage: number) => {
    try {
      await api.updateBook(bookId, { current_page: newPage });
      loadData();
      onUpdate?.();
    } catch (error) {
      console.error('Error updating book progress:', error);
    }
  };

  const getProgressPercentage = (book: Book) => {
    if (!book.total_pages || book.total_pages === 0) return 0;
    return Math.round((book.current_page / book.total_pages) * 100);
  };

  const renderStars = (rating?: number) => {
    if (!rating) return null;
    return (
      <div className="flex gap-0.5">
        {[1, 2, 3, 4, 5].map(star => (
          <span key={star} className={star <= rating ? 'text-yellow-500' : 'text-gray-300 dark:text-gray-600'}>
            ★
          </span>
        ))}
      </div>
    );
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
          📚 Reading
        </h2>
        <div className="text-right">
          <div className="text-sm font-medium text-gray-900 dark:text-white">
            {stats?.finished_this_year || 0} books
          </div>
          <div className="text-xs text-gray-500 dark:text-gray-400">this year</div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-3 gap-2 mb-4">
        <div className="p-2 bg-blue-50 dark:bg-blue-900/20 rounded text-center">
          <div className="text-xl font-bold text-blue-700 dark:text-blue-300">
            {stats?.currently_reading || 0}
          </div>
          <div className="text-xs text-blue-600 dark:text-blue-400">Reading</div>
        </div>
        <div className="p-2 bg-green-50 dark:bg-green-900/20 rounded text-center">
          <div className="text-xl font-bold text-green-700 dark:text-green-300">
            {stats?.finished_this_month || 0}
          </div>
          <div className="text-xs text-green-600 dark:text-green-400">This month</div>
        </div>
        <div className="p-2 bg-purple-50 dark:bg-purple-900/20 rounded text-center">
          <div className="text-xl font-bold text-purple-700 dark:text-purple-300">
            {stats?.total_notes || 0}
          </div>
          <div className="text-xs text-purple-600 dark:text-purple-400">Notes</div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-4 border-b border-gray-200 dark:border-gray-700">
        {[
          { key: 'reading', label: 'Reading', icon: '📖' },
          { key: 'to-read', label: 'To Read', icon: '📋' },
          { key: 'finished', label: 'Finished', icon: '✅' },
        ].map(tab => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key as any)}
            className={`flex-1 pb-2 text-sm font-medium transition-colors ${
              activeTab === tab.key
                ? 'text-blue-600 dark:text-blue-400 border-b-2 border-blue-600'
                : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
            }`}
          >
            {tab.icon} {tab.label}
          </button>
        ))}
      </div>

      {/* Books List */}
      <div className="space-y-3 max-h-80 overflow-y-auto">
        {loading ? (
          <div className="text-center py-8 text-gray-500">Loading...</div>
        ) : books.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            {activeTab === 'reading' && 'Start reading a book!'}
            {activeTab === 'to-read' && 'Add books to your reading list'}
            {activeTab === 'finished' && 'No finished books yet'}
          </div>
        ) : (
          books.map(book => (
            <div
              key={book.id}
              className="p-3 rounded-lg border border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between gap-2 mb-2">
                <div className="flex-1 min-w-0">
                  <h3 className="text-sm font-semibold text-gray-900 dark:text-white line-clamp-1">
                    {book.title}
                  </h3>
                  <p className="text-xs text-gray-600 dark:text-gray-400 line-clamp-1">
                    {book.author}
                  </p>
                </div>
                {book.rating && renderStars(book.rating)}
              </div>

              {activeTab === 'reading' && book.total_pages > 0 && (
                <>
                  <div className="mb-2">
                    <div className="flex items-center justify-between text-xs text-gray-600 dark:text-gray-400 mb-1">
                      <span>
                        {book.current_page} / {book.total_pages} pages
                      </span>
                      <span>{getProgressPercentage(book)}%</span>
                    </div>
                    <div className="h-1.5 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-blue-400 to-blue-600 transition-all duration-500"
                        style={{ width: `${getProgressPercentage(book)}%` }}
                      />
                    </div>
                  </div>
                  
                  <div className="flex gap-2">
                    <input
                      type="number"
                      value={book.current_page}
                      onChange={(e) => updateBookProgress(book.id, parseInt(e.target.value) || 0)}
                      className="flex-1 px-2 py-1 text-xs border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      placeholder="Page"
                    />
                    <button
                      onClick={() => updateBookProgress(book.id, Math.min(book.current_page + 10, book.total_pages))}
                      className="px-3 py-1 text-xs bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
                    >
                      +10
                    </button>
                  </div>
                </>
              )}

              {book.notes && (
                <p className="mt-2 text-xs text-gray-600 dark:text-gray-400 italic line-clamp-2">
                  &quot;{book.notes}&quot;
                </p>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
