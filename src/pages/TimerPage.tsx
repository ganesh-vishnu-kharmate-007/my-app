//We are building the App Shell (the navigation backbone) using React Router.
// react router create a shared layout . that help to navigate page one to another page without refreshing all page (that makes app fast and smooth)
/*export const TimerPage = () => {
  return (
    <div className="text-center mt-10">
      <h2 className="text-2xl font-bold text-slate-800 dark:text-white">⏱️ Timer Screen Placeholder</h2>
      <p className="text-slate-500 mt-2">This is where our countdown clock will tick in Step 6.</p>
    </div>
  );
};
*/
// We are building the core countdown engine inside
import { useState, useEffect, useRef , useMemo, useCallback } from 'react';
import { useTimerSettings } from '../context/TimerSettingsContext';
import  type{ Mode } from '../types';
import { TimerDisplay } from '../components/TimerDisplay';
import { ProgressBar } from '../components/ProgressBar';
import { Button } from '../components/Button';



export const TimerPage = () => {
  //Fetch live global configurations from our Step 4 Context Hub
  const { settings , addSession} = useTimerSettings();
  // we create a three variable in state
  //STATE HOOKS: Track active phases, running status, and ticking clock seconds
  const [mode, setMode] = useState<Mode>('work');
  const [isRunning, setIsRunning] = useState<boolean>(false);//check clock is runing 
  const [secondsLeft, setSecondsLeft] = useState<number>(settings.durations.work);//check how many second left 
  const [workSessionCount, setWorkSessionCount] = useState<number>(0);

  //REFERENCE HOOKS: Silent data containers that protect against re-render bugs // if user hit button start clock clock open multiple that why this used 
  const timerRef = useRef<number | null>(null);
  const audioRef = useRef<HTMLAudioElement>(null);


  // Helper mapping to read standard names for display badges
  const modeLabels: Record<Mode, string> = {
    work: 'Work',
    shortBreke: 'Short Break',
    longBreke: 'Long Break',
  };
    const totalSecondsForCurrentMode = settings.durations[mode];

     // 4. PERFORMANCE MEMOIZATION: Derived values for formatting and percentages
     //useMemo acts like a calculator memory cache. It does the math once and saves the answer, 
     // only recalculating when the second actually drops.
  const formattedTimeStr = useMemo(() => {
    const minutes = Math.floor(secondsLeft / 60);
    const seconds = secondsLeft % 60;
    const format = (num: number): string => String(num).padStart(2, '0');
    return `${format(minutes)}:${format(seconds)}`;
  }, [secondsLeft]);

 
  // uecallback: wrap our control functions (handleToggle, handleReset, handleSkip) inside useCallback. T
  // his guarantees that the button action functions are saved in memory and don't get recreated on every tick.
  // 5. PHASE CYCLING LOGIC: Handles moving between Work, Short Breaks, and Long Breaks
  const handlePhaseCompletion = useCallback(() => {
    setIsRunning(false);

    if (mode === 'work') {
      // Step A: Log the completed focus session into global history context
      addSession('work');
      
      // Step B: Calculate next state based on settings target boundaries
      const nextCount = workSessionCount + 1;
      setWorkSessionCount(nextCount);

      if (nextCount >= settings.sessonBeforeLongBreke) {
        setMode('longBreke');
        setSecondsLeft(settings.durations.longBreke);
        setWorkSessionCount(0); // Reset local counter after reward break
      } else {
        setMode('shortBreke');
        setSecondsLeft(settings.durations.shortBreke);
      }
    } else {
      // If a break finished, cycle right back into a focus session block
      setMode('work');
      setSecondsLeft(settings.durations.work);
    }
  }, [mode, workSessionCount, settings, addSession]);
  //useCallback: The function reference stays identical. If the child buttons are wrapped in React.memo,
  //  they will see that the onClick prop hasn't changed and will skip re-rendering, saving performance.
  // 6. CONTROL HANDLERS: Memoized action buttons
  const handleToggle = useCallback(() => {
    setIsRunning((prev) => !prev);
  }, []);

  const handleReset = useCallback(() => {
    setIsRunning(false);
    setSecondsLeft(settings.durations[mode]);
  }, [mode, settings.durations]);

  const handleSkip = useCallback(() => {
    handlePhaseCompletion();
  }, [handlePhaseCompletion]);

  //
  // 7. COUNTDOWN CORE EFFECT ENGINE
  // It sets up an invisible background timer (window.setInterval
  //When the countdown hits zero, it plays an alert sound from your audio element (src="https://mixkit.co").
  //state update
  useEffect(() => {
    if (isRunning) {
      timerRef.current = window.setInterval(() => {
        setSecondsLeft((prevSeconds) => {
          if (prevSeconds <= 1) {
            if (audioRef.current) {
              audioRef.current.play().catch((err) => console.log("Audio blocked:", err));
            }
            // Trigger phase changes on the next execution loop
            setTimeout(handlePhaseCompletion, 0);
            return 0;
          }
          return prevSeconds - 1;
        });
      }, 1000);
    }

    return () => {
      if (timerRef.current !== null) {
        window.clearInterval(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [isRunning, handlePhaseCompletion]);
  //useeffect: it's enable to check every time clock ticks it show the secondleft, mode type on other side browser without this we can't see
   // 8. BACKGROUND SIDE EFFECT: Sync live countdown numbers straight to browser tab titles
  useEffect(() => {
    // Moved inside the effect to satisfy the linter perfectly
    const modeLabels: Record<Mode, string> = {
      work: 'Work',
      shortBreke: 'Short Break',
      longBreke: 'Long Break',
    };

    const statusIndicator = isRunning ? '▶' : '⏸';
    document.title = `${formattedTimeStr} ${statusIndicator} ${modeLabels[mode]} - FocusFlow`;
    
    // Cleanup routine to restore original app title if user navigates away
    return () => {
      document.title = 'FocusFlow';
    };
  }, [formattedTimeStr, mode, isRunning]);

  return (
    <div className="max-w-md mx-auto my-12 p-8 bg-white dark:bg-slate-800 rounded-3xl border border-slate-100 dark:border-slate-700/50 shadow-xl flex flex-col items-center">
      <audio 
        ref={audioRef} 
        src="https://mixkit.co" 
        preload="auto"
      />
      {/* Dynamic Mode Badges */}
      <div className="flex gap-2 mb-4">
        <span className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider transition-all duration-300 ${mode === 'work' ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300' : 'bg-slate-100 text-slate-400 dark:bg-slate-700/40'}`}>
          💼 {modeLabels.work}
        </span>
        <span className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider transition-all duration-300 ${mode === 'shortBreke' ? 'bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300' : 'bg-slate-100 text-slate-400 dark:bg-slate-700/40'}`}>
          ☕ {modeLabels.shortBreke}
        </span>
        <span className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider transition-all duration-300 ${mode === 'longBreke' ? 'bg-purple-100 text-purple-800 dark:bg-purple-950 dark:text-purple-300' : 'bg-slate-100 text-slate-400 dark:bg-slate-700/40'}`}>
          🌴 {modeLabels.longBreke}
        </span>
      </div>
       {/* Render Display primitives using our memoized strings and percentages */}
      <TimerDisplay timeInseconds={secondsLeft} />
      
      <div className="w-full my-6">
        <ProgressBar currentSeconds={secondsLeft} totalSeconds={totalSecondsForCurrentMode} />
      </div>

      <p className="text-xs text-slate-400 mb-6 font-medium">
        Session Streak: {workSessionCount} / {settings.sessonBeforeLongBreke} before Long Break
      </p>
       {/* Wired Interactive Controls */}
      <div className="flex gap-3 w-full justify-center">
        <Button variant={isRunning ? 'secondary' : 'primary'} onClick={handleToggle}>
          {isRunning ? 'Pause' : 'Start'}
        </Button>
        <Button variant="secondary" onClick={handleReset}>
          Reset
        </Button>
        <Button variant="danger" onClick={handleSkip}>
          Skip
        </Button>
      </div>
    </div>
  );
};