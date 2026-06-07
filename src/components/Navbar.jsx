import { Link } from 'react-router-dom';

export default function Navbar() {
  return (
    <nav className="glass sticky top-0 z-50 border-b border-white/10 backdrop-blur-md bg-[#0f172a]/70">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center gap-3 group">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center shadow-lg group-hover:shadow-indigo-500/50 transition-shadow duration-300">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <span className="font-bold text-xl tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400">
                Reliability Analytics
              </span>
            </Link>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-sm font-medium text-slate-400 tracking-wide uppercase">Admin Mode</div>
            <div className="h-9 w-9 rounded-full bg-gradient-to-br from-slate-700 to-slate-800 flex items-center justify-center border border-slate-600 shadow-inner">
              <span className="text-xs font-bold text-slate-300">AD</span>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
