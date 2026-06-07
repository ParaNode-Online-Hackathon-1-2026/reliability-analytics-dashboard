import { useMemo } from 'react';

function computeScore(v) {
  return Math.round((v.completedOrders / (v.completedOrders + v.failedOrders)) * 100);
}

export default function Recommendations({ vendor }) {
  const recommendations = useMemo(() => {
    if (!vendor) return [];

    const score = vendor.reliabilityScore ?? computeScore(vendor);
    const recs = [];

    if (vendor.totalComplaints > 10) {
      recs.push({
        title: 'Address High Complaint Volume',
        desc: `${vendor.name} has ${vendor.totalComplaints} complaints. Investigate root causes and implement corrective measures to improve reliability.`
      });
    }

    if (vendor.avgResponseTime > 4) {
      recs.push({
        title: 'Reduce Response Time',
        desc: `Currently averaging ${vendor.avgResponseTime}h response time. Target is under 2 hours to boost rating.`
      });
    }

    if (score < 60) {
      recs.push({
        title: 'Improve Delivery Reliability',
        desc: `Reliability score is ${score}%. Focus on reducing failed orders and optimizing logistics.`
      });
    }

    if (score >= 60 && score < 80) {
      recs.push({
        title: 'Strengthen Delivery Consistency',
        desc: `Score is ${score}% \u2014 close to Good tier. A small reduction in failed orders will push the status higher.`
      });
    }

    if (score > 85) {
      recs.push({
        title: 'Maintain High Standards',
        desc: `Excellent reliability at ${score}%. Continue monitoring to sustain performance.`
      });
    }

    if (recs.length === 0) {
      recs.push({
        title: 'No Action Needed',
        desc: 'Performance metrics are within healthy ranges. Keep up the good work.'
      });
    }

    return recs;
  }, [vendor]);

  if (!vendor) return null;

  return (
    <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-6 shadow-sm">
      <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-6 flex items-center gap-2">
        <svg className="w-5 h-5 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
        </svg>
        Actionable Recommendations
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {recommendations.map((rec, index) => (
          <div key={index} className="bg-slate-50 dark:bg-slate-900/50 rounded-lg p-5 border border-slate-100 dark:border-slate-700/50">
            <h4 className="font-semibold text-slate-900 dark:text-white mb-2">{rec.title}</h4>
            <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">{rec.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
