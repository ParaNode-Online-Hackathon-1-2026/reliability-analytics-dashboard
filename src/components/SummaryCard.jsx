import CountUp from 'react-countup';

export default function SummaryCard({ title, value, icon, trend, highlight }) {
  const isString = typeof value === 'string';
  const numericValue = parseFloat(value) || 0;
  const suffix = isString ? value.replace(/[0-9.]/g, '') : '';
  
  return (
    <div className={`bg-white dark:bg-slate-800 rounded-xl p-6 shadow-sm border transition-all duration-300 hover:-translate-y-1 hover:shadow-md ${highlight ? 'border-indigo-500/50 dark:border-indigo-400/50 shadow-indigo-100 dark:shadow-none' : 'border-slate-200 dark:border-slate-700'}`}>
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">{title}</h3>
        {icon && (
          <div className={`p-2 rounded-lg ${highlight ? 'bg-indigo-50 dark:bg-indigo-500/20 text-indigo-600 dark:text-indigo-400' : 'bg-slate-50 dark:bg-slate-700 text-slate-400 dark:text-slate-300'}`}>
            {icon}
          </div>
        )}
      </div>
      <div className="mt-4 flex items-baseline gap-3">
        <div className={`text-3xl font-bold ${highlight ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-900 dark:text-white'}`}>
          {!isString || !isNaN(numericValue) ? (
            <CountUp end={numericValue} duration={2} decimals={numericValue % 1 !== 0 ? 1 : 0} suffix={suffix} />
          ) : (
            value
          )}
        </div>
        {trend && (
          <div className={`flex items-center text-sm font-medium ${trend.positive ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'}`}>
            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {trend.positive 
                ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                : <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6" />
              }
            </svg>
            {trend.value}
          </div>
        )}
      </div>
    </div>
  );
}
