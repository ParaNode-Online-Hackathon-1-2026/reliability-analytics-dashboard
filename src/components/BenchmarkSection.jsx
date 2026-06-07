import { useState, useEffect, useMemo } from 'react';
import axiosClient from '../api/axiosClient';
import { useUploadedData } from '../context/UploadedDataContext';

export default function BenchmarkSection({ vendor }) {
  const [allVendors, setAllVendors] = useState([]);
  const [loading, setLoading] = useState(true);
  const { uploadData } = useUploadedData();

  useEffect(() => {
    let cancelled = false;
    const fetchAll = async () => {
      try {
        const res = await axiosClient.get('/vendors');
        if (!cancelled) setAllVendors(res.data);
      } catch (err) {
        console.error('Failed to load vendor data for benchmarks');
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    fetchAll();
    return () => { cancelled = true; };
  }, []);

  const benchmark = useMemo(() => {
    if (allVendors.length === 0 || !vendor) return null;

    const merged = allVendors.map(v => {
      const uploaded = uploadData[v.id];
      if (uploaded && uploaded.reliabilityScore !== undefined) {
        return { ...v, reliabilityScore: uploaded.reliabilityScore };
      }
      return v;
    });

    const sorted = [...merged].sort((a, b) => b.reliabilityScore - a.reliabilityScore);

    const rank = sorted.findIndex(v => v.id === vendor.id) + 1;
    const total = sorted.length;
    const avg = Math.round(sorted.reduce((sum, v) => sum + v.reliabilityScore, 0) / sorted.length);
    const topScore = sorted[0]?.reliabilityScore || 0;
    const diff = vendor.reliabilityScore - avg;
    const gapToTop = topScore - vendor.reliabilityScore;

    return { rank, total, avg, topScore, diff, gapToTop };
  }, [allVendors, vendor, uploadData]);

  const message = useMemo(() => {
    if (!benchmark) return '';
    const { rank, total, diff, gapToTop } = benchmark;
    if (rank <= 3) return 'You are among the top performing vendors.';
    if (diff > 0) return 'You are performing above the platform average.';
    if (rank > 5) return 'Focus on reducing failed orders to improve your ranking.';
    return 'You are currently below the platform average.';
  }, [benchmark]);

  if (loading) return null;

  if (!benchmark || allVendors.length === 0) return null;

  const barMin = 0;
  const barMax = 100;
  const barRange = barMax - barMin;

  return (
    <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-6 shadow-sm">
      <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-5 flex items-center gap-2">
        <svg className="w-5 h-5 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
        Performance Benchmark
      </h3>

      <div className="flex items-center gap-3 mb-6">
        <span className="text-sm font-medium text-slate-500 dark:text-slate-400">Your Rank</span>
        <span className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">#{benchmark.rank}</span>
        <span className="text-sm text-slate-400">of {benchmark.total} Vendors</span>
      </div>

      <div className="mb-6">
        <div className="flex items-center justify-between text-xs text-slate-400 mb-1.5">
          <span>0%</span>
          <span>100%</span>
        </div>
        <div className="relative h-2 bg-slate-100 dark:bg-slate-700 rounded-full">
          <div className="absolute inset-0 rounded-full" />
          <div
            className="absolute top-1/2 -translate-y-1/2 w-3 h-3 bg-slate-400 rounded-full border-2 border-white dark:border-slate-800 shadow-sm"
            style={{ left: `${((benchmark.avg - barMin) / barRange) * 100}%` }}
            title="Platform Average"
          />
          <div
            className="absolute top-1/2 -translate-y-1/2 w-4 h-4 bg-indigo-600 rounded-full border-2 border-white dark:border-slate-800 shadow-sm ring-2 ring-indigo-200 dark:ring-indigo-800"
            style={{ left: `${((vendor.reliabilityScore - barMin) / barRange) * 100}%` }}
            title="Your Score"
          />
          <div
            className="absolute top-1/2 -translate-y-1/2 w-3 h-3 bg-emerald-500 rounded-full border-2 border-white dark:border-slate-800 shadow-sm"
            style={{ left: `${((benchmark.topScore - barMin) / barRange) * 100}%` }}
            title="Top Performer"
          />
        </div>
        <div className="flex items-center justify-between text-xs mt-1.5">
          <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-slate-400 inline-block" /> Avg</span>
          <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-indigo-600 inline-block" /> You</span>
          <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-emerald-500 inline-block" /> Top</span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="bg-slate-50 dark:bg-slate-900/50 rounded-lg p-4 border border-slate-100 dark:border-slate-700/50">
          <div className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">Platform Average</div>
          <div className="text-xl font-bold text-slate-900 dark:text-white">{benchmark.avg}%</div>
        </div>
        <div className="bg-slate-50 dark:bg-slate-900/50 rounded-lg p-4 border border-slate-100 dark:border-slate-700/50">
          <div className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">Top Reliability</div>
          <div className="text-xl font-bold text-emerald-600 dark:text-emerald-400">{benchmark.topScore}%</div>
        </div>
      </div>

      <div className="space-y-2 text-sm">
        <div className={`font-medium ${benchmark.diff >= 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'}`}>
          {benchmark.diff >= 0 ? '+' : ''}{benchmark.diff}% {benchmark.diff >= 0 ? 'Above' : 'Below'} Average
        </div>
        {benchmark.gapToTop > 0 && (
          <div className="text-slate-500 dark:text-slate-400">
            Need +{benchmark.gapToTop}% reliability to reach Top Performer
          </div>
        )}
      </div>

      <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-700/50 flex items-start gap-2">
        <svg className="w-4 h-4 mt-0.5 flex-shrink-0 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <p className="text-sm text-slate-600 dark:text-slate-300">{message}</p>
      </div>
    </div>
  );
}
