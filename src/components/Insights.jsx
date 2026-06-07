import { useMemo } from 'react';

function computeScore(v) {
  return Math.round((v.completedOrders / (v.completedOrders + v.failedOrders)) * 100);
}

export default function Insights({ vendors = [] }) {
  const insights = useMemo(() => {
    if (vendors.length === 0) return [];

    const scored = vendors.map(v => ({ ...v, computedScore: computeScore(v) }));

    const topVendor = scored.reduce((best, v) => v.computedScore > best.computedScore ? v : best, scored[0]);
    const worstVendor = scored.reduce((worst, v) => v.totalComplaints > worst.totalComplaints ? v : worst, scored[0]);
    const goodCount = scored.filter(v => v.computedScore > 80).length;
    const goodPercent = Math.round((goodCount / scored.length) * 100);

    return [
      { text: `${topVendor.name} is currently the most reliable vendor (${topVendor.computedScore}%).`, type: 'positive' },
      { text: `${worstVendor.name} has the highest complaint volume (${worstVendor.totalComplaints} complaints).`, type: 'negative' },
      { text: `${goodPercent}% of vendors are classified as Good performers.`, type: goodPercent >= 50 ? 'positive' : 'negative' },
    ];
  }, [vendors]);

  return (
    <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-6 shadow-sm flex flex-col h-full">
      <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
        <svg className="w-5 h-5 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
        AI Insights
      </h3>
      <ul className="space-y-4 flex-1">
        {insights.map((insight, index) => (
          <li key={index} className="flex items-start gap-3">
            <div className={`mt-1 flex-shrink-0 w-2 h-2 rounded-full ${insight.type === 'positive' ? 'bg-emerald-500' : 'bg-rose-500'}`}></div>
            <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">{insight.text}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}
