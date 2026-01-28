import React, { useEffect, useState } from 'react';
import { Cell, User, Member, Role } from '../types';
import { MockService } from '../services/mockData';
import { MapPin, Calendar, Users, ChevronRight, UserCircle, Edit2, X, Plus } from 'lucide-react';

export const CellManagement: React.FC = () => {
  const [cells, setCells] = useState<Cell[]>([]);
  const [leaders, setLeaders] = useState<User[]>([]);
  const [selectedCell, setSelectedCell] = useState<Cell | null>(null);
  const [cellMembers, setCellMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Edit State
  const [isEditingLeader, setIsEditingLeader] = useState(false);
  const [newLeaderId, setNewLeaderId] = useState('');

  // Add Cell State
  const [showAddCellModal, setShowAddCellModal] = useState(false);
  const [newCellData, setNewCellData] = useState({
      name: '',
      location: '',
      meetingDay: 'Wednesday',
      leaderId: ''
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    const [fetchedCells, fetchedLeaders] = await Promise.all([
      MockService.getCells(),
      MockService.getLeaders()
    ]);
    setCells(fetchedCells);
    setLeaders(fetchedLeaders);
    setLoading(false);
  };

  const handleViewDetails = async (cell: Cell) => {
    setSelectedCell(cell);
    const members = await MockService.getMembers(cell.id);
    setCellMembers(members);
    setNewLeaderId(cell.leaderId);
    setIsEditingLeader(false);
  };

  const handleSaveLeader = async () => {
    if (!selectedCell) return;
    await MockService.updateCellLeader(selectedCell.id, newLeaderId);
    await loadData(); 
    
    const updatedLeader = leaders.find(l => l.id === newLeaderId);
    setSelectedCell({
        ...selectedCell,
        leaderId: newLeaderId,
        leaderName: updatedLeader ? updatedLeader.name : 'Unknown'
    });
    setIsEditingLeader(false);
  };

  const handleCreateCell = async (e: React.FormEvent) => {
      e.preventDefault();
      await MockService.addCell({
          name: newCellData.name,
          location: newCellData.location,
          meetingDay: newCellData.meetingDay,
          leaderId: newCellData.leaderId
      });
      await loadData();
      setShowAddCellModal(false);
      setNewCellData({ name: '', location: '', meetingDay: 'Wednesday', leaderId: '' });
  };

  if (loading) return <div className="p-8 text-center text-slate-500">Loading cells network...</div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Cell Network Management</h1>
          <p className="text-slate-500">Overview of all church cells, leaders, and locations.</p>
        </div>
        <div className="flex items-center gap-4">
            <div className="text-sm bg-blue-50 text-blue-700 px-4 py-2 rounded-lg border border-blue-100 font-medium">
                Total Cells: {cells.length}
            </div>
            <button 
                onClick={() => setShowAddCellModal(true)}
                className="flex items-center gap-2 bg-primary-600 text-white px-4 py-2 rounded-lg font-bold hover:bg-primary-700 shadow-sm"
            >
                <Plus size={18} /> Add Cell
            </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {cells.map(cell => (
          <div 
            key={cell.id} 
            onClick={() => handleViewDetails(cell)}
            className="group bg-white rounded-xl shadow-sm border border-slate-200 p-6 hover:shadow-md hover:border-primary-200 transition-all cursor-pointer relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity">
                <ChevronRight className="text-slate-400" />
            </div>
            
            <div className="flex items-center space-x-3 mb-4">
              <div className="bg-primary-100 p-2.5 rounded-lg text-primary-600">
                <Users size={24} />
              </div>
              <h3 className="text-lg font-bold text-slate-800">{cell.name}</h3>
            </div>

            <div className="space-y-3 text-sm text-slate-600">
              <div className="flex items-center space-x-2">
                <UserCircle size={16} className="text-slate-400" />
                <span className="font-medium text-slate-900">{cell.leaderName}</span>
                <span className="text-xs bg-slate-100 px-2 py-0.5 rounded text-slate-500">Leader</span>
              </div>
              <div className="flex items-center space-x-2">
                <MapPin size={16} className="text-slate-400" />
                <span>{cell.location}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Calendar size={16} className="text-slate-400" />
                <span>Meetings: <span className="font-medium">{cell.meetingDay}s</span></span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Cell Details Modal */}
      {selectedCell && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
            
            <div className="px-6 py-5 border-b border-slate-100 flex justify-between items-start bg-slate-50">
              <div>
                <h2 className="text-xl font-bold text-slate-800">{selectedCell.name}</h2>
                <div className="flex items-center space-x-4 mt-1 text-sm text-slate-500">
                  <span className="flex items-center"><MapPin size={14} className="mr-1" /> {selectedCell.location}</span>
                  <span className="flex items-center"><Calendar size={14} className="mr-1" /> {selectedCell.meetingDay}s</span>
                </div>
              </div>
              <button onClick={() => setSelectedCell(null)} className="text-slate-400 hover:text-slate-600 p-1">
                <X size={24} />
              </button>
            </div>

            <div className="overflow-y-auto flex-1 p-6">
              
              <div className="mb-8 bg-blue-50/50 rounded-xl p-4 border border-blue-100">
                <div className="flex justify-between items-center mb-2">
                    <h3 className="text-sm font-bold text-slate-700 uppercase tracking-wide">Cell Leader</h3>
                    {!isEditingLeader && (
                        <button 
                            onClick={() => setIsEditingLeader(true)}
                            className="text-xs flex items-center space-x-1 text-primary-600 hover:text-primary-700 font-medium"
                        >
                            <Edit2 size={12} /> <span>Change Leader</span>
                        </button>
                    )}
                </div>
                
                {isEditingLeader ? (
                    <div className="flex items-center space-x-3">
                        <select 
                            value={newLeaderId}
                            onChange={(e) => setNewLeaderId(e.target.value)}
                            className="flex-1 px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 outline-none"
                        >
                            <option value="">Select a Leader</option>
                            {leaders.map(l => (
                                <option key={l.id} value={l.id}>
                                    {l.name} {l.cellId && l.cellId !== selectedCell.id ? '(Assigned elsewhere)' : ''}
                                </option>
                            ))}
                        </select>
                        <button 
                            onClick={handleSaveLeader}
                            className="px-4 py-2 bg-primary-600 text-white text-sm font-medium rounded-lg hover:bg-primary-700"
                        >
                            Save
                        </button>
                        <button 
                            onClick={() => setIsEditingLeader(false)}
                            className="px-4 py-2 bg-white border border-slate-300 text-slate-600 text-sm font-medium rounded-lg hover:bg-slate-50"
                        >
                            Cancel
                        </button>
                    </div>
                ) : (
                    <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center text-primary-700 font-bold">
                            {selectedCell.leaderName.charAt(0)}
                        </div>
                        <div>
                            <p className="font-semibold text-slate-800">{selectedCell.leaderName}</p>
                            <p className="text-xs text-slate-500">Current Assigned Leader</p>
                        </div>
                    </div>
                )}
              </div>

              <div>
                <h3 className="text-sm font-bold text-slate-700 uppercase tracking-wide mb-3">
                    Members ({cellMembers.length})
                </h3>
                {cellMembers.length === 0 ? (
                    <div className="text-center py-8 bg-slate-50 rounded-lg border border-dashed border-slate-200 text-slate-400 text-sm">
                        No members assigned to this cell yet.
                    </div>
                ) : (
                    <div className="space-y-2">
                        {cellMembers.map(m => (
                            <div key={m.id} className="flex items-center justify-between p-3 bg-white border border-slate-100 rounded-lg hover:border-slate-300 transition-colors">
                                <div>
                                    <p className="font-medium text-slate-800">{m.fullName}</p>
                                    <p className="text-xs text-slate-500">{m.phone} • {m.status}</p>
                                </div>
                                <div className="text-xs text-slate-400">
                                    Joined {m.joinedDate}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
              </div>

            </div>
            
            <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex justify-end">
                <button 
                    onClick={() => setSelectedCell(null)}
                    className="px-5 py-2 bg-white border border-slate-300 shadow-sm rounded-lg text-slate-700 font-medium hover:bg-slate-50"
                >
                    Close
                </button>
            </div>

          </div>
        </div>
      )}

      {/* Add Cell Modal */}
      {showAddCellModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg overflow-hidden">
             <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
                <h3 className="text-lg font-bold text-slate-800">Add New Cell</h3>
                <button onClick={() => setShowAddCellModal(false)} className="text-slate-400 hover:text-slate-600">
                   <X size={24} />
                </button>
             </div>
             <form onSubmit={handleCreateCell} className="p-6 space-y-4">
                 <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Cell Name</label>
                    <input 
                       required
                       type="text" 
                       className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 outline-none"
                       value={newCellData.name}
                       onChange={e => setNewCellData({...newCellData, name: e.target.value})}
                       placeholder="e.g. Nyarutarama Cell"
                    />
                 </div>
                 <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Location / Address</label>
                    <input 
                       required
                       type="text" 
                       className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 outline-none"
                       value={newCellData.location}
                       onChange={e => setNewCellData({...newCellData, location: e.target.value})}
                       placeholder="e.g. Near MTN Centre"
                    />
                 </div>
                 <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Meeting Day</label>
                        <select 
                            className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 outline-none bg-white"
                            value={newCellData.meetingDay}
                            onChange={e => setNewCellData({...newCellData, meetingDay: e.target.value})}
                        >
                            <option>Monday</option>
                            <option>Tuesday</option>
                            <option>Wednesday</option>
                            <option>Thursday</option>
                            <option>Friday</option>
                            <option>Saturday</option>
                            <option>Sunday</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Leader</label>
                        <select 
                            className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 outline-none bg-white"
                            value={newCellData.leaderId}
                            onChange={e => setNewCellData({...newCellData, leaderId: e.target.value})}
                        >
                            <option value="">Assign Later</option>
                            {leaders.map(l => (
                                <option key={l.id} value={l.id}>{l.name}</option>
                            ))}
                        </select>
                    </div>
                 </div>
                 <div className="pt-4 flex justify-end space-x-3">
                    <button 
                        type="button" 
                        onClick={() => setShowAddCellModal(false)}
                        className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg"
                    >
                        Cancel
                    </button>
                    <button 
                        type="submit" 
                        className="px-6 py-2 bg-primary-600 text-white font-semibold rounded-lg hover:bg-primary-700"
                    >
                        Create Cell
                    </button>
                 </div>
             </form>
          </div>
        </div>
      )}
    </div>
  );
};