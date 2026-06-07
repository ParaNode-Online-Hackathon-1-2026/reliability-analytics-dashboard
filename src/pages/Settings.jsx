import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LogOut, Sun, Moon, Shield, User, Info, Lock, CheckCircle, XCircle } from 'lucide-react';

export default function Settings() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isDarkMode, setIsDarkMode] = useState(
    document.documentElement.classList.contains('dark')
  );

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const sectionClass = "bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-6 shadow-sm";
  const labelClass = "text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider";
  const valueClass = "text-sm font-medium text-slate-900 dark:text-white";
  const rowClass = "flex items-center justify-between py-3 border-b border-slate-100 dark:border-slate-700/50 last:border-0";

  return (
    <div className="space-y-6 fade-in">
      <div>
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Settings</h1>
        <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">Manage your application preferences and view account details.</p>
      </div>

      <div className={sectionClass}>
        <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
          <Sun className="w-5 h-5 text-amber-500" />
          Appearance
        </h2>
        <div className={rowClass}>
          <div>
            <div className={labelClass}>Theme</div>
            <div className={valueClass}>Current Theme: {isDarkMode ? 'Dark' : 'Light'}</div>
          </div>
          <button
            onClick={() => setIsDarkMode(!isDarkMode)}
            className="flex items-center gap-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-700 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-200 px-4 py-2 rounded-lg text-sm font-medium transition-colors"
          >
            {isDarkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            Switch to {isDarkMode ? 'Light' : 'Dark'}
          </button>
        </div>
      </div>

      <div className={sectionClass}>
        <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
          <User className="w-5 h-5 text-indigo-500" />
          Account
        </h2>
        <div className={rowClass}>
          <div>
          <div className={labelClass}>Logged in as</div>
          <div className={`text-sm font-medium capitalize ${user?.role === 'admin' ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-900 dark:text-white'}`}>{user?.role || '-'}</div>
          </div>
        </div>
        <div className={rowClass}>
          <div>
            <div className={labelClass}>Username</div>
            <div className={valueClass}>{user?.username || '-'}</div>
          </div>
        </div>
        <div className={rowClass}>
          <div>
            <div className={labelClass}>Role</div>
            <div className={valueClass}>{user?.role || '-'}</div>
          </div>
        </div>
      </div>

      <div className={sectionClass}>
        <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
          <Info className="w-5 h-5 text-sky-500" />
          Application Info
        </h2>
        <div className={rowClass}>
          <div>
            <div className={labelClass}>Application</div>
            <div className={valueClass}>Reliability Analytics Dashboard</div>
          </div>
        </div>
        <div className={rowClass}>
          <div>
            <div className={labelClass}>Version</div>
            <div className={valueClass}>1.0.0</div>
          </div>
        </div>
        <div className={rowClass}>
          <div>
            <div className={labelClass}>Environment</div>
            <div className={valueClass}>Development</div>
          </div>
        </div>
      </div>

      <div className={sectionClass}>
        <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
          <Lock className="w-5 h-5 text-rose-500" />
          Security
        </h2>
        <div className={rowClass}>
          <div>
            <div className={labelClass}>Current Access Level</div>
            <div className={`text-sm font-medium mt-1 ${user?.role === 'admin' ? 'text-emerald-600 dark:text-emerald-400' : 'text-amber-600 dark:text-amber-400'}`}>
              {user?.role === 'admin' ? 'Admin — Full Access' : 'Vendor — Restricted Access'}
            </div>
          </div>
        </div>
        <div className="mt-4 space-y-2">
          <div className="flex items-center gap-3 text-sm">
            <CheckCircle className="w-4 h-4 text-emerald-500" />
            <span className="text-slate-600 dark:text-slate-400">Admin: Full Access to all pages and data</span>
          </div>
          <div className="flex items-center gap-3 text-sm">
            {user?.role === 'admin' ? <XCircle className="w-4 h-4 text-slate-300 dark:text-slate-600" /> : <CheckCircle className="w-4 h-4 text-emerald-500" />}
            <span className="text-slate-600 dark:text-slate-400">Vendor: Restricted to own performance data</span>
          </div>
        </div>
      </div>

      <div className={sectionClass}>
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Logout</h2>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Sign out of your account.</p>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 bg-rose-600 hover:bg-rose-700 text-white px-5 py-2.5 rounded-lg text-sm font-medium transition-colors"
          >
            <LogOut className="w-4 h-4" />
            Logout
          </button>
        </div>
      </div>
    </div>
  );
}
