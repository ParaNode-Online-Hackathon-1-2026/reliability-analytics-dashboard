import { useState, useEffect } from 'react';
import axiosClient from '../api/axiosClient';
import SummaryCard from '../components/SummaryCard';
import ChartCard from '../components/ChartCard';
import VendorTable from '../components/VendorTable';
import Insights from '../components/Insights';
import TopVendors from '../components/TopVendors';
import RegionAnalytics from '../components/RegionAnalytics';
import { useUploadedData } from '../context/UploadedDataContext';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, LineChart, Line, CartesianGrid } from 'recharts';

function SkeletonLoader() {
  return (
    <div className="space-y-8 animate-pulse">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[1, 2, 3, 4].map(i => <div key={i} className="bg-white dark:bg-slate-800 rounded-xl p-6 h-32 border border-slate-200 dark:border-slate-700"></div>)}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {[1, 2].map(i => <div key={i} className="bg-white dark:bg-slate-800 rounded-xl p-6 h-96 border border-slate-200 dark:border-slate-700"></div>)}
      </div>
      <div className="bg-white dark:bg-slate-800 rounded-xl h-96 border border-slate-200 dark:border-slate-700"></div>
    </div>
  );
}

export default function Dashboard() {
  const [summary, setSummary] = useState(null);
  const [vendors, setVendors] = useState([]);
  const [complaintsData, setComplaintsData] = useState([]);
  const [deliveryData, setDeliveryData] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const [searchQuery, setSearchQuery] = useState('');
  const [sortOption, setSortOption] = useState('');
  const { uploadData } = useUploadedData();

  const vendorsWithUploads = vendors.map(v => {
    const uploaded = uploadData[v.id];
    if (uploaded) {
      return { ...v, ...uploaded };
    }
    return v;
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [summaryRes, vendorsRes, complaintsRes, deliveriesRes] = await Promise.all([
          axiosClient.get('/summary'),
          axiosClient.get('/vendors'),
          axiosClient.get('/stats/complaints'),
          axiosClient.get('/stats/deliveries')
        ]);
        
        setSummary(summaryRes.data);
        setVendors(vendorsRes.data);
        setComplaintsData(complaintsRes.data);
        setDeliveryData(deliveriesRes.data);
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);

  useEffect(() => {
    const fetchFilteredVendors = async () => {
      try {
        let url = '/vendors';
        const params = new URLSearchParams();
        if (searchQuery) params.append('search', searchQuery);
        if (sortOption) params.append('sort', sortOption);
        if (params.toString()) { url += `?${params.toString()}`; }
        
        const res = await axiosClient.get(url);
        setVendors(res.data);
      } catch (error) {
        console.error("Error fetching filtered vendors:", error);
      }
    };
    
    if (!loading) {
      const timer = setTimeout(() => fetchFilteredVendors(), 300);
      return () => clearTimeout(timer);
    }
  }, [searchQuery, sortOption]);

  if (loading && !summary) return <SkeletonLoader />;

  // Use a hacky global check to see if dark mode is active for Recharts tooltip styling
  // In a real app we'd pass a context or hook, but this works for a quick hackathon
  const isDark = document.documentElement.classList.contains('dark');

  const tooltipStyle = {
    backgroundColor: isDark ? '#1e293b' : '#ffffff',
    borderColor: isDark ? '#334155' : '#e2e8f0',
    color: isDark ? '#f8fafc' : '#0f172a',
    borderRadius: '0.5rem',
    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)'
  };

  return (
    <div className="space-y-6 fade-in">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Overview</h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">Platform analytics and vendor performance metrics.</p>
        </div>
      </div>

      {/* Row 1: KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
        <SummaryCard 
          title="Total Vendors" 
          value={summary?.totalVendors || 0} 
          trend={{ value: '12% this month', positive: true }}
          icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>}
        />
        <SummaryCard 
          title="Avg Reliability" 
          value={`${summary?.avgReliabilityScore || 0}%`} 
          trend={{ value: '4% this week', positive: true }}
          icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>}
        />
        <SummaryCard 
          title="Top Performer" 
          value={summary?.topPerformer?.name || '-'} 
          highlight={true}
          icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" /></svg>}
        />
        <SummaryCard 
          title="Poor Performers" 
          value={vendorsWithUploads.filter(v => v.reliabilityScore < 60).length} 
          trend={{ value: 'Score < 60', positive: false }}
          icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>}
        />
        <SummaryCard 
          title="Total Complaints" 
          value={summary?.totalComplaints || 0} 
          trend={{ value: '2% from last week', positive: false }}
          icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>}
        />
      </div>

      {/* Row 2: Charts */}
      <div id="analytics" className="grid grid-cols-1 lg:grid-cols-2 gap-6 scroll-mt-24">
        <ChartCard title="Platform Delivery Rate Trend">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={deliveryData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke={isDark ? '#334155' : '#e2e8f0'} vertical={false} />
              <XAxis dataKey="day" stroke={isDark ? '#94a3b8' : '#64748b'} tick={{fill: isDark ? '#94a3b8' : '#64748b'}} axisLine={false} tickLine={false} />
              <YAxis stroke={isDark ? '#94a3b8' : '#64748b'} tick={{fill: isDark ? '#94a3b8' : '#64748b'}} domain={['auto', 'auto']} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={tooltipStyle} cursor={{ stroke: isDark ? '#475569' : '#cbd5e1', strokeWidth: 1 }} />
              <Line type="monotone" dataKey="deliveryRate" name="Delivery Rate %" stroke="#6366f1" strokeWidth={3} dot={{r: 4, strokeWidth: 2}} activeDot={{r: 6}} />
            </LineChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Complaints by Vendor">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={complaintsData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke={isDark ? '#334155' : '#e2e8f0'} vertical={false} />
              <XAxis dataKey="vendor" stroke={isDark ? '#94a3b8' : '#64748b'} tick={{fill: isDark ? '#94a3b8' : '#64748b'}} tickFormatter={(value) => value.length > 8 ? `${value.substring(0,8)}...` : value} axisLine={false} tickLine={false} />
              <YAxis stroke={isDark ? '#94a3b8' : '#64748b'} tick={{fill: isDark ? '#94a3b8' : '#64748b'}} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={tooltipStyle} cursor={{fill: isDark ? '#334155' : '#f1f5f9'}} />
              <Bar dataKey="complaints" name="Complaints" fill="#f43f5e" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      {/* Row 3: Insights, Rankings, and Regions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <TopVendors vendors={vendorsWithUploads} />
        </div>
        <div className="lg:col-span-1">
          <Insights vendors={vendorsWithUploads} />
        </div>
        <div className="lg:col-span-1">
          <RegionAnalytics vendors={vendorsWithUploads} />
        </div>
      </div>

      {/* Row 4: Raw Data Table */}
      <div id="vendors" className="scroll-mt-24"><VendorTable 
        vendors={vendorsWithUploads} 
        searchQuery={searchQuery}
        sortOption={sortOption}
        onSearch={setSearchQuery}
        onSort={setSortOption}
      /></div>
    </div>
  );
}
