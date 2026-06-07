import { useAuth } from '../context/AuthContext';
import { LogOut, User } from 'lucide-react';

export default function Header() {
  const { user, logout } = useAuth();

  return (
    <header className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 h-16 flex items-center justify-end px-6 sticky top-0 z-40 transition-colors duration-300">
      <div className="flex items-center gap-6">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center border border-slate-200 dark:border-slate-700">
            <User className="w-4 h-4 text-slate-600 dark:text-slate-400" />
          </div>
          <div className="flex flex-col">
            <span className="text-xs text-slate-500 dark:text-slate-400 uppercase tracking-wider font-semibold">Logged in as</span>
            <span className="text-sm font-medium text-slate-900 dark:text-white capitalize">{user?.role}</span>
          </div>
        </div>
        
        <div className="w-px h-6 bg-slate-200 dark:bg-slate-700"></div>
        
        <button 
          onClick={logout}
          className="flex items-center gap-2 text-sm font-medium text-slate-600 dark:text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 transition-colors"
        >
          <LogOut className="w-4 h-4" />
          Logout
        </button>
      </div>
    </header>
  );
}
