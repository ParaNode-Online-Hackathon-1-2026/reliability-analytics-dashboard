export default function ChartCard({ title, children }) {
  return (
    <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-6 flex flex-col h-full shadow-sm transition-all duration-300 hover:shadow-md">
      <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-6">{title}</h3>
      <div className="flex-1 w-full min-h-[300px]">
        {children}
      </div>
    </div>
  );
}
