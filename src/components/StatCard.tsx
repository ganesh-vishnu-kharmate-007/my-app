import React from "react";

interface  StatCardProps {
     title: string;
  value: string | number; // The pipe symbol | forms a union type, giving you the flexibility to pass text or raw digits without causing a TypeScript error.
};

export const StatCard: React.FC<StatCardProps> = ({title,value}) =>{
     return (
    <div className="border border-slate-200 dark:border-slate-700 p-5 rounded-2xl text-center bg-white dark:bg-slate-800 shadow-sm min-w-[150px]">
      <h3 className="text-slate-400 dark:text-slate-500 text-xs font-bold uppercase tracking-wider mb-2">{title}</h3>
      <p className="text-3xl font-extrabold text-slate-800 dark:text-slate-100">{value}</p>
    </div>
     );
};