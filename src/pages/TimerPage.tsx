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
import { useState, useEffect, useRef } from 'react';
import { useTimerSettings } from '../context/TimerSettingsContext';
import  type{ Mode } from '../types';
import { TimerDisplay } from '../components/TimerDisplay';
import { ProgressBar } from '../components/ProgressBar';
import { Button } from '../components/Button';



export const TimerPage = () => {
  //Fetch live global configurations from our Step 4 Context Hub
  const { settings } = useTimerSettings();
  // we create a three variable in state
  //STATE HOOKS: Track active phases, running status, and ticking clock seconds
  const [mode, setMode] = useState<Mode>('work');
  const [isRunning, setIsRunning] = useState<boolean>(false);//check clock is runing 
  const [secondsLeft, setSecondsLeft] = useState<number>(settings.durations.work);//check how many second left 

  //REFERENCE HOOKS: Silent data containers that protect against re-render bugs // if user hit button start clock clock open multiple that why this used 
  const timerRef = useRef<number | null>(null);
  const audioRef = useRef<HTMLAudioElement>(null);

  // Helper calculation to know what the full total seconds was for the current active mode
  const totalSecondsForCurrentMode = settings.durations[mode];

  //EFFECT HOOK: The main engine driving the countdown clock
  useEffect(() => {
    // CONDITION: If the play button is pressed, activate the clock interval
    if (isRunning) {
      timerRef.current = window.setInterval(() => { {/* standard browser clock machine called a setInterval*/}
        setSecondsLeft((prevSeconds) => { // setsecondleft:Every time this number changes, React automatically updates your TimerDisplay and shrinks your ProgressBar UI on the screen.
          if (prevSeconds <= 1) {
            // Clock reached zero! Play our alarm sound link
            if (audioRef.current) {
              audioRef.current.play().catch((err) => console.log("Audio play blocked by browser:", err));
            }
            setIsRunning(false); // Stop the clock tracking loop
            return 0;
          }
          return prevSeconds - 1; // Subtract exactly one second
        });
      }, 1000);
    }

    // THE CRITICAL CLEANUP FUNCTION: Smashes active clock loops before recreating or switching pages
    return () => {
      if (timerRef.current !== null) {
        window.clearInterval(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [isRunning, mode]); // Re-runs safety gear whenever running status or mode changes

  

  return (
    <div className="max-w-md mx-auto my-12 p-8 bg-white dark:bg-slate-800 rounded-3xl border border-slate-100 dark:border-slate-700/50 shadow-xl flex flex-col items-center">
      {/* Invisible HTML Audio Element connected to our custom pointer reference */}
      <audio 
        ref={audioRef} 
        src="https://mixkit.co" 
        preload="auto"
      />

      {/* Mode Indicator Badges */}
      <div className="flex gap-2 mb-4">
        <span className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider transition-all duration-300 ${mode === 'work' ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300' : 'bg-slate-100 text-slate-500 dark:bg-slate-700/50 dark:text-slate-400'}`}>
          💼 Work Session
        </span>
        <span className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider transition-all duration-300 ${mode === 'shortBreke' ? 'bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300' : 'bg-slate-100 text-slate-500 dark:bg-slate-700/50 dark:text-slate-400'}`}>
          ☕ Break Time
        </span>
      </div>

      {/* Reusable UI Primitive Component Display Blocks from Step 2 */}
      <TimerDisplay timeInseconds={secondsLeft} />
      
      <div className="w-full my-6">
        <ProgressBar currentSeconds={secondsLeft} totalSeconds={totalSecondsForCurrentMode} />
      </div>

      {/* Basic Control Layout Buttons (We will activate Skip/Reset handlers in Step 7) */}
      <div className="flex gap-4 mt-4 w-full justify-center">
        <Button 
          variant={isRunning ? 'secondary' : 'primary'} 
          onClick={() => setIsRunning(!isRunning)}
        >
          {isRunning ? 'Pause' : 'Start'}
        </Button>
      </div>
    </div>
  );

};