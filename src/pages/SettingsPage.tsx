/*export const SettingsPage = () => {
  return (
    <div className="text-center mt-10">
      <h2 className="text-2xl font-bold text-slate-800 dark:text-white">⚙️ Settings Screen Placeholder</h2>
      <p className="text-slate-500 mt-2">This is where our time adjustment inputs will sit in Step 8.</p>
    </div>
  );
};*/

import React, { useState } from 'react';
import { useTimerSettings } from '../context/TimerSettingsContext';
import { Button } from '../components/Button';

export const SettingsPage = () => {
  const { settings, updateSettings } = useTimerSettings();

  // CONTROLLED FORM STATES: Initialize local form inputs with global state configurations
  const [workMinutes, setWorkMinutes] = useState<number>(settings.durations.work / 60);
  const [shortMinutes, setShortMinutes] = useState<number>(settings.durations.shortBreke / 60);
  const [longMinutes, setLongMinutes] = useState<number>(settings.durations.longBreke / 60);
  const [targetCycles, setTargetCycles] = useState<number>(settings.sessonBeforeLongBreke);
  
  const [saveSuccess, setSaveSuccess] = useState<boolean>(false);

  // FORM SUBMIT HANDLER FUNCTION
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault(); // Stop the browser from doing a hard page reload

    //Package localized state numbers back into full seconds architecture format
    updateSettings({
      durations: {
        work: workMinutes * 60,
        shortBreke: shortMinutes * 60,
        longBreke: longMinutes * 60,
      },
      sessonBeforeLongBreke: targetCycles,
    });

    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 2000); // Hide success alert banner after 2 seconds
  };

  return (
    <div className="max-w-md mx-auto my-6 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700/60 p-8 rounded-2xl shadow-sm">
      <h2 className="text-2xl font-extrabold text-slate-800 dark:text-white mb-6">Timer Configurations</h2>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="block text-xs font-bold uppercase text-slate-400 tracking-wider mb-2">Work Session (Minutes)</label>
          <input 
            type="number" 
            min="1" 
            className="w-full px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-sm focus:outline-none focus:border-emerald-500 transition-colors"
            value={workMinutes}
            onChange={(e) => setWorkMinutes(Math.max(1, parseInt(e.target.value) || 0))}
          />
        </div>

        <div>
          <label className="block text-xs font-bold uppercase text-slate-400 tracking-wider mb-2">Short Break (Minutes)</label>
          <input 
            type="number" 
            min="1" 
            className="w-full px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-sm focus:outline-none focus:border-emerald-500 transition-colors"
            value={shortMinutes}
            onChange={(e) => setShortMinutes(Math.max(1, parseInt(e.target.value) || 0))}
          />
        </div>

        <div>
          <label className="block text-xs font-bold uppercase text-slate-400 tracking-wider mb-2">Long Break (Minutes)</label>
          <input 
            type="number" 
            min="1" 
            className="w-full px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-sm focus:outline-none focus:border-emerald-500 transition-colors"
            value={longMinutes}
            onChange={(e) => setLongMinutes(Math.max(1, parseInt(e.target.value) || 0))}
          />
        </div>

        <div>
          <label className="block text-xs font-bold uppercase text-slate-400 tracking-wider mb-2">Cycles Before Long Break</label>
          <input 
            type="number" 
            min="1" 
            className="w-full px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-sm focus:outline-none focus:border-emerald-500 transition-colors"
            value={targetCycles}
            onChange={(e) => setTargetCycles(Math.max(1, parseInt(e.target.value) || 0))}
          />
        </div>

        <div className="pt-2 flex items-center justify-between">
          <Button type="submit" variant="primary">Save Changes</Button>
          
          {saveSuccess && (
            <span className="text-xs text-emerald-600 font-bold bg-emerald-50 dark:bg-emerald-950/40 px-3 py-1.5 rounded-md animate-fade-in">
              ✓ Configs Saved Successfully
            </span>
          )}
        </div>
      </form>
    </div>
  );
};
