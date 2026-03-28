'use client';

import { useState, useEffect } from 'react';
import DashboardHeader from '@/components/DashboardHeader';
import MetricsOverview from '@/components/MetricsOverview';
import TasksWidget from '@/components/TasksWidget';
import IdeasBoard from '@/components/IdeasBoard';
import ProjectsWidget from '@/components/ProjectsWidget';
import GoalsWidget from '@/components/GoalsWidget';
import DealsWidget from '@/components/DealsWidget';
import CalendarWidget from '@/components/CalendarWidget';
import QuickActions from '@/components/QuickActions';
import HabitTrackerWidget from '@/components/HabitTrackerWidget';
import WeightTrackerWidget from '@/components/WeightTrackerWidget';
import ReadingWidget from '@/components/ReadingWidget';

export default function Dashboard() {
  const [darkMode, setDarkMode] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);
  const [activeSection, setActiveSection] = useState<'personal' | 'business'>('business');

  useEffect(() => {
    // Check system preference
    if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
      setDarkMode(true);
    }
  }, []);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  const handleRefresh = () => {
    setRefreshKey(prev => prev + 1);
  };

  return (
    <div className={`min-h-screen ${darkMode ? 'dark bg-gray-900' : 'bg-gray-50'}`}>
      <DashboardHeader 
        darkMode={darkMode} 
        toggleDarkMode={() => setDarkMode(!darkMode)}
        onRefresh={handleRefresh}
        activeSection={activeSection}
        onSectionChange={setActiveSection}
      />
      
      <main className="container mx-auto px-4 py-6 max-w-7xl">
        {/* Metrics Overview - Show based on section */}
        {activeSection === 'business' && (
          <MetricsOverview key={`metrics-${refreshKey}`} />
        )}
        
        {/* Quick Actions */}
        <QuickActions onActionComplete={handleRefresh} />
        
        {/* PERSONAL SECTION */}
        {activeSection === 'personal' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
            {/* Column 1 - Wellness */}
            <div className="space-y-6">
              <HabitTrackerWidget key={`habits-${refreshKey}`} onUpdate={handleRefresh} />
              <WeightTrackerWidget key={`weight-${refreshKey}`} onUpdate={handleRefresh} />
            </div>
            
            {/* Column 2 - Learning & Development */}
            <div className="space-y-6">
              <ReadingWidget key={`reading-${refreshKey}`} onUpdate={handleRefresh} />
              <GoalsWidget key={`goals-${refreshKey}`} onUpdate={handleRefresh} />
            </div>
            
            {/* Column 3 - Tasks & Calendar */}
            <div className="space-y-6">
              <TasksWidget key={`tasks-${refreshKey}`} onUpdate={handleRefresh} />
              <CalendarWidget key={`calendar-${refreshKey}`} />
            </div>
          </div>
        )}
        
        {/* BUSINESS SECTION */}
        {activeSection === 'business' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-6">
            {/* Column 1 - Deals Pipeline */}
            <div className="space-y-6">
              <DealsWidget key={`deals-${refreshKey}`} />
            </div>
            
            {/* Column 2 - Projects & Tasks */}
            <div className="space-y-6">
              <ProjectsWidget key={`projects-${refreshKey}`} onUpdate={handleRefresh} />
              <TasksWidget key={`tasks-${refreshKey}`} onUpdate={handleRefresh} />
            </div>
            
            {/* Column 3 - Ideas & Strategic */}
            <div className="space-y-6">
              <IdeasBoard key={`ideas-${refreshKey}`} onUpdate={handleRefresh} />
            </div>
            
            {/* Column 4 - Calendar & Learning (for business context) */}
            <div className="space-y-6">
              <CalendarWidget key={`calendar-${refreshKey}`} />
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
