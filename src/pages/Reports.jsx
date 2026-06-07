import { useState, useEffect } from 'react';
import axiosClient from '../api/axiosClient';
import SummaryCard from '../components/SummaryCard';
import { useUploadedData } from '../context/UploadedDataContext';

function computeScore(v) {
  return Math.round((v.completedOrders / (v.completedOrders + v.failedOrders)) * 100);
}

function exportCSV(vendors) {
  const headers = ['Vendor', 'Reliability Score', 'Rating', 'Complaints', 'Status', 'Region'];
  const rows = vendors.map(v => [v.name, v.reliabilityScore, v.rating, v.totalComplaints, v.status, v.region]);
  const csv = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `vendors-${new Date().toISOString().slice(0, 10)}.csv`;
  a.click();
  URL.revokeObjectURL(url);
}

function exportJSON(vendors) {
  const blob = new Blob([JSON.stringify(vendors, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `vendors-${new Date().toISOString().slice(0, 10)}.json`;
  a.click();
  URL.revokeObjectURL(url);
}

export default function Reports() {
  const [vendors, setVendors] = useState([]);
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);

  const { uploadData } = useUploadedData();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [vRes, sRes] = await Promise.all([
          axiosClient.get('/vendors'),
          axiosClient.get('/summary')
        ]);
        setVendors(vRes.data);
        setSummary(sRes.data);
      } catch (err) {
        console.error('Error loading report data:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const vendorsWithUploads = vendors.map(v => {
    const uploaded = uploadData[v.id];
    if (uploaded) {
      return { ...v, ...uploaded };
    }
    return v;
  });

  const poorCount = vendorsWithUploads.filter(v => v.reliabilityScore < 60).length;
  const topVendor = [...vendorsWithUploads].sort((a, b) => b.reliabilityScore - a.reliabilityScore)[0];
  const worstVendor = [...vendorsWithUploads].sort((a, b) => b.totalComplaints - a.totalComplaints)[0];

  if (loading) {
    return (
      <div className="space-y-8 animate-pulse">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1,2,3,4].map(i => <div key={i} className="bg-white dark:bg-slate-800 rounded-xl p-6 h-32 border border-slate-200 dark:border-slate-700" />)}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 fade-in">
      <div>
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Reports & Exports</h1>
        <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">Platform summary, data exports, and quick previews.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <SummaryCard title="Total Vendors" value={summary?.totalVendors || 0} icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>} />
        <SummaryCard title="Avg Reliability" value={`${summary?.avgReliabilityScore || 0}%`} icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>} />
        <SummaryCard title="Poor Performers" value={poorCount} icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>} />
        <SummaryCard title="Total Complaints" value={summary?.totalComplaints || 0} icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>} />
      </div>

      <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">Export Data</h2>
        <div className="flex flex-wrap gap-4">
          <button onClick={() => exportCSV(vendorsWithUploads)} className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-lg text-sm font-medium transition-colors">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
            Export Vendors CSV
          </button>
          <button onClick={() => exportJSON(vendorsWithUploads)} className="flex items-center gap-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-700 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-200 px-5 py-2.5 rounded-lg text-sm font-medium transition-colors">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
            Export Vendors JSON
          </button>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-6">Quick Report Preview</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-slate-50 dark:bg-slate-900/50 rounded-lg p-5 border border-slate-100 dark:border-slate-700/50">
            <div className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">Top Performer</div>
            <div className="text-lg font-bold text-slate-900 dark:text-white">{topVendor?.name || '-'}</div>
            <div className="text-sm text-emerald-600 dark:text-emerald-400 font-medium">{topVendor?.reliabilityScore || 0}%</div>
          </div>
          <div className="bg-slate-50 dark:bg-slate-900/50 rounded-lg p-5 border border-slate-100 dark:border-slate-700/50">
            <div className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">Highest Complaints</div>
            <div className="text-lg font-bold text-slate-900 dark:text-white">{worstVendor?.name || '-'}</div>
            <div className="text-sm text-rose-600 dark:text-rose-400 font-medium">{worstVendor?.totalComplaints || 0} complaints</div>
          </div>
          <div className="bg-slate-50 dark:bg-slate-900/50 rounded-lg p-5 border border-slate-100 dark:border-slate-700/50">
            <div className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">Average Reliability</div>
            <div className="text-lg font-bold text-slate-900 dark:text-white">{summary?.avgReliabilityScore || 0}%</div>
            <div className="text-sm text-slate-500 dark:text-slate-400 font-medium">across {summary?.totalVendors || 0} vendors</div>
          </div>
        </div>
      </div>
    </div>
  );
}
