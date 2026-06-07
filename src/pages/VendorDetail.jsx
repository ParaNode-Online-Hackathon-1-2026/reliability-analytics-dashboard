import { useState, useEffect } from 'react';
import { useParams, Link, useLocation } from 'react-router-dom';
import axiosClient from '../api/axiosClient';
import SummaryCard from '../components/SummaryCard';
import ChartCard from '../components/ChartCard';
import StatusBadge from '../components/StatusBadge';
import Recommendations from '../components/Recommendations';
import UploadSection from '../components/UploadSection';
import BenchmarkSection from '../components/BenchmarkSection';
import { useUploadedData } from '../context/UploadedDataContext';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer, LineChart, Line, CartesianGrid, XAxis, YAxis } from 'recharts';

function SkeletonLoader() {
  return (
    <div className="space-y-8 animate-pulse">
      <div className="bg-white dark:bg-slate-800 rounded-xl h-32 border border-slate-200 dark:border-slate-700"></div>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[1, 2, 3, 4].map(i => <div key={i} className="bg-white dark:bg-slate-800 rounded-xl p-6 h-32 border border-slate-200 dark:border-slate-700"></div>)}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {[1, 2].map(i => <div key={i} className="bg-white dark:bg-slate-800 rounded-xl p-6 h-96 border border-slate-200 dark:border-slate-700"></div>)}
      </div>
    </div>
  );
}

