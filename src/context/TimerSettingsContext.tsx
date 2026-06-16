import React, { createContext, useContext,useCallback } from 'react';
import type { Mode , Settings , Session } from '../types.ts'; // it;s type so i need to import type 
import { useLocalStorage } from "../hooks/useLocalStorage";

// we are building a global data hub called a react context
// context help pass props up and down through a messy "chain" of components.
// without conetxt connect one page to another page it's defacult . our app is three page updateSettings, addSession, clearHistory
// TimerSettingsContext It serves as the official link that connects our central data hub to any page that requests it

interface TimerSettingsContextType{
    settings : Settings;
    history: Session[];// It holds an array list of all completed sessions the user has finished today
    updateSettings: (newSettings: Settings) => void; //  When a user goes to the settings menu, changes the work time from 25 to 30 minutes, and clicks "Save" it will change
    addSession: (mode: Mode) => void; // add brand new session
    clearHistory: () => void; //it clear the session history(void means null)
}
const TimerSettingsContext = createContext<TimerSettingsContextType | undefined>(undefined);// it tell TS:This context container will either be full of our timer data and functions,or it will start completely empty (undefined)."

const defaultSettings: Settings = {
  durations: {
    work: 25 * 60,       // 25 minutes converted to seconds
    shortBreke: 5 * 60,
    longBreke: 15 * 60,
  },
  sessonBeforeLongBreke: 4, // 4 work cycles required before a rewards break
};

// THE PROVIDER COMPONENT:// A wrapper component that puts our timer data into a global cloud so any screen can grab it.

export const TimerSettingsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
     const [settings, setSettings] = useLocalStorage<Settings>('focusflow_settings', defaultSettings); //this variable remeer the after user close app he will store time
  const [history, setHistory] = useLocalStorage<Session[]>('focusflow_history', []); //this will session history

   // Callback Hook: Saves settings modifications safely in memory
  const updateSettings = useCallback((newSettings: Settings) => {
    setSettings(newSettings);
  }, [setSettings]);

 // CALLBACK HOOK: Creates a new completed log and appends it to history
  const addSession = useCallback((mode: Mode) => {
    const newSession: Session = {
      id: String(Date.now() + Math.random()),        // Generates a safe, unique random text ID string
      mode,
      completedAt: new Date().toISOString(), // Standardized clear timestamp string
    };
     setHistory([...history,newSession]);

  }, [setHistory ,history]);
  // CALLBACK HOOK: Wipes out the history storage block completely
  const clearHistory = useCallback(() => {
    setHistory([]);
  }, [setHistory]);

  // Packages everything into an object to transmit down into the component tree
  const contextValue: TimerSettingsContextType = {
    settings,
    history,
    updateSettings,
    addSession,
    clearHistory,
  };
  //Provider is  (Broadcasts ) our live state and functions down into all nested app components (children).
  return (
    <TimerSettingsContext.Provider value={contextValue}>
      {children}
    </TimerSettingsContext.Provider>
  );
};
// It allows a component to reach into the global React context cloud and grab the timer data (settings, history) 
// and actions (updateSettings) that you broadcasted earlier.
// eslint-disable-next-line react-refresh/only-export-components
export const useTimerSettings = () => {

  const context = useContext(TimerSettingsContext);
  //// Safety check: Crashes cleanly with a clear message if a component tries to use this data outside the Provider.
   if (context === undefined) {
    throw new Error('useTimerSettings must be used within a TimerSettingsProvider');
  }
  
  return context;
};