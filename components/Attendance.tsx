import React, { useEffect, useState } from 'react';
import { User, Member, AttendanceRecord, AttendanceStatus, Role, SessionSummary, CellAttendanceOverview } from '../types';
import { MockService } from '../services/mockData';
import { Check, X, Clock, Save, Calendar, AlertCircle, Filter, ArrowLeft, ChevronRight, Plus, History } from 'lucide-react';

interface Props {
  user: User;
}

type ViewMode = 'OVERVIEW' | 'LOG' | 'DETAILS';

export const Attendance: React.FC<Props> = ({ user }) => {
  const isAdmin = user.role === Role.ADMIN;
  
  // Navigation State
  const [view, setView] = useState<ViewMode>(isAdmin ? 'OVERVIEW' : 'LOG');
  const [selectedCellId, setSelectedCellId] = useState<string>(user.cellId || '');
  const [selectedCellName, setSelectedCellName] = useState<string>('');
  
  // Data State
  const [overviewData, setOverviewData] = useState<CellAttendanceOverview[]>([]);
  const [sessionLog, setSessionLog] = useState<SessionSummary[]>([]);
  
  // Detail View State
  const [date, setDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [members, setMembers] = useState<Member[]>([]);
  const [records, setRecords] = useState<AttendanceRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');

  // Load Initial Data based on Role
  useEffect(() => {
    const init = async () => {
      setLoading(true);
      if (isAdmin && view === 'OVERVIEW') {
        const data = await MockService.getAttendanceOverview();
        setOverviewData(data);
      } else if (selectedCellId && view === 'LOG') {
        const data = await MockService.getSessionLog(selectedCellId);
        setSessionLog(data);
      }
      setLoading(false);
    };
    init();
  }, [isAdmin, view, selectedCellId]);

  // Load Detail View Data
  useEffect(() => {
    if (view !== 'DETAILS' || !selectedCellId) return;

    const fetchData = async () => {
      setLoading(true);
      const [mems, atts] = await Promise.all([
        MockService.getMembers(selectedCellId),
        MockService.getAttendance(selectedCellId, date)
      ]);
      setMembers(mems);
      
      const currentRecords: AttendanceRecord[] = mems.map(m => {
        const existing = atts.find(a => a.memberId === m.id);
        if (existing) return existing;
        
        return {
          id: `temp-${m.id}`,
          date,
          cellId: selectedCellId,
          memberId: m.id,
          status: AttendanceStatus.ABSENT, 
          notes: ''
        };
      });
      
      setRecords(currentRecords);
      setLoading(false);
    };
    fetchData();
  }, [view, selectedCellId, date]);

  // --- Handlers ---

  const handleCellClick = (cellId: string, cellName: string) => {
    setSelectedCellId(cellId);
    setSelectedCellName(cellName);
    setView('LOG');
  };

  const handleSessionClick = (sessionDate: string) => {
    setDate(sessionDate);
    setView('DETAILS');
  };

  const handleCreateNewSession = () => {
    setDate(new Date().toISOString().split('T')[0]);
    setView('DETAILS');
  };

  const updateStatus = (memberId: string, status: AttendanceStatus) => {
    if (isAdmin) return; 
    setRecords(prev => prev.map(r => r.memberId === memberId ? { ...r, status } : r));
  };

  const updateNotes = (memberId: string, notes: string) => {
    if (isAdmin) return;
    setRecords(prev => prev.map(r => r.memberId === memberId ? { ...r, notes } : r));
  };

  const handleSave = async () => {
    setSaving(true);
    const toSave = records.map(r => ({
      ...r,
      id: r.id.startsWith('temp') ? Math.random().toString(36).substr(2, 9) : r.id
    }));
    await MockService.saveAttendance(toSave);
    setSaving(false);
    setSuccessMsg('Attendance report updated successfully!');
    setTimeout(() => {
        setSuccessMsg('');
        // Return to log after save if leader
        if (!isAdmin) setView('LOG');
    }, 1500);
  };

  const getDayName = (d: string) => {
    const dateObj = new Date(d);
    return dateObj.toLocaleDateString('en-US', { weekday: 'long' });
  };

  const formatDate = (d: string) => {
      return new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  // --- Render Views ---

  // VIEW 1: ADMIN OVERVIEW
  if (view === 'OVERVIEW' && isAdmin) {
    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold text-chocolate-900">Attendance Overview</h1>
                <p className="text-slate-500">Summary of latest meeting stats per cell.</p>
            </div>
            
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                <table className="w-full text-left">
                    <thead className="bg-slate-50 border-b border-slate-200 text-sm uppercase text-slate-500 font-semibold">
                        <tr>
                            <th className="px-6 py-4">Cell Name</th>
                            <th className="px-6 py-4">Leader</th>
                            <th className="px-6 py-4 text-center">Total Members</th>
                            <th className="px-6 py-4">Last Meeting</th>
                            <th className="px-6 py-4 text-center">Present</th>
                            <th className="px-6 py-4 text-center">Absent</th>
                            <th className="px-6 py-4"></th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {loading ? (
                            <tr><td colSpan={7} className="p-8 text-center text-slate-400">Loading data...</td></tr>
                        ) : overviewData.map(item => (
                            <tr 
                                key={item.cellId} 
                                onClick={() => handleCellClick(item.cellId, item.cellName)}
                                className="hover:bg-slate-50 cursor-pointer transition-colors"
                            >
                                <td className="px-6 py-4 font-semibold text-slate-800">{item.cellName}</td>
                                <td className="px-6 py-4 text-slate-600 text-sm">{item.leaderName}</td>
                                <td className="px-6 py-4 text-center font-mono text-slate-700">{item.totalMembers}</td>
                                <td className="px-6 py-4 text-sm text-slate-500">
                                    {item.lastSessionDate ? formatDate(item.lastSessionDate) : 'No Records'}
                                </td>
                                <td className="px-6 py-4 text-center">
                                    <span className="inline-block bg-green-100 text-green-700 text-xs px-2 py-1 rounded-full font-bold">
                                        {item.lastSessionPresent}
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-center">
                                    <span className="inline-block bg-red-100 text-red-700 text-xs px-2 py-1 rounded-full font-bold">
                                        {item.lastSessionAbsent}
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-right text-slate-400">
                                    <ChevronRight size={20} />
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
  }

  // VIEW 2: SESSION LOG
  if (view === 'LOG') {
      return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <div className="flex items-center space-x-2 text-slate-500 text-sm mb-1">
                        {isAdmin && (
                            <button onClick={() => setView('OVERVIEW')} className="hover:underline flex items-center">
                                <ArrowLeft size={14} className="mr-1"/> Back to Overview
                            </button>
                        )}
                        {isAdmin && <span>/</span>}
                        <span className="font-semibold text-primary-600">{isAdmin ? selectedCellName : 'My Cell Group'}</span>
                    </div>
                    <h1 className="text-2xl font-bold text-chocolate-900">Attendance Log</h1>
                    <p className="text-slate-500">History of previous sessions and reports.</p>
                </div>
                {!isAdmin && (
                    <button 
                        onClick={handleCreateNewSession}
                        className="bg-primary-600 text-white px-4 py-2 rounded-lg font-bold flex items-center space-x-2 hover:bg-primary-700 shadow-sm"
                    >
                        <Plus size={18} />
                        <span>Mark New Attendance</span>
                    </button>
                )}
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                <table className="w-full text-left">
                    <thead className="bg-slate-50 border-b border-slate-200 text-sm uppercase text-slate-500 font-semibold">
                        <tr>
                            <th className="px-6 py-4">Meeting Date</th>
                            <th className="px-6 py-4 text-center">Present</th>
                            <th className="px-6 py-4 text-center">Absent</th>
                            <th className="px-6 py-4 text-center">Excused</th>
                            <th className="px-6 py-4 text-center">Total Reported</th>
                            <th className="px-6 py-4"></th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {loading ? (
                             <tr><td colSpan={6} className="p-8 text-center text-slate-400">Loading history...</td></tr>
                        ) : sessionLog.length === 0 ? (
                            <tr><td colSpan={6} className="p-12 text-center text-slate-400 flex flex-col items-center">
                                <History size={48} className="mb-2 opacity-20"/>
                                <p>No attendance history found.</p>
                                {!isAdmin && <button onClick={handleCreateNewSession} className="text-primary-600 mt-2 hover:underline">Start your first report</button>}
                            </td></tr>
                        ) : (
                            sessionLog.map((session, idx) => (
                                <tr 
                                    key={idx} 
                                    onClick={() => handleSessionClick(session.date)}
                                    className="hover:bg-slate-50 cursor-pointer transition-colors"
                                >
                                    <td className="px-6 py-4 font-medium text-slate-800 flex items-center space-x-2">
                                        <Calendar size={16} className="text-slate-400"/>
                                        <span>{formatDate(session.date)}</span>
                                        <span className="text-xs text-slate-400 font-normal">({getDayName(session.date)})</span>
                                    </td>
                                    <td className="px-6 py-4 text-center">
                                        <span className="text-green-600 font-bold bg-green-50 px-2 py-0.5 rounded">{session.present}</span>
                                    </td>
                                    <td className="px-6 py-4 text-center">
                                        <span className="text-red-600 font-bold bg-red-50 px-2 py-0.5 rounded">{session.absent}</span>
                                    </td>
                                    <td className="px-6 py-4 text-center text-amber-600 font-medium">
                                        {session.excused}
                                    </td>
                                    <td className="px-6 py-4 text-center text-slate-600">
                                        {session.total}
                                    </td>
                                    <td className="px-6 py-4 text-right text-primary-600 text-sm font-medium">
                                        {isAdmin ? 'View' : 'Edit'}
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

  // VIEW 3: DETAILS (The Register)
  const isWednesday = getDayName(date) === 'Wednesday';
  const filteredRecords = records.filter(r => statusFilter === 'ALL' || r.status === statusFilter);

  return (
    <div className="space-y-6">
       <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <button onClick={() => setView('LOG')} className="flex items-center space-x-1 text-slate-500 hover:text-slate-800 mb-2 text-sm font-medium">
            <ArrowLeft size={16} /> <span>Back to Log</span>
          </button>
          <h1 className="text-2xl font-bold text-chocolate-900">
            {isAdmin ? 'Review Attendance' : 'Mark Attendance'}
          </h1>
          <p className="text-slate-500 flex items-center gap-2">
             <Calendar size={14}/> {formatDate(date)} ({getDayName(date)})
          </p>
        </div>
        {!isAdmin && (
             <div className="flex items-center bg-slate-100 rounded-lg p-1">
                 <input 
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="bg-transparent border-none text-sm px-2 outline-none text-slate-700"
                 />
                 <span className="text-xs text-slate-400 px-2 border-l border-slate-200">Change Date</span>
             </div>
        )}
      </div>

      {!isWednesday && !isAdmin && (
        <div className="bg-amber-50 border border-amber-200 text-amber-800 px-4 py-3 rounded-lg flex items-start gap-3">
          <AlertCircle className="shrink-0 mt-0.5" size={20} />
          <div>
            <p className="font-semibold">Note: The selected date is a {getDayName(date)}.</p>
            <p className="text-sm opacity-90">Please confirm you are recording for the correct meeting date.</p>
          </div>
        </div>
      )}

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        {/* Filter Bar */}
        <div className="px-6 py-3 border-b border-slate-100 flex items-center gap-2 bg-slate-50">
            <Filter size={16} className="text-slate-400" />
            <span className="text-sm font-medium text-slate-600 mr-2">Filter Status:</span>
            <div className="flex space-x-1">
                {['ALL', 'PRESENT', 'ABSENT', 'EXCUSED'].map(status => (
                    <button
                        key={status}
                        onClick={() => setStatusFilter(status)}
                        className={`px-3 py-1 rounded-full text-xs font-bold transition-colors ${
                            statusFilter === status 
                                ? 'bg-primary-600 text-white shadow-sm' 
                                : 'bg-white border border-slate-200 text-slate-500 hover:bg-slate-100'
                        }`}
                    >
                        {status.charAt(0) + status.slice(1).toLowerCase()}
                    </button>
                ))}
            </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="px-6 py-4 font-semibold text-slate-700">Member Name</th>
                <th className="px-6 py-4 font-semibold text-slate-700">Status</th>
                <th className="px-6 py-4 font-semibold text-slate-700">Notes / Reason</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                   <tr><td colSpan={3} className="p-8 text-center text-slate-400">Loading register...</td></tr>
              ) : filteredRecords.map(record => {
                const status = record.status;
                const notes = record.notes || '';
                const member = members.find(m => m.id === record.memberId);

                return (
                  <tr key={record.memberId} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="font-medium text-slate-900">{member?.fullName || 'Unknown'}</div>
                      <div className="text-xs text-slate-500">{member?.phone}</div>
                    </td>
                    <td className="px-6 py-4">
                      {isAdmin ? (
                        <span className={`inline-flex items-center space-x-1 px-3 py-1 rounded-full text-xs font-bold ${
                            status === AttendanceStatus.PRESENT ? 'bg-green-100 text-green-700' :
                            status === AttendanceStatus.ABSENT ? 'bg-red-100 text-red-700' :
                            'bg-amber-100 text-amber-700'
                        }`}>
                            {status === AttendanceStatus.PRESENT && <Check size={12} />}
                            {status === AttendanceStatus.ABSENT && <X size={12} />}
                            {status === AttendanceStatus.EXCUSED && <Clock size={12} />}
                            <span>{status}</span>
                        </span>
                      ) : (
                        <div className="flex items-center space-x-2">
                            <button
                            onClick={() => updateStatus(record.memberId, AttendanceStatus.PRESENT)}
                            className={`p-2 rounded-lg border transition-all ${
                                status === AttendanceStatus.PRESENT 
                                ? 'bg-green-500 text-white border-green-600 shadow-sm' 
                                : 'bg-white border-slate-200 text-slate-400 hover:border-green-300 hover:text-green-500'
                            }`}
                            title="Present"
                            >
                            <Check size={16} />
                            </button>
                            
                            <button
                            onClick={() => updateStatus(record.memberId, AttendanceStatus.ABSENT)}
                            className={`p-2 rounded-lg border transition-all ${
                                status === AttendanceStatus.ABSENT 
                                ? 'bg-red-500 text-white border-red-600 shadow-sm' 
                                : 'bg-white border-slate-200 text-slate-400 hover:border-red-300 hover:text-red-500'
                            }`}
                            title="Absent"
                            >
                            <X size={16} />
                            </button>

                            <button
                            onClick={() => updateStatus(record.memberId, AttendanceStatus.EXCUSED)}
                            className={`p-2 rounded-lg border transition-all ${
                                status === AttendanceStatus.EXCUSED 
                                ? 'bg-amber-500 text-white border-amber-600 shadow-sm' 
                                : 'bg-white border-slate-200 text-slate-400 hover:border-amber-300 hover:text-amber-500'
                            }`}
                            title="Excused"
                            >
                            <Clock size={16} />
                            </button>
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      {isAdmin ? (
                          <span className="text-slate-600 italic">{notes || '-'}</span>
                      ) : (
                        <input
                            type="text"
                            placeholder={status !== AttendanceStatus.PRESENT ? "Reason..." : "Notes..."}
                            value={notes}
                            onChange={(e) => updateNotes(record.memberId, e.target.value)}
                            className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:border-primary-400 focus:ring-2 focus:ring-primary-100 outline-none transition-all"
                        />
                      )}
                    </td>
                  </tr>
                );
              })}
              {!loading && filteredRecords.length === 0 && (
                  <tr>
                      <td colSpan={3} className="px-6 py-8 text-center text-slate-400">
                          No records found matching filter.
                      </td>
                  </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {!isAdmin && (
        <div className="flex items-center justify-end space-x-4">
            {successMsg && <span className="text-green-600 font-medium animate-pulse">{successMsg}</span>}
            <button
            onClick={handleSave}
            disabled={saving}
            className="flex items-center space-x-2 bg-primary-600 hover:bg-primary-700 text-white px-6 py-3 rounded-lg font-semibold shadow-md transition-all disabled:opacity-50"
            >
            {saving ? (
                <>Saving...</>
            ) : (
                <>
                <Save size={20} />
                <span>Submit Report</span>
                </>
            )}
            </button>
        </div>
      )}
    </div>
  );
};