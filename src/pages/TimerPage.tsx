import { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { useTimerSettings } from '../context/TimerSettingsContext';
import type { Mode } from '../types';
import { TimerDisplay } from '../components/TimerDisplay';
import { ProgressBar } from '../components/ProgressBar';
import { Button } from '../components/Button';
import { useFetch } from '../hooks/useFetch';

interface QuoteResponse {
  content: string;
  author: string;
}

const localFallbackQuotes = [
  { content: "Focus is a muscle, and you are building it right now.", author: "FocusFlow" },
  { content: "Take a deep breath. Rest is part of the work.", author: "Productivity Master" },
  { content: "Your mind is for having ideas, not holding them.", author: "David Allen" },
  { content: "Do not confuse motion with progress. Breathe.", author: "Alfred Montapert" }
];

export const TimerPage = () => {
  const { settings, addSession } = useTimerSettings();

  const [mode, setMode] = useState<Mode>('work');
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [secondsLeft, setSecondsLeft] = useState<number>(() => settings.durations.work);
  const [workSessionCount, setWorkSessionCount] = useState<number>(0);
  
  // FIXED HERE: Store the fallback quote object directly in state to keep render pure
  const [localQuote, setLocalQuote] = useState(() => localFallbackQuotes[0]);

  const timerRef = useRef<number | null>(null);
  const audioRef = useRef<HTMLAudioElement>(null);

  const totalSecondsForCurrentMode = settings.durations[mode];

  const { data: apiQuote, loading: quoteLoading, error: quoteError } = useFetch<QuoteResponse>(
    'https://vercel.app'
  );

  const formattedTimeStr = useMemo(() => {
    const minutes = Math.floor(secondsLeft / 60);
    const seconds = secondsLeft % 60;
    const format = (num: number): string => String(num).padStart(2, '0');
    return `${format(minutes)}:${format(seconds)}`;
  }, [secondsLeft]);

  // PHASE CYCLING LOGIC: Side effects run cleanly inside our callback action
  const handlePhaseCompletion = useCallback(() => {
    setIsRunning(false);

    // FIXED HERE: Safely pick a random backup quote inside an event block, outside of render
    const randomIndex = Math.floor(Math.random() * localFallbackQuotes.length);
    setLocalQuote(localFallbackQuotes[randomIndex]);

    if (mode === 'work') {
      addSession('work');
      const nextCount = workSessionCount + 1;
      setWorkSessionCount(nextCount);

      if (nextCount >= settings.sessonBeforeLongBreke) {
        setMode('longBreke');
        setSecondsLeft(settings.durations.longBreke);
        setWorkSessionCount(0);
      } else {
        setMode('shortBreke');
        setSecondsLeft(settings.durations.shortBreke);
      }
    } else {
      setMode('work');
      setSecondsLeft(settings.durations.work);
    }
  }, [mode, workSessionCount, settings, addSession]);

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

  useEffect(() => {
    if (isRunning) {
      timerRef.current = window.setInterval(() => {
        setSecondsLeft((prevSeconds) => {
          if (prevSeconds <= 1) {
            if (audioRef.current) {
              audioRef.current.play().catch((err) => console.log("Audio blocked:", err));
            }
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

  useEffect(() => {
    const statusIndicator = isRunning ? '▶' : '⏸';
    const modeLabels: Record<Mode, string> = {
      work: 'Work',
      shortBreke: 'Short Break',
      longBreke: 'Long Break',
    };
    document.title = `${formattedTimeStr} ${statusIndicator} ${modeLabels[mode]} - FocusFlow`;
    
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

      {/* Mode Indicators */}
      <div className="flex gap-2 mb-4">
        <span className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider transition-all duration-300 ${mode === 'work' ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300' : 'bg-slate-100 text-slate-400 dark:bg-slate-700/40'}`}>
          💼 Work
        </span>
        <span className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider transition-all duration-300 ${mode === 'shortBreke' ? 'bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300' : 'bg-slate-100 text-slate-400 dark:bg-slate-700/40'}`}>
          ☕ Short Break
        </span>
        <span className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider transition-all duration-300 ${mode === 'longBreke' ? 'bg-purple-100 text-purple-800 dark:bg-purple-950 dark:text-purple-300' : 'bg-slate-100 text-slate-400 dark:bg-slate-700/40'}`}>
          🌴 Long Break
        </span>
      </div>

      <TimerDisplay timeInseconds={secondsLeft} />
      
      <div className="w-full my-6">
        <ProgressBar currentSeconds={secondsLeft} totalSeconds={totalSecondsForCurrentMode} />
      </div>

      <p className="text-xs text-slate-400 mb-6 font-medium">
        Session Streak: {workSessionCount} / {settings.sessonBeforeLongBreke} before Long Break
      </p>

      <div className="flex gap-3 w-full justify-center mb-8">
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

      {mode !== 'work' && (
        <div className="w-full pt-6 border-t border-slate-100 dark:border-slate-700/50 text-center animate-fade-in">
          {quoteLoading ? (
            <p className="text-sm italic text-slate-400 animate-pulse">Loading break quote...</p>
          ) : quoteError || !apiQuote ? (
            <div>
              <p className="text-sm italic font-medium text-slate-600 dark:text-slate-300">"{localQuote.content}"</p>
              <p className="text-xs text-slate-400 mt-1 font-semibold">— {localQuote.author}</p>
            </div>
          ) : (
            <div>
              <p className="text-sm italic font-medium text-slate-600 dark:text-slate-300">"{apiQuote.content}"</p>
              <p className="text-xs text-slate-400 mt-1 font-semibold">— {apiQuote.author}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
