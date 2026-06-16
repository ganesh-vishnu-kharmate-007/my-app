//Create the Main Shell Layout
//
//NavLink (The Smart Navigation Button)
//Outlet (The Page Placeholder)
// is active is conditional function that 
import { NavLink, Outlet } from 'react-router-dom';
export const AppLayout = () => {
    const getNavLinkClass = ({ isActive }: { isActive: boolean }) => 
    `px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
      isActive 
        ? 'bg-emerald-600 text-white shadow-sm' 
        : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-slate-800'
    }`;
    
     return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-slate-100 flex flex-col">
      {/* GLOBAL NAVBAR SHELL */}
      <nav className="bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 shadow-sm">
        <div className="max-w-4xl mx-auto px-4 h-16 flex items-center justify-between">
          <span className="font-extrabold text-xl tracking-tight text-emerald-600">FocusFlow</span>
          <div className="flex gap-2">
            <NavLink to="/" className={getNavLinkClass}>Timer</NavLink>
            <NavLink to="/history" className={getNavLinkClass}>History</NavLink>
            <NavLink to="/settings" className={getNavLinkClass}>Settings</NavLink>
          </div>
        </div>
      </nav>

      {/* DYNAMIC CONTENT OUTLET WINDOW */}
      <main className="flex-1 max-w-4xl mx-auto w-full p-6">
        <Outlet />
      </main>
    </div>
  );
};
