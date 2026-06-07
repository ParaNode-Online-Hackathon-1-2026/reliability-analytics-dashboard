import { Link } from 'react-router-dom';
import StatusBadge from './StatusBadge';

function exportReport(vendors) {
  const headers = ['Vendor', 'Reliability Score', 'Rating', 'Complaints', 'Status', 'Region'];
  const rows = vendors.map(v => [
    v.name,
    v.reliabilityScore,
    v.rating,
    v.totalComplaints,
    v.status,
    v.region
  ]);

  const csvContent = [
    headers.join(','),
    ...rows.map(r => r.join(','))
  ].join('\n');

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `vendor-report-${new Date().toISOString().slice(0, 10)}.csv`;
  a.click();
  URL.revokeObjectURL(url);
}

export default function VendorTable({ vendors, onSearch, onSort, searchQuery, sortOption }) {
  return (
    <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl shadow-sm overflow-hidden flex flex-col">
      <div className="p-5 border-b border-slate-200 dark:border-slate-700 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-50 dark:bg-slate-800/50">
        <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Vendor Directory</h2>
        <div className="flex items-center gap-3">
          <div className="relative">
            <input
              type="text"
              placeholder="Search vendors..."
              className="bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg pl-9 pr-4 py-2 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 w-full sm:w-64 transition-shadow"
              value={searchQuery}
              onChange={(e) => onSearch(e.target.value)}
            />
            <svg className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <select 
            className="bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg px-4 py-2 text-sm text-slate-700 dark:text-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            value={sortOption}
            onChange={(e) => onSort(e.target.value)}
          >
            <option value="">Sort by: None</option>
            <option value="score">Reliability Score</option>
            <option value="complaints">Total Complaints</option>
            <option value="rating">Rating</option>
          </select>
          <button
            onClick={() => exportReport(vendors)}
            className="flex items-center gap-1.5 bg-indigo-600 hover:bg-indigo-700 text-white px-3 py-2 rounded-lg text-sm font-medium transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            Export
          </button>
        </div>
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm text-slate-600 dark:text-slate-300">
          <thead className="text-slate-500 dark:text-slate-400 uppercase text-xs tracking-wider sticky top-0 bg-slate-50 dark:bg-slate-900/90 backdrop-blur-sm z-10 border-b border-slate-200 dark:border-slate-700">
            <tr>
              <th className="px-6 py-4 font-semibold">Vendor</th>
              <th className="px-6 py-4 font-semibold">Reliability</th>
              <th className="px-6 py-4 font-semibold">Rating</th>
              <th className="px-6 py-4 font-semibold">Complaints</th>
              <th className="px-6 py-4 font-semibold">Status</th>
              <th className="px-6 py-4 font-semibold text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200 dark:divide-slate-700/50">
            {vendors.length === 0 ? (
              <tr>
                <td colSpan="6" className="px-6 py-12 text-center text-slate-500 dark:text-slate-400">
                  No vendors found matching your search.
                </td>
              </tr>
            ) : (
              vendors.map((vendor) => (
                <tr key={vendor.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors duration-200 group">
                  <td className="px-6 py-4 font-medium text-slate-900 dark:text-white">{vendor.name}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <span className="font-semibold w-8">{vendor.reliabilityScore}%</span>
                      <div className="w-24 h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                        <div 
                          className={`h-full rounded-full ${
                            vendor.reliabilityScore > 80 ? 'bg-emerald-500' : 
                            vendor.reliabilityScore >= 60 ? 'bg-amber-500' : 'bg-rose-500'
                          }`}
                          style={{ width: `${vendor.reliabilityScore}%` }}
                        />
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 flex items-center gap-1.5">
                    <span className="font-semibold">{vendor.rating}</span>
                    <svg className="w-4 h-4 text-amber-400" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  </td>
                  <td className="px-6 py-4">{vendor.totalComplaints}</td>
                  <td className="px-6 py-4">
                    <StatusBadge status={vendor.status} />
                  </td>
                  <td className="px-6 py-4 text-right">
                    <Link 
                      to={`/vendor/${vendor.id}`}
                      className="text-indigo-600 hover:text-indigo-700 dark:text-indigo-400 dark:hover:text-indigo-300 font-medium inline-flex items-center gap-1 transition-colors"
                    >
                      View
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                      </svg>
                    </Link>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
