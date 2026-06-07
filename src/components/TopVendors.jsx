export default function TopVendors({ vendors }) {
  // Sort by reliability score and take top 3
  const topVendors = [...vendors].sort((a, b) => b.reliabilityScore - a.reliabilityScore).slice(0, 3);

  return (
    <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-6 shadow-sm flex flex-col h-full">
      <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
        <svg className="w-5 h-5 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
        </svg>
        Top Performers
      </h3>
      <div className="space-y-3 flex-1">
        {topVendors.map((vendor, index) => (
          <div key={vendor.id} className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-800/50 rounded-lg border border-slate-100 dark:border-slate-700/50">
            <div className="flex items-center gap-3">
              <span className={`text-lg font-black ${index === 0 ? 'text-amber-500' : index === 1 ? 'text-slate-400' : 'text-amber-700 dark:text-amber-600'}`}>
                #{index + 1}
              </span>
              <span className="font-medium text-slate-900 dark:text-white">{vendor.name}</span>
            </div>
            <div className="text-sm font-bold text-emerald-600 dark:text-emerald-400">
              {vendor.reliabilityScore}%
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
