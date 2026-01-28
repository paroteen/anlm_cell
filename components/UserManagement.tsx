import React, { useEffect, useState } from 'react';
import { User, Role } from '../types';
import { MockService } from '../services/mockData';
import { UserPlus, Edit, Trash2, Shield, Search, X } from 'lucide-react';

export const UserManagement: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('');
  
  // Modal State
  const [showModal, setShowModal] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [formData, setFormData] = useState({
      name: '',
      email: '',
      role: Role.LEADER,
      password: '',
  });

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    setLoading(true);
    const data = await MockService.getUsers();
    setUsers(data);
    setLoading(false);
  };

  const handleEdit = (user: User) => {
    setEditingUser(user);
    setFormData({
        name: user.name,
        email: user.email,
        role: user.role,
        password: user.password || ''
    });
    setShowModal(true);
  };

  const handleAdd = () => {
      setEditingUser(null);
      setFormData({ name: '', email: '', role: Role.LEADER, password: 'password123' });
      setShowModal(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      if (editingUser) {
          await MockService.updateUser(editingUser.id, formData);
      } else {
          await MockService.addUser(formData);
      }
      setShowModal(false);
      loadUsers();
  };

  const filteredUsers = users.filter(u => u.name.toLowerCase().includes(filter.toLowerCase()) || u.email.includes(filter));

  if (loading) return <div className="p-8 text-center text-slate-500">Loading users...</div>;

  return (
    <div className="space-y-6">
       <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">User Management</h1>
          <p className="text-slate-500">Manage system access, roles, and credentials.</p>
        </div>
        <button 
          onClick={handleAdd}
          className="bg-primary-600 text-white px-5 py-2.5 rounded-lg font-semibold hover:bg-primary-700 transition-colors shadow-sm flex items-center gap-2"
        >
          <UserPlus size={18} />
          <span>Add New User</span>
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="p-4 border-b border-slate-100 bg-slate-50">
             <div className="relative max-w-md">
                <Search className="absolute left-3 top-2.5 text-slate-400" size={18} />
                <input 
                  type="text" 
                  placeholder="Search users..." 
                  className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none"
                  value={filter}
                  onChange={(e) => setFilter(e.target.value)}
                />
             </div>
          </div>
          <table className="w-full text-left">
              <thead className="bg-slate-50 border-b border-slate-200 text-sm uppercase text-slate-500 font-semibold">
                  <tr>
                      <th className="px-6 py-4">User Details</th>
                      <th className="px-6 py-4">Role</th>
                      <th className="px-6 py-4">Assignment</th>
                      <th className="px-6 py-4 text-right">Actions</th>
                  </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                  {filteredUsers.map(u => (
                      <tr key={u.id} className="hover:bg-slate-50 transition-colors">
                          <td className="px-6 py-4">
                              <div className="font-bold text-slate-800">{u.name}</div>
                              <div className="text-sm text-slate-500">{u.email}</div>
                          </td>
                          <td className="px-6 py-4">
                              <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold ${
                                  u.role === Role.ADMIN ? 'bg-purple-100 text-purple-700' : 'bg-blue-100 text-blue-700'
                              }`}>
                                  <Shield size={12} /> {u.role}
                              </span>
                          </td>
                          <td className="px-6 py-4 text-sm text-slate-600">
                              {u.cellId ? `Cell ID: ${u.cellId}` : u.role === Role.ADMIN ? 'All Access' : 'Unassigned'}
                          </td>
                          <td className="px-6 py-4 text-right">
                              <button onClick={() => handleEdit(u)} className="text-slate-400 hover:text-primary-600 p-2">
                                  <Edit size={18} />
                              </button>
                          </td>
                      </tr>
                  ))}
              </tbody>
          </table>
      </div>

      {/* User Modal */}
      {showModal && (
          <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
              <div className="bg-white rounded-xl shadow-2xl w-full max-w-md overflow-hidden">
                  <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center">
                    <h3 className="text-lg font-bold text-slate-800">{editingUser ? 'Edit User' : 'Create User'}</h3>
                    <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-slate-600">
                        <X size={24} />
                    </button>
                  </div>
                  <form onSubmit={handleSubmit} className="p-6 space-y-4">
                      <div>
                          <label className="block text-sm font-medium text-slate-700 mb-1">Full Name</label>
                          <input required type="text" className="w-full px-3 py-2 border rounded-lg" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
                      </div>
                      <div>
                          <label className="block text-sm font-medium text-slate-700 mb-1">Email</label>
                          <input required type="email" className="w-full px-3 py-2 border rounded-lg" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} />
                      </div>
                      <div>
                          <label className="block text-sm font-medium text-slate-700 mb-1">Password</label>
                          <input required type="text" className="w-full px-3 py-2 border rounded-lg font-mono text-sm" value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})} />
                      </div>
                      <div>
                          <label className="block text-sm font-medium text-slate-700 mb-1">System Role</label>
                          <select className="w-full px-3 py-2 border rounded-lg bg-white" value={formData.role} onChange={e => setFormData({...formData, role: e.target.value as Role})}>
                              <option value={Role.LEADER}>Cell Leader</option>
                              <option value={Role.ADMIN}>System Admin</option>
                          </select>
                      </div>
                      <div className="pt-4 flex justify-end gap-2">
                          <button type="button" onClick={() => setShowModal(false)} className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg">Cancel</button>
                          <button type="submit" className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700">Save User</button>
                      </div>
                  </form>
              </div>
          </div>
      )}
    </div>
  );
};