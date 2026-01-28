import React, { useEffect, useState } from 'react';
import { User, Role, Material } from '../types';
import { MockService } from '../services/mockData';
import { FileText, Video, AlignLeft, Calendar, Download, Plus, X, Eye } from 'lucide-react';

interface Props {
  user: User;
}

export const Resources: React.FC<Props> = ({ user }) => {
  const [materials, setMaterials] = useState<Material[]>([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [previewMaterial, setPreviewMaterial] = useState<Material | null>(null);
  const [newMaterial, setNewMaterial] = useState<Partial<Material>>({
    title: '',
    description: '',
    type: 'PDF',
    date: new Date().toISOString().split('T')[0]
  });

  useEffect(() => {
    loadMaterials();
  }, []);

  const loadMaterials = async () => {
    const data = await MockService.getMaterials();
    setMaterials(data);
  };

  const handleAddMaterial = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMaterial.title || !newMaterial.description) return;
    
    await MockService.addMaterial(newMaterial as Material);
    await loadMaterials();
    setShowAddModal(false);
    setNewMaterial({
        title: '',
        description: '',
        type: 'PDF',
        date: new Date().toISOString().split('T')[0]
    });
  };

  const getIcon = (type: string) => {
    switch(type) {
        case 'VIDEO': return <Video className="text-red-500" size={24} />;
        case 'TEXT': return <AlignLeft className="text-slate-500" size={24} />;
        default: return <FileText className="text-orange-500" size={24} />;
    }
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
  };

  // Group by month
  const groupedMaterials = materials.reduce((groups, material) => {
    const month = new Date(material.date).toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
    if (!groups[month]) groups[month] = [];
    groups[month].push(material);
    return groups;
  }, {} as Record<string, Material[]>);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Weekly Resources</h1>
          <p className="text-slate-500">Study guides, videos, and materials for cell meetings.</p>
        </div>
        {user.role === Role.ADMIN && (
          <button 
            onClick={() => setShowAddModal(true)}
            className="flex items-center space-x-2 bg-primary-600 text-white px-5 py-2.5 rounded-lg font-semibold hover:bg-primary-700 transition-colors shadow-sm"
          >
            <Plus size={18} />
            <span>Add Material</span>
          </button>
        )}
      </div>

      <div className="space-y-8">
        {Object.keys(groupedMaterials).map(month => (
            <div key={month}>
                <div className="flex items-center space-x-2 mb-4">
                    <div className="h-px bg-slate-200 flex-1"></div>
                    <span className="text-sm font-bold text-slate-400 uppercase tracking-wider px-2">{month}</span>
                    <div className="h-px bg-slate-200 flex-1"></div>
                </div>

                <div className="grid grid-cols-1 gap-4">
                    {groupedMaterials[month].map(mat => (
                        <div key={mat.id} className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center gap-4 hover:border-primary-200 transition-colors">
                            <div className="bg-slate-50 p-3 rounded-lg shrink-0 flex items-center justify-center w-16 h-16">
                                {getIcon(mat.type)}
                            </div>
                            <div className="flex-1">
                                <div className="flex items-center space-x-2 mb-1">
                                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wide ${
                                        mat.type === 'VIDEO' ? 'bg-red-50 text-red-600' :
                                        mat.type === 'PDF' ? 'bg-orange-50 text-orange-600' :
                                        'bg-slate-100 text-slate-600'
                                    }`}>
                                        {mat.type}
                                    </span>
                                    <span className="text-xs text-slate-400 flex items-center">
                                        <Calendar size={12} className="mr-1" />
                                        {formatDate(mat.date)}
                                    </span>
                                </div>
                                <h3 className="text-lg font-bold text-slate-800">{mat.title}</h3>
                                <p className="text-slate-500 text-sm mt-1">{mat.description}</p>
                            </div>
                            <div className="flex shrink-0 items-center space-x-3">
                                <button 
                                    onClick={() => setPreviewMaterial(mat)}
                                    className="flex items-center space-x-2 text-slate-600 font-medium px-4 py-2 rounded-lg border border-slate-200 hover:bg-slate-50 transition-colors"
                                >
                                    <Eye size={18} />
                                    <span>Preview</span>
                                </button>
                                <button className="flex items-center space-x-2 text-primary-600 font-medium bg-primary-50 px-4 py-2 rounded-lg hover:bg-primary-100 transition-colors">
                                    <Download size={18} />
                                    <span>Download</span>
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        ))}

        {materials.length === 0 && (
            <div className="text-center py-12 text-slate-400">
                <FileText className="mx-auto mb-3 opacity-20" size={48} />
                <p>No materials uploaded yet.</p>
            </div>
        )}
      </div>

      {/* Add Material Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center">
              <h3 className="text-lg font-bold text-slate-800">Upload New Material</h3>
              <button onClick={() => setShowAddModal(false)} className="text-slate-400 hover:text-slate-600">
                <X size={24} />
              </button>
            </div>
            <form onSubmit={handleAddMaterial} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Title</label>
                <input 
                  required
                  type="text" 
                  placeholder="e.g. Week 4: Sermon on the Mount"
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 outline-none"
                  value={newMaterial.title}
                  onChange={e => setNewMaterial({...newMaterial, title: e.target.value})}
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                 <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Date</label>
                  <input 
                    required
                    type="date" 
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 outline-none"
                    value={newMaterial.date}
                    onChange={e => setNewMaterial({...newMaterial, date: e.target.value})}
                  />
                </div>
                 <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Type</label>
                  <select 
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 outline-none bg-white"
                    value={newMaterial.type}
                    onChange={e => setNewMaterial({...newMaterial, type: e.target.value as any})}
                  >
                    <option value="PDF">PDF Guide</option>
                    <option value="VIDEO">Video Link</option>
                    <option value="TEXT">Text / Announcement</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Description</label>
                <textarea 
                  required
                  rows={3}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 outline-none"
                  value={newMaterial.description}
                  onChange={e => setNewMaterial({...newMaterial, description: e.target.value})}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">File URL / Link (Optional)</label>
                <input 
                  type="text" 
                  placeholder="https://..."
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 outline-none"
                  value={newMaterial.url}
                  onChange={e => setNewMaterial({...newMaterial, url: e.target.value})}
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
                  Upload
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Preview Modal */}
      {previewMaterial && (
          <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4">
              <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl h-[80vh] flex flex-col">
                  <div className="flex justify-between items-center p-4 border-b border-gray-200">
                      <h3 className="font-bold text-lg flex items-center gap-2">
                          {getIcon(previewMaterial.type)}
                          {previewMaterial.title}
                      </h3>
                      <button onClick={() => setPreviewMaterial(null)} className="text-gray-500 hover:text-black">
                          <X size={24} />
                      </button>
                  </div>
                  <div className="flex-1 bg-gray-100 p-6 overflow-y-auto flex items-center justify-center">
                      {previewMaterial.type === 'VIDEO' ? (
                          <div className="text-center text-gray-500">
                              <Video size={64} className="mx-auto mb-4 opacity-50"/>
                              <p className="text-lg font-medium">Video Preview Placeholder</p>
                              <p className="text-sm">In production, this would embed a YouTube/Vimeo player.</p>
                          </div>
                      ) : previewMaterial.type === 'PDF' ? (
                          <div className="w-full h-full bg-white shadow-lg p-8 text-center text-gray-500 border border-gray-200">
                              <FileText size={64} className="mx-auto mb-4 opacity-50"/>
                              <p className="text-lg font-medium">PDF Document Viewer</p>
                              <p className="text-sm mb-4">Content from {previewMaterial.url || 'server'}</p>
                              <div className="text-left max-w-2xl mx-auto space-y-4 opacity-40">
                                  <div className="h-4 bg-gray-300 rounded w-3/4"></div>
                                  <div className="h-4 bg-gray-300 rounded w-full"></div>
                                  <div className="h-4 bg-gray-300 rounded w-full"></div>
                                  <div className="h-4 bg-gray-300 rounded w-1/2"></div>
                              </div>
                          </div>
                      ) : (
                          <div className="w-full max-w-2xl bg-white p-8 shadow-sm rounded-lg">
                              <h2 className="text-xl font-bold mb-4">{previewMaterial.title}</h2>
                              <p className="text-gray-700 leading-relaxed">
                                  {previewMaterial.description}
                                  <br/><br/>
                                  Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. 
                                  Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
                              </p>
                          </div>
                      )}
                  </div>
              </div>
          </div>
      )}
    </div>
  );
};