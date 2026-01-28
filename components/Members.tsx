import React, { useEffect, useState } from 'react';
import { User, Member, MemberStatus, Role } from '../types';
import { MockService } from '../services/mockData';
import { Search, Plus, Filter, MoreVertical, MapPin, Phone } from 'lucide-react';

interface Props {
  user: User;
}

export const Members: React.FC<Props> = ({ user }) => {
  const [members, setMembers] = useState<Member[]>([]);
  const [filter, setFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [showAddModal, setShowAddModal] = useState(false);
  
  // New Member Form State
  const [newMember, setNewMember] = useState<Partial<Member>>({
    fullName: '',
    phone: '',
    gender: 'Male',
    ageRange: '25-35',
    address: '',
    cellId: user.cellId || '',
    status: MemberStatus.ACTIVE
  });

  useEffect(() => {
    const load = async () => {
      const data = await MockService.getMembers(user.role === Role.LEADER ? user.cellId : undefined);
      setMembers(data);
    };
    load();
  }, [user]);

  const filteredMembers = members.filter(m => {
    const matchesSearch = m.fullName.toLowerCase().includes(filter.toLowerCase()) || m.phone.includes(filter);
    const matchesStatus = statusFilter === 'ALL' || m.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleAddMember = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMember.fullName || !newMember.cellId) return;

    await MockService.addMember(newMember as Member); // Cast for mock simplicity
    
    // Reload
    const data = await MockService.getMembers(user.role === Role.LEADER ? user.cellId : undefined);
    setMembers(data);
    setShowAddModal(false);
    // Reset form
    setNewMember({
        fullName: '',
        phone: '',
        gender: 'Male',
        ageRange: '25-35',
        address: '',
        cellId: user.cellId || '',
        status: MemberStatus.ACTIVE
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <h1 className="text-2xl font-bold text-slate-800">Members Directory</h1>
        <button 
          onClick={() => setShowAddModal(true)}
          className="bg-primary-600 text-white px-5 py-2.5 rounded-lg font-semibold hover:bg-primary-700 transition-colors shadow-sm flex items-center space-x-2"
        >
          <Plus size={18} />
          <span>Add New Member</span>
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4">
        <div className="flex flex-col md:flex-row gap-4 mb-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-3 text-slate-400" size={20} />
            <input 
              type="text" 
              placeholder="Search by name or phone..." 
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none"
            />
          </div>
          <div className="flex items-center space-x-2">
            <Filter className="text-slate-400" size={20} />
            <select 
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none bg-white"
            >
              <option value="ALL">All Status</option>
              <option value={MemberStatus.ACTIVE}>Active</option>
              <option value={MemberStatus.INACTIVE}>Inactive</option>
              <option value={MemberStatus.MOVED}>Moved</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-50 text-slate-500 text-sm font-semibold uppercase tracking-wider border-b border-slate-200">
              <tr>
                <th className="px-6 py-4">Name</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Contact</th>
                <th className="px-6 py-4">Joined</th>
                <th className="px-6 py-4">Last Attendance</th>
                <th className="px-6 py-4"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredMembers.map((m) => (
                <tr key={m.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="font-semibold text-slate-800">{m.fullName}</div>
                    <div className="text-xs text-slate-500">{m.gender} • {m.ageRange}</div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                      m.status === MemberStatus.ACTIVE ? 'bg-green-100 text-green-700' :
                      m.status === MemberStatus.INACTIVE ? 'bg-slate-100 text-slate-500' :
                      'bg-amber-100 text-amber-700'
                    }`}>
                      {m.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-600">
                    <div className="flex items-center space-x-2 mb-1">
                      <Phone size={14} className="text-slate-400" />
                      <span>{m.phone}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <MapPin size={14} className="text-slate-400" />
                      <span className="truncate max-w-[150px]">{m.address}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-600">{m.joinedDate}</td>
                  <td className="px-6 py-4 text-sm text-slate-600">
                    {m.lastAttendedDate || <span className="text-slate-400 italic">Never</span>}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button className="text-slate-400 hover:text-primary-600">
                      <MoreVertical size={20} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filteredMembers.length === 0 && (
            <div className="p-8 text-center text-slate-500">
              No members found matching your criteria.
            </div>
          )}
        </div>
      </div>

      {/* Add Member Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center">
              <h3 className="text-lg font-bold text-slate-800">Register New Member</h3>
              <button onClick={() => setShowAddModal(false)} className="text-slate-400 hover:text-slate-600">
                <Filter className="rotate-45" size={24} /> {/* X icon hack using Filter rot 45 if no X available, but I imported X in Attendance, let's use text or just close */}
                 X
              </button>
            </div>
            <form onSubmit={handleAddMember} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Full Name</label>
                <input 
                  required
                  type="text" 
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 outline-none"
                  value={newMember.fullName}
                  onChange={e => setNewMember({...newMember, fullName: e.target.value})}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                 <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Phone</label>
                  <input 
                    required
                    type="tel" 
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 outline-none"
                    value={newMember.phone}
                    onChange={e => setNewMember({...newMember, phone: e.target.value})}
                  />
                </div>
                 <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Gender</label>
                  <select 
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 outline-none bg-white"
                    value={newMember.gender}
                    onChange={e => setNewMember({...newMember, gender: e.target.value as any})}
                  >
                    <option>Male</option>
                    <option>Female</option>
                  </select>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Address / Area</label>
                <input 
                  type="text" 
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 outline-none"
                  value={newMember.address}
                  onChange={e => setNewMember({...newMember, address: e.target.value})}
                />
              </div>

              <div className="pt-4 flex justify-end space-x-3">
                <button 
                  type="button" 
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="px-6 py-2 bg-primary-600 text-white font-semibold rounded-lg hover:bg-primary-700"
                >
                  Register Member
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};