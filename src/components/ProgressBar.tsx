import React from "react";

interface ProgressBarProps {
         currentSeconds: number;
         totalSeconds: number;
};
// We are creating a constant variable named ProgressBar and defining its strict TypeScript data type.
//react.fc tells to TS variable is not a normal string or number; it is a official React component function.
export const ProgressBar : React.FC<ProgressBarProps> = ({ currentSeconds, totalSeconds }) => {
     const percentage = totalSeconds > 0 ? (currentSeconds / totalSeconds) * 100 : 0;// basically it's countdown function 
     return (                                                                         // Ternary Operator Is this true ? Do this if true : Do this if false;
    <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-3 overflow-hidden shadow-inner">
      <div 
        className="bg-emerald-500 h-full transition-all duration-100 ease-linear"
        style={{ width: `${percentage}%` }} // Injects the live calculated width percentage into the layout
      />
    </div>
  );
}