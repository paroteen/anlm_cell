import React, { useEffect, useState } from 'react';
import { User, Role, Announcement, AttendanceRecord } from '../types';
import { MockService } from '../services/mockData';
import { 
  Users, 
  TrendingUp, 
  AlertTriangle,
  ArrowRight,
  CalendarCheck,
  Check,
  Megaphone,
  Plus,
  X,
  Trophy,
  Network,
  Phone,
  MapPin,
  Clock
} from 'lucide-react';
import { 
  AreaChart,
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer
} from 'recharts';

interface Props {
  user: User;
  onNavigate: (page: string) => void;
}

export const Dashboard: React.FC<Props> = ({ user, onNavigate }) => {
  const [stats, setStats] = useState<any>({
    totalMembers: 0,
    attendanceRate: 0,
    followUps: 0,
    totalCells: 0,
    bestCell: 'Loading...'
  });
  const [chartData, setChartData] = useState<any[]>([]);
  const [followUpList, setFollowUpList] = useState<any[]>([]);
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState(true);

  // States for interactive modals
  const [showAnnounceModal, setShowAnnounceModal] = useState(false);
  const [selectedFollowUp, setSelectedFollowUp] = useState<any | null>(null);
  const [followUpHistory, setFollowUpHistory] = useState<AttendanceRecord[]>([]);

  const [newAnnouncement, setNewAnnouncement] = useState({
    title: '',
    content: '',
    priority: 'NORMAL' as 'HIGH' | 'NORMAL'
  });

  useEffect(() => {
    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  const loadData = async () => {
    setLoading(true);
    
    const [members, followUps, weeklyStats, announceData, cells, reports] = await Promise.all([
      MockService.getMembers(user.role === Role.LEADER ? user.cellId : undefined),
      MockService.getFollowUps(user),
      MockService.getWeeklyStats(),
      MockService.getAnnouncements(),
      MockService.getCells(),
      MockService.getCellReports()
    ]);

    const best = reports.sort((a,b) => b.avgAttendance - a.avgAttendance)[0];

    setStats({
      totalMembers: members.length,
      attendanceRate: 88, // Mocked
      followUps: followUps.length,
      totalCells: cells.length,
      bestCell: best ? best.cellName : 'N/A'
    });

    setFollowUpList(followUps.slice(0, 5)); // Top 5
    setChartData(weeklyStats);
    setAnnouncements(announceData);
    setLoading(false);
  };

  const handlePostAnnouncement = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAnnouncement.title || !newAnnouncement.content) return;
    
    await MockService.addAnnouncement({
        ...newAnnouncement,
        date: new Date().toISOString().split('T')[0],
        author: user.name
    });
    
    setShowAnnounceModal(false);
    setNewAnnouncement({ title: '', content: '', priority: 'NORMAL' });
    loadData();
  };

  const handleFollowUpClick = async (item: any) => {
    // Fetch detailed history
    const history = await MockService.getMemberHistory(item.id);
    setFollowUpHistory(history);
    setSelectedFollowUp(item);
  };

  const StatCard = ({ icon: Icon, label, value, color, onClick, subtext }: any) => (
    <div 
      onClick={onClick}
      className={`bg-white p-6 rounded-xl shadow-sm border border-gray-200 cursor-pointer transition-transform hover:-translate-y-1`}
    >
      <div className="flex items-center justify-between mb-4">
        <div className={`p-3 rounded-full ${color}`}>
          <Icon className="text-white" size={24} />
        </div>
        {subtext && <span className="text-gray-400 font-medium text-xs">{subtext}</span>}
      </div>
      <h3 className="text-2xl font-bold text-chocolate-900 truncate">{value}</h3>
      <p className="text-gray-500 font-medium mt-1 text-sm">{label}</p>
    </div>
  );

  if (loading) return <div className="p-8 text-center text-gray-500">Loading dashboard...</div>;

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-chocolate-900">
            Muraho, {user.name.split(' ')[0]}
          </h1>
          <p className="text-gray-500">
            Here's what's happening in {user.role === Role.ADMIN ? 'NewLife Church' : 'your cell group'}.
          </p>
        </div>
        <div className="flex gap-3">
          {user.role === Role.LEADER && (
             <button 
              onClick={() => onNavigate('attendance')}
              className="flex items-center space-x-2 bg-primary-600 text-white px-5 py-2.5 rounded-lg font-semibold hover:bg-primary-700 transition-colors shadow-md"
            >
              <CalendarCheck size={18} />
              <span>Mark Attendance</span>
            </button>
          )}
           <button 
              onClick={() => onNavigate('members')}
              className="flex items-center space-x-2 bg-white text-chocolate-800 border border-gray-300 px-5 py-2.5 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
            >
              <Users size={18} />
              <span>View Members</span>
            </button>
        </div>
      </div>

      {/* Announcements Section */}
      <div className="bg-ache-100/50 border border-ache-400 rounded-xl p-6">
        <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-bold text-chocolate-900 flex items-center gap-2">
                <Megaphone className="text-primary-600" size={20} />
                Announcements & Updates
            </h2>
            {user.role === Role.ADMIN && (
                <button 
                    onClick={() => setShowAnnounceModal(true)}
                    className="text-sm bg-primary-600 text-white px-3 py-1.5 rounded-lg flex items-center gap-1 hover:bg-primary-700"
                >
                    <Plus size={14} /> Post New
                </button>
            )}
        </div>
        <div className="space-y-3">
            {announcements.length === 0 ? (
                <p className="text-gray-500 text-sm italic">No active announcements.</p>
            ) : (
                announcements.map(ann => (
                    <div key={ann.id} className={`p-4 rounded-lg border ${ann.priority === 'HIGH' ? 'bg-red-50 border-red-200' : 'bg-white border-gray-200'}`}>
                        <div className="flex justify-between items-start">
                            <h3 className={`font-bold ${ann.priority === 'HIGH' ? 'text-red-700' : 'text-chocolate-800'}`}>
                                {ann.title}
                            </h3>
                            <span className="text-xs text-gray-500">{ann.date}</span>
                        </div>
                        <p className="text-sm text-gray-700 mt-1">{ann.content}</p>
                    </div>
                ))
            )}
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {user.role === Role.ADMIN && (
          <StatCard 
            icon={Network} 
            label="Total Cells" 
            value={stats.totalCells} 
            color="bg-chocolate-800"
            onClick={() => onNavigate('cells')}
          />
        )}
        {user.role === Role.ADMIN && (
          <StatCard 
            icon={Trophy} 
            label="Top Performing Cell" 
            value={stats.bestCell} 
            color="bg-amber-500"
            onClick={() => onNavigate('reports')}
          />
        )}
        <StatCard 
          icon={TrendingUp} 
          label="Avg. Attendance" 
          value={`${stats.attendanceRate}%`} 
          color="bg-blue-500"
          subtext="Last 30 Days"
          onClick={() => onNavigate('reports')}
        />
        <StatCard 
          icon={AlertTriangle} 
          label="Needs Follow-up" 
          value={stats.followUps} 
          color="bg-red-500"
          onClick={() => {}}
        />
      </div>

      {/* Charts & Lists Split */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Attendance Chart */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-bold text-chocolate-900">Attendance Trends</h3>
            <button onClick={() => onNavigate('reports')} className="text-sm text-primary-600 hover:text-primary-700 font-medium">View Full Report</button>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="colorAtt" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#16a34a" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#16a34a" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} />
                <Tooltip 
                  contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}}
                />
                <Area type="monotone" dataKey="attendance" stroke="#16a34a" strokeWidth={3} fillOpacity={1} fill="url(#colorAtt)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Follow Up List */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-bold text-chocolate-900">Priority Follow-Ups</h3>
            <button className="text-sm text-primary-600 font-semibold hover:text-primary-700">View All</button>
          </div>
          
          <div className="space-y-4">
            {followUpList.length === 0 ? (
              <div className="text-center py-10 text-gray-400">
                <Check className="mx-auto mb-2 opacity-50" size={32} />
                <p>All members accounted for!</p>
              </div>
            ) : (
              followUpList.map((item, idx) => (
                <div 
                  key={idx} 
                  onClick={() => handleFollowUpClick(item)}
                  className="cursor-pointer flex items-center justify-between p-4 rounded-lg bg-gray-50 border border-gray-100 hover:border-ache-400 hover:shadow-sm transition-all"
                >
                  <div className="flex items-center space-x-4">
                    <div className="w-10 h-10 rounded-full bg-ache-100 flex items-center justify-center text-chocolate-900 font-bold text-sm">
                      {item.name.charAt(0)}
                    </div>
                    <div>
                      <p className="font-semibold text-chocolate-900">{item.name}</p>
                      <p className="text-xs text-gray-500">Missed {item.daysSince} days ago</p>
                    </div>
                  </div>
                  <button className="p-2 text-gray-400 hover:text-primary-600 transition-colors">
                    <ArrowRight size={20} />
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Follow-Up Details Modal */}
      {selectedFollowUp && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg overflow-hidden flex flex-col max-h-[90vh]">
            <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-ache-100">
               <div>
                  <h3 className="text-lg font-bold text-chocolate-900">{selectedFollowUp.name}</h3>
                  <p className="text-sm text-chocolate-800 opacity-80">Member Details & History</p>
               </div>
               <button onClick={() => setSelectedFollowUp(null)} className="text-chocolate-800 hover:bg-ache-200 p-1 rounded">
                  <X size={24} />
               </button>
            </div>
            
            <div className="p-6 overflow-y-auto">
              <div className="grid grid-cols-2 gap-4 mb-6">
                 <div className="flex items-start gap-2">
                    <Phone size={16} className="mt-1 text-primary-600"/>
                    <div>
                      <p className="text-xs text-gray-500 uppercase">Phone</p>
                      <p className="font-medium text-gray-800">{selectedFollowUp.phone || 'N/A'}</p>
                    </div>
                 </div>
                 <div className="flex items-start gap-2">
                    <MapPin size={16} className="mt-1 text-primary-600"/>
                    <div>
                      <p className="text-xs text-gray-500 uppercase">Address</p>
                      <p className="font-medium text-gray-800">{selectedFollowUp.address || 'N/A'}</p>
                    </div>
                 </div>
                 <div className="flex items-start gap-2">
                    <Network size={16} className="mt-1 text-primary-600"/>
                    <div>
                      <p className="text-xs text-gray-500 uppercase">Cell Group</p>
                      <p className="font-medium text-gray-800">{selectedFollowUp.cellName}</p>
                    </div>
                 </div>
                 <div className="flex items-start gap-2">
                    <Clock size={16} className="mt-1 text-primary-600"/>
                    <div>
                      <p className="text-xs text-gray-500 uppercase">Last Seen</p>
                      <p className="font-medium text-gray-800">{selectedFollowUp.lastAttended}</p>
                    </div>
                 </div>
              </div>

              <div className="border-t border-gray-100 pt-4">
                <h4 className="font-bold text-gray-700 mb-3">Recent Attendance</h4>
                <div className="space-y-2">
                  {followUpHistory.map((rec, i) => (
                    <div key={i} className="flex justify-between items-center text-sm p-2 rounded bg-gray-50">
                       <span className="text-gray-600">{rec.date}</span>
                       <span className={`px-2 py-0.5 rounded text-xs font-bold ${
                         rec.status === 'PRESENT' ? 'bg-green-100 text-green-700' :
                         rec.status === 'ABSENT' ? 'bg-red-100 text-red-700' :
                         'bg-amber-100 text-amber-700'
                       }`}>
                         {rec.status}
                       </span>
                    </div>
                  ))}
                  {followUpHistory.length === 0 && <p className="text-gray-400 text-sm">No recent records found.</p>}
                </div>
              </div>
            </div>

            <div className="p-4 border-t border-gray-100 bg-gray-50 flex justify-end">
               <a 
                 href={`tel:${selectedFollowUp.phone}`}
                 className="flex items-center gap-2 bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors"
               >
                 <Phone size={18} />
                 <span>Call Member</span>
               </a>
            </div>
          </div>
        </div>
      )}

      {/* Admin Announcement Modal */}
      {showAnnounceModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-primary-50">
              <h3 className="text-lg font-bold text-chocolate-900">Post Announcement</h3>
              <button onClick={() => setShowAnnounceModal(false)} className="text-gray-400 hover:text-gray-600">
                <X size={24} />
              </button>
            </div>
            <form onSubmit={handlePostAnnouncement} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                <input 
                  required
                  type="text" 
                  placeholder="e.g. Service Time Change"
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 outline-none"
                  value={newAnnouncement.title}
                  onChange={e => setNewAnnouncement({...newAnnouncement, title: e.target.value})}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Priority</label>
                <select 
                   className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 outline-none bg-white"
                   value={newAnnouncement.priority}
                   onChange={e => setNewAnnouncement({...newAnnouncement, priority: e.target.value as 'HIGH'|'NORMAL'})}
                >
                    <option value="NORMAL">Normal Information</option>
                    <option value="HIGH">High Priority (Red Alert)</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Content</label>
                <textarea 
                  required
                  rows={4}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 outline-none"
                  value={newAnnouncement.content}
                  onChange={e => setNewAnnouncement({...newAnnouncement, content: e.target.value})}
                />
              </div>

              <div className="pt-4 flex justify-end space-x-3">
                <button 
                  type="button" 
                  onClick={() => setShowAnnounceModal(false)}
                  className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="px-6 py-2 bg-primary-600 text-white font-semibold rounded-lg hover:bg-primary-700"
                >
                  Post Now
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};