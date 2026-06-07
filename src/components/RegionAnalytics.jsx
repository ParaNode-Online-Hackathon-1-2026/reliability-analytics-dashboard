import { useMemo } from 'react';

function computeScore(v) {
  return Math.round((v.completedOrders / (v.completedOrders + v.failedOrders)) * 100);
}

export default function RegionAnalytics({ vendors = [] }) {
  const regions = useMemo(() => {
    const map = {};
    vendors.forEach(v => {
      if (!map[v.region]) map[v.region] = { vendors: [], totalScore: 0 };
      map[v.region].vendors.push(v.name);
      map[v.region].totalScore += computeScore(v);
    });
    return Object.entries(map).map(([name, data]) => ({
      name,
      count: data.vendors.length,
      avgScore: Math.round(data.totalScore / data.vendors.length),
      vendorNames: data.vendors
    }));
  }, [vendors]);

  if (regions.length === 0) return null;

  return (
    <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-6 shadow-sm flex flex-col h-full">
      <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
        <svg className="w-5 h-5 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        Region Analytics
      </h3>
      <div className="space-y-3 flex-1">
        {regions.map(r => (
          <div key={r.name} className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-900/50 rounded-lg border border-slate-100 dark:border-slate-700/50">
            <div className="flex items-center gap-3">
              <span className="w-2 h-2 rounded-full bg-indigo-500" />
              <span className="font-medium text-slate-900 dark:text-white">{r.name}</span>
              <span className="text-xs text-slate-400">({r.count} vendor{r.count > 1 ? 's' : ''})</span>
            </div>
            <div className="text-sm font-bold text-emerald-600 dark:text-emerald-400">{r.avgScore}%</div>
          </div>
        ))}
      </div>
    </div>
  );
}
