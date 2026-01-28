import React, { useEffect, useState } from 'react';
import { CellReport } from '../types';
import { MockService } from '../services/mockData';
import { Download, TrendingUp, AlertCircle, CheckCircle } from 'lucide-react';

export const Reports: React.FC = () => {
  const [reports, setReports] = useState<CellReport[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
        const data = await MockService.getCellReports();
        setReports(data.sort((a,b) => b.avgAttendance - a.avgAttendance)); // Sort best to worst
        setLoading(false);
    };
    load();
  }, []);

  if (loading) return <div className="p-8 text-center text-slate-500">Generating analytics...</div>;

  return (
    <div className="space-y-6">
       <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Cell Performance Reports</h1>
          <p className="text-slate-500">Weekly breakdown of attendance and health metrics.</p>
        </div>
        <button className="flex items-center gap-2 bg-white border border-slate-300 text-slate-700 px-4 py-2 rounded-lg font-medium hover:bg-slate-50">
            <Download size={18} /> Export PDF
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
         <table className="w-full text-left">
            <thead className="bg-slate-50 border-b border-slate-200 text-sm uppercase text-slate-500 font-semibold">
                <tr>
                    <th className="px-6 py-4">Cell Name</th>
                    <th className="px-6 py-4">Leader</th>
                    <th className="px-6 py-4 text-center">Members</th>
                    <th className="px-6 py-4 text-center">Avg. Attendance</th>
                    <th className="px-6 py-4">Status</th>
                    <th className="px-6 py-4 text-right">Actions</th>
                </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
                {reports.map((report) => (
                    <tr key={report.cellId} className="hover:bg-slate-50 transition-colors">
                        <td className="px-6 py-4 font-semibold text-slate-800">{report.cellName}</td>
                        <td className="px-6 py-4 text-slate-600">{report.leaderName}</td>
                        <td className="px-6 py-4 text-center text-slate-600 font-mono">{report.memberCount}</td>
                        <td className="px-6 py-4 text-center">
                            <span className={`font-bold ${report.avgAttendance > 80 ? 'text-green-600' : report.avgAttendance > 60 ? 'text-amber-600' : 'text-red-600'}`}>
                                {report.avgAttendance}%
                            </span>
                        </td>
                        <td className="px-6 py-4">
                            {report.status === 'HEALTHY' ? (
                                <span className="inline-flex items-center gap-1 text-xs font-bold bg-green-100 text-green-700 px-2 py-1 rounded-full">
                                    <CheckCircle size={12} /> Healthy
                                </span>
                            ) : (
                                <span className="inline-flex items-center gap-1 text-xs font-bold bg-red-100 text-red-700 px-2 py-1 rounded-full">
                                    <AlertCircle size={12} /> Needs Attention
                                </span>
                            )}
                        </td>
                        <td className="px-6 py-4 text-right">
                            <button className="text-primary-600 hover:underline text-sm font-medium">View History</button>
                        </td>
                    </tr>
                ))}
            </tbody>
         </table>
      </div>
    </div>
  );
};