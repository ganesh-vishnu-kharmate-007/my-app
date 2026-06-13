import React from "react";
// timer display props 
interface TimerDisplayProps{
    timeInseconds: number;

}
// creted function for props thst contain the time display 
export const TimerDisplay: React.FC<TimerDisplayProps> = ({ timeInseconds }) =>{
    
    const minutes = Math.floor(timeInseconds / 60);//its bacis math calculation it divede total second by 60
  const seconds = timeInseconds % 60; // % its reminder that divide the total second time into 60 and extract left over
  const formatNumber = (num: number): string => String(num).padStart(2, '0');
    //num is varibale that contain only number and string ts return type that conform whatever outcome will string
  //padStart(2, '0'): This ensures your clock always looks like a digital timer (02:05)
  return(
     <h1 className="text-6xl font-mono my-6 font-bold tracking-widest text-slate-800 dark:text-slate-100">
      {formatNumber(minutes)}:{formatNumber(seconds)}
    </h1>
  );
};