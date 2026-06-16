/*export const HistoryPage = () => {
  return (
    <div className="text-center mt-10">
      <h2 className="text-2xl font-bold text-slate-800 dark:text-white">📜 History Screen Placeholder</h2>
      <p className="text-slate-500 mt-2">This is where our session tracking cards will list out in Step 8.</p>
    </div>
  );
};*/

import { useMemo } from 'react';
import { useTimerSettings } from '../context/TimerSettingsContext';
import { StatCard } from '../components/StatCard';
import { Button } from '../components/Button';

export const HistoryPage = () =>{
   // Pull live logs and clear actions from the context file
  const { history, clearHistory } = useTimerSettings();

   // PERFORMANCE MEMOIZATION: Filter and count sessions completed today
  const sessionsToday = useMemo(() => {
    const todayStr = new Date().toISOString().split('T')[0]; // Extract YYYY-MM-DD
    return history.filter(session => session.completedAt.startsWith(todayStr)).length;
  }, [history]);

   // Helper utility to format ISO date strings into readable text layouts
  const formatTime = (isoString: string) => {
    const date = new Date(isoString);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return(

    <div className="max-w-2xl mx-auto my-6 space-y-6">
      <h2 className="text-3xl font-extrabold text-slate-800 dark:text-white tracking-tight">Focus Dashboard</h2>
      
      {/* Analytics Scoreboard Display Panel */}
      <div className="flex gap-4">
        <StatCard title="Total Focus Blocks" value={history.length} />
        <StatCard title="Sessions Completed Today" value={sessionsToday} />
      </div>

      {/* History Log Table Container */}
      <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700/60 rounded-2xl p-6 shadow-sm">
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-bold text-lg text-slate-700 dark:text-slate-200">Activity History</h3>
          {history.length > 0 && (
            <Button variant="danger" onClick={clearHistory}>
              Clear Logs
            </Button>
          )}
        </div>

        {/* CONDITION: Check if history has logged data arrays */}
        {history.length === 0 ? (
          <p className="text-sm text-slate-400 text-center py-8">No completed sessions recorded yet. Start focusing!</p>
        ) : (
          <div className="divide-y divide-slate-100 dark:divide-slate-700/50 max-h-64 overflow-y-auto pr-2">
            {/* Loop through historical sessions array items using reverse to show newest first */}
            {[...history].reverse().map((session) => (
              <div key={session.id} className="py-3 flex justify-between items-center text-sm">
                <span className="font-medium text-slate-600 dark:text-slate-300">
                  🎯 Finished {session.mode === 'work' ? 'Work Session' : 'Break'}
                </span>
                <span className="text-slate-400 font-mono">
                  {formatTime(session.completedAt)}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>

  );
}