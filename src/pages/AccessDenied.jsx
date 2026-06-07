import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ShieldX } from 'lucide-react';

export default function AccessDenied() {
  const { user } = useAuth();
  
  const homePath = user?.role === 'admin' ? '/' : `/vendor/${user?.vendorId}`;

  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center px-4">
      <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-8 max-w-md w-full text-center shadow-sm">
        <div className="w-16 h-16 bg-rose-100 dark:bg-rose-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
          <ShieldX className="w-8 h-8 text-rose-500" />
        </div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Access Denied</h1>
        <p className="text-slate-500 dark:text-slate-400 mb-8">
          You do not have permission to access this page. Please return to your designated dashboard.
        </p>
        <Link 
          to={homePath}
          className="inline-flex items-center justify-center w-full px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg transition-colors"
        >
          Return Home
        </Link>
      </div>
    </div>
  );
}
