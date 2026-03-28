'use client';

interface QuickActionsProps {
  onActionComplete?: () => void;
}

export default function QuickActions({ onActionComplete }: QuickActionsProps) {
  const actions = [
    { icon: '✓', label: 'Add Task', color: 'blue' },
    { icon: '💡', label: 'New Idea', color: 'purple' },
    { icon: '📝', label: 'Quick Note', color: 'green' },
    { icon: '🏡', label: 'Log Deal', color: 'orange' },
    { icon: '📚', label: 'Add Book', color: 'yellow' },
    { icon: '⚖️', label: 'Log Weight', color: 'pink' },
  ];

  const colorClasses: Record<string, string> = {
    blue: 'bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-900/30',
    purple: 'bg-purple-50 dark:bg-purple-900/20 text-purple-700 dark:text-purple-400 hover:bg-purple-100 dark:hover:bg-purple-900/30',
    green: 'bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 hover:bg-green-100 dark:hover:bg-green-900/30',
    orange: 'bg-orange-50 dark:bg-orange-900/20 text-orange-700 dark:text-orange-400 hover:bg-orange-100 dark:hover:bg-orange-900/30',
    yellow: 'bg-yellow-50 dark:bg-yellow-900/20 text-yellow-700 dark:text-yellow-400 hover:bg-yellow-100 dark:hover:bg-yellow-900/30',
    pink: 'bg-pink-50 dark:bg-pink-900/20 text-pink-700 dark:text-pink-400 hover:bg-pink-100 dark:hover:bg-pink-900/30',
  };

  return (
    <div className="my-6">
      <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Quick Actions</h3>
      <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
        {actions.map(action => (
          <button
            key={action.label}
            className={`p-3 rounded-lg transition-colors ${colorClasses[action.color]}`}
            onClick={() => {
              // TODO: Open modal for each action
              console.log(`Action: ${action.label}`);
            }}
          >
            <div className="text-2xl mb-1">{action.icon}</div>
            <div className="text-xs font-medium">{action.label}</div>
          </button>
        ))}
      </div>
    </div>
  );
}
