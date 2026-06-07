import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { LayoutDashboard, Users, Activity, FileText, Settings, BarChart2, TrendingUp } from 'lucide-react';

function scrollToSection(id) {
  const el = document.getElementById(id);
  if (el) {
    el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
}

export default function Sidebar() {
  const location = useLocation();
  const navigate = useNavigate();
  const [isDarkMode, setIsDarkMode] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  const adminLinks = [
    { name: 'Dashboard', path: '/', icon: <LayoutDashboard className="w-5 h-5" />, scroll: null },
    { name: 'Vendors', path: '#vendors', icon: <Users className="w-5 h-5" />, scroll: 'vendors' },
    { name: 'Analytics', path: '#analytics', icon: <Activity className="w-5 h-5" />, scroll: 'analytics' },
    { name: 'Reports', path: '/reports', icon: <FileText className="w-5 h-5" /> },
    { name: 'Settings', path: '/settings', icon: <Settings className="w-5 h-5" /> },
  ];

  const vendorLinks = [
    { name: 'My Performance', path: `/vendor/${user?.vendorId}`, icon: <BarChart2 className="w-5 h-5" /> },
    { name: 'Reliability Score', path: `/vendor/${user?.vendorId}#score`, icon: <TrendingUp className="w-5 h-5" /> },
    { name: 'Delivery Analytics', path: `/vendor/${user?.vendorId}#delivery`, icon: <Activity className="w-5 h-5" /> },
  ];

  const navLinks = user?.role === 'admin' ? adminLinks : vendorLinks;

  const isActive = (link) => {
    if (link.path === '/') return location.pathname === '/';
    if (link.path?.startsWith('/vendor/')) return location.pathname.startsWith('/vendor/');
    if (link.path === '/reports') return location.pathname === '/reports';
    if (link.path === '/settings') return location.pathname === '/settings';
    return false;
  };

  return (
    <div className="w-64 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 h-screen sticky top-0 flex flex-col transition-colors duration-300">
      <div className="h-16 flex items-center px-6 border-b border-slate-200 dark:border-slate-800">
        <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center mr-3">
          <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </svg>
        </div>
        <span className="font-bold text-lg text-slate-900 dark:text-white tracking-tight">Analytics</span>
      </div>

      <nav className="flex-1 px-4 py-6 space-y-1">
        {navLinks.map((link) => {
          const active = isActive(link);

          if (link.disabled) {
            return (
              <span
                key={link.name}
                className="flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium text-slate-400 dark:text-slate-600 cursor-not-allowed select-none"
              >
                <span className="opacity-50">{link.icon}</span>
                {link.name}
              </span>
            );
          }

          if (link.scroll) {
            return (
              <button
                key={link.name}
                onClick={() => {
                  if (location.pathname !== '/') {
                    navigate('/');
                    setTimeout(() => scrollToSection(link.scroll), 100);
                  } else {
                    scrollToSection(link.scroll);
                  }
                }}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-colors duration-200 text-left cursor-pointer ${
                  active
                    ? 'bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 font-semibold'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white font-medium'
                }`}
              >
                {link.icon}
                {link.name}
              </button>
            );
          }

          return (
            <Link
              key={link.name}
              to={link.path}
              className={`flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-colors duration-200 ${
                active
                  ? 'bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 font-semibold'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white font-medium'
              }`}
            >
              {link.icon}
              {link.name}
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-slate-200 dark:border-slate-800">
        <button 
          onClick={() => setIsDarkMode(!isDarkMode)}
          className="flex items-center gap-3 w-full px-3 py-2 rounded-md text-sm font-medium text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors cursor-pointer"
        >
          {isDarkMode ? (
            <>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
              Light Mode
            </>
          ) : (
            <>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" /></svg>
              Dark Mode
            </>
          )}
        </button>
      </div>
    </div>
  );
}
