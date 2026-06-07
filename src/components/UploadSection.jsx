import { useState } from 'react';
import { useUploadedData } from '../context/UploadedDataContext';

function computeScore(completed, failed) {
  return Math.round((completed / (completed + failed)) * 100);
}

function computeStatus(score) {
  return score > 80 ? 'good' : score >= 60 ? 'average' : 'poor';
}

function parseCSV(text) {
  const lines = text.trim().split('\n');
  if (lines.length < 2) {
    throw new Error('CSV must contain a header row and at least one data row.');
  }

  const headers = lines[0].split(',').map(h => h.trim().toLowerCase());
  const required = ['date', 'completedorders', 'failedorders', 'complaints'];
  const missing = required.filter(col => !headers.includes(col));
  if (missing.length > 0) {
    throw new Error(`Missing required column(s): ${missing.join(', ')}`);
  }

  const data = [];
  for (let i = 1; i < lines.length; i++) {
    const values = lines[i].split(',').map(v => v.trim());
    if (values.length < 4) continue;

    const completedIdx = headers.indexOf('completedorders');
    const failedIdx = headers.indexOf('failedorders');
    const complaintsIdx = headers.indexOf('complaints');

    const completed = parseInt(values[completedIdx], 10);
    const failed = parseInt(values[failedIdx], 10);
    const complaints = parseInt(values[complaintsIdx], 10);

    if (isNaN(completed) || isNaN(failed) || isNaN(complaints)) continue;

    data.push({ completedOrders: completed, failedOrders: failed, complaints });
  }

  if (data.length === 0) {
    throw new Error('No valid data rows found. Check that numbers are integers.');
  }

  return data;
}

export default function UploadSection({ vendor }) {
  const { getUploadForVendor, setUploadForVendor, clearUploadForVendor } = useUploadedData();
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const uploaded = getUploadForVendor(vendor.id);

  const handleUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setError('');
    setSuccess('');
    setUploading(true);

    try {
      const text = await file.text();
      const parsed = parseCSV(text);

      const totalCompleted = parsed.reduce((sum, r) => sum + r.completedOrders, 0);
      const totalFailed = parsed.reduce((sum, r) => sum + r.failedOrders, 0);
      const totalComplaints = parsed.reduce((sum, r) => sum + r.complaints, 0);
      const totalOrders = totalCompleted + totalFailed;
      const newScore = computeScore(totalCompleted, totalFailed);
      const newStatus = computeStatus(newScore);

      setUploadForVendor(vendor.id, {
        completedOrders: totalCompleted,
        failedOrders: totalFailed,
        totalOrders,
        totalComplaints,
        reliabilityScore: newScore,
        status: newStatus,
        originalScore: vendor.reliabilityScore
      });

      setSuccess('Upload successful! Data updated.');
    } catch (err) {
      setError(err.message || 'Failed to parse CSV. Please check the format.');
    } finally {
      setUploading(false);
      e.target.value = '';
    }
  };

  const handleClear = () => {
    clearUploadForVendor(vendor.id);
    setSuccess('');
    setError('');
  };

  return (
    <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-6 shadow-sm">
      <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
        <svg className="w-5 h-5 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
        </svg>
        Vendor Data Upload
      </h3>

      <div className="space-y-4">
        <div className="bg-slate-50 dark:bg-slate-900/30 rounded-lg p-4 border border-dashed border-slate-300 dark:border-slate-600">
          <label className="flex flex-col items-center gap-3 cursor-pointer">
            <svg className="w-8 h-8 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
            </svg>
            <span className="text-sm text-slate-600 dark:text-slate-300 font-medium">
              {uploading ? 'Processing...' : 'Upload Vendor Data (.csv)'}
            </span>
            <span className="text-xs text-slate-400">Accepts .csv files only</span>
            <input type="file" accept=".csv" onChange={handleUpload} disabled={uploading} className="hidden" />
          </label>
        </div>

        <div className="text-xs text-slate-400 space-y-1 bg-slate-50 dark:bg-slate-900/30 rounded-lg p-3">
          <p className="font-medium text-slate-500 dark:text-slate-400">Expected CSV format:</p>
          <code className="block text-slate-600 dark:text-slate-300 font-mono leading-relaxed">
            date,completedOrders,failedOrders,complaints<br />
            2026-06-01,25,2,1<br />
            2026-06-02,30,1,0
          </code>
        </div>

        {error && (
          <div className="bg-rose-50 dark:bg-rose-900/20 border border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-300 rounded-lg px-4 py-3 text-sm">
            {error}
          </div>
        )}

        {uploaded && (
          <div className="bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800 rounded-lg p-4 space-y-2">
            <div className="flex items-center gap-2 text-emerald-700 dark:text-emerald-300 font-medium text-sm">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              {success || 'Upload Successful \u2014 Data Updated'}
            </div>
            <div className="grid grid-cols-2 gap-3 text-sm pt-1">
              <div>
                <span className="text-slate-500 dark:text-slate-400">Previous Reliability:</span>
                <span className="ml-2 font-bold text-slate-700 dark:text-slate-200">{uploaded.originalScore}%</span>
              </div>
              <div>
                <span className="text-slate-500 dark:text-slate-400">Updated Reliability:</span>
                <span className="ml-2 font-bold text-indigo-600 dark:text-indigo-400">{uploaded.reliabilityScore}%</span>
              </div>
              <div>
                <span className="text-slate-500 dark:text-slate-400">Total Orders:</span>
                <span className="ml-2 font-semibold text-slate-700 dark:text-slate-200">{uploaded.totalOrders}</span>
              </div>
              <div>
                <span className="text-slate-500 dark:text-slate-400">Complaints:</span>
                <span className="ml-2 font-semibold text-slate-700 dark:text-slate-200">{uploaded.totalComplaints}</span>
              </div>
            </div>
            <button
              onClick={handleClear}
              className="text-xs text-rose-600 dark:text-rose-400 hover:underline mt-2"
            >
              Clear Uploaded Data
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