export default function VendorDetail() {
  const { id } = useParams();
  const { hash } = useLocation();
  const [vendor, setVendor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { getUploadForVendor } = useUploadedData();

  useEffect(() => {
    const fetchVendor = async () => {
      try {
        setLoading(true);
        const res = await axiosClient.get(`/vendors/${id}`);
        setVendor(res.data);
      } catch (err) {
        console.error("Error fetching vendor details:", err);
        setError('Vendor not found or error loading data.');
      } finally {
        setLoading(false);
      }
    };
    fetchVendor();
  }, [id]);

  const uploaded = vendor ? getUploadForVendor(vendor.id) : null;
  const displayVendor = uploaded && vendor ? {
    ...vendor,
    completedOrders: uploaded.completedOrders,
    failedOrders: uploaded.failedOrders,
    totalOrders: uploaded.totalOrders,
    totalComplaints: uploaded.totalComplaints,
    reliabilityScore: uploaded.reliabilityScore,
    status: uploaded.status
  } : vendor;

  useEffect(() => {
    if (hash && !loading && displayVendor) {
      setTimeout(() => {
        const element = document.getElementById(hash.replace('#', ''));
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
    }
  }, [hash, loading, displayVendor]);

  if (loading) return <SkeletonLoader />;

  if (error || !displayVendor) {
    return (
      <div className="text-center py-20 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700">
        <div className="text-rose-500 font-medium mb-6">{error}</div>
        <Link to="/" className="inline-flex items-center gap-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-700 dark:hover:bg-slate-600 text-slate-900 dark:text-white px-6 py-3 rounded-lg transition-colors font-medium">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
          Back to Dashboard
        </Link>
      </div>
    );
  }

  const pieData = [
    { name: 'Completed', value: displayVendor.completedOrders, color: '#10b981' }, 
    { name: 'Failed', value: displayVendor.failedOrders, color: '#f43f5e' }       
  ];

  const isDark = document.documentElement.classList.contains('dark');
  const tooltipStyle = {
    backgroundColor: isDark ? '#1e293b' : '#ffffff',
    borderColor: isDark ? '#334155' : '#e2e8f0',
    color: isDark ? '#f8fafc' : '#0f172a',
    borderRadius: '0.5rem',
    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
  };

  return (
    <div className="space-y-6 fade-in">
      <Link to="/" className="inline-flex items-center gap-2 text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-300 transition-colors text-sm font-medium">
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
        Back to Dashboard
      </Link>

      <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-8 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-4 mb-2">
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight">{displayVendor.name}</h1>
            <StatusBadge status={displayVendor.status} />
          </div>
          <div className="text-slate-500 dark:text-slate-400 font-medium flex items-center gap-6">
            <span>Region: {displayVendor.region}</span>
            <span>ID: {displayVendor.id}</span>
          </div>
        </div>
        <div className="flex flex-col items-end gap-3">
          <div className="flex items-center gap-4 bg-slate-50 dark:bg-slate-900/50 px-6 py-4 rounded-lg border border-slate-100 dark:border-slate-700/50">
            <div className="text-sm font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-widest">Reliability Score</div>
            <div className="text-4xl font-bold text-indigo-600 dark:text-indigo-400">{displayVendor.reliabilityScore}%</div>
          </div>
          <div className="bg-slate-50/50 dark:bg-slate-900/30 px-5 py-2.5 rounded-lg border border-slate-100 dark:border-slate-700/30 text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
            <span className="font-medium text-slate-700 dark:text-slate-300">{displayVendor.completedOrders}</span> / ({displayVendor.completedOrders} + {displayVendor.failedOrders}) × 100 = {displayVendor.reliabilityScore}%
          </div>
        </div>
      </div>

      <div id="score" className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 scroll-mt-24">
        <SummaryCard 
          title="Total Orders" 
          value={displayVendor.totalOrders} 
          icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" /></svg>}
        />
        <SummaryCard 
          title="Rating" 
          value={`${displayVendor.rating}`} 
          suffix=" / 5"
          trend={{ value: 'Stable', positive: true }}
          icon={<svg className="w-5 h-5 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" /></svg>}
        />
        <SummaryCard 
          title="Complaints" 
          value={displayVendor.totalComplaints} 
          trend={{ value: 'Needs attention', positive: false }}
          icon={<svg className="w-5 h-5 text-rose-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>}
        />
        <SummaryCard 
          title="Avg Response Time" 
          value={`${displayVendor.avgResponseTime}h`} 
          icon={<svg className="w-5 h-5 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>}
        />
      </div>

      <BenchmarkSection vendor={displayVendor} />

      <div id="delivery" className="grid grid-cols-1 lg:grid-cols-2 gap-6 scroll-mt-24">
        <ChartCard title="Order Completion Breakdown">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                innerRadius={80}
                outerRadius={110}
                paddingAngle={5}
                dataKey="value"
                stroke="none"
              >
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip contentStyle={tooltipStyle} formatter={(value) => [`${value} Orders`, '']} />
              <Legend verticalAlign="bottom" height={36} iconType="circle" wrapperStyle={{ paddingTop: '20px' }} />
            </PieChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Weekly Delivery Performance">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={displayVendor.weeklyData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke={isDark ? '#334155' : '#e2e8f0'} vertical={false} />
              <XAxis dataKey="day" stroke={isDark ? '#94a3b8' : '#64748b'} tick={{fill: isDark ? '#94a3b8' : '#64748b'}} axisLine={false} tickLine={false} />
              <YAxis yAxisId="left" stroke="#6366f1" tick={{fill: '#6366f1'}} domain={[0, 100]} axisLine={false} tickLine={false} />
              <YAxis yAxisId="right" orientation="right" stroke="#f43f5e" tick={{fill: '#f43f5e'}} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={tooltipStyle} />
              <Legend verticalAlign="top" height={36} wrapperStyle={{ paddingBottom: '20px' }} />
              <Line yAxisId="left" type="monotone" dataKey="deliveryRate" name="Delivery Rate (%)" stroke="#6366f1" strokeWidth={3} dot={{r: 4}} activeDot={{r: 6}} />
              <Line yAxisId="right" type="monotone" dataKey="complaints" name="Complaints" stroke="#f43f5e" strokeWidth={3} dot={{r: 4}} activeDot={{r: 6}} />
            </LineChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      <Recommendations vendor={displayVendor} />

      <UploadSection vendor={displayVendor} />
    </div>
  );
}
