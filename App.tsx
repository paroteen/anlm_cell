import React, { useState } from 'react';
import { Layout } from './components/Layout';
import { Dashboard } from './components/Dashboard';
import { Members } from './components/Members';
import { Attendance } from './components/Attendance';
import { CellManagement } from './components/CellManagement';
import { Resources } from './components/Resources';
import { Login } from './components/Login';
import { UserManagement } from './components/UserManagement';
import { Reports } from './components/Reports';
import { User, Role } from './types';

// Mock simple routing without react-router for single-file portability if needed, 
// but sticking to state-based view switching for guaranteed behavior in this restricted environment.
const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [currentPage, setCurrentPage] = useState('dashboard');

  if (!user) {
    return <Login onLogin={setUser} />;
  }

  const renderPage = () => {
    switch (currentPage) {
      case 'dashboard':
        return <Dashboard user={user} onNavigate={setCurrentPage} />;
      case 'cells':
        if (user.role !== Role.ADMIN) return <Dashboard user={user} onNavigate={setCurrentPage} />;
        return <CellManagement />;
      case 'users':
        if (user.role !== Role.ADMIN) return <Dashboard user={user} onNavigate={setCurrentPage} />;
        return <UserManagement />;
      case 'members':
        return <Members user={user} />;
      case 'attendance':
        return <Attendance user={user} />;
      case 'resources':
        return <Resources user={user} />;
      case 'reports':
        if (user.role !== Role.ADMIN) return <Dashboard user={user} onNavigate={setCurrentPage} />;
        return <Reports />;
      case 'settings':
         return (
            <div className="p-8 text-center border-2 border-dashed border-slate-300 rounded-xl">
                <h2 className="text-xl font-semibold text-slate-400">System Settings</h2>
                <p className="text-slate-500 mt-2">Global configuration and preferences.</p>
            </div>
        );
      default:
        return <Dashboard user={user} onNavigate={setCurrentPage} />;
    }
  };

  return (
    <Layout 
      user={user} 
      onLogout={() => setUser(null)} 
      currentPage={currentPage}
      onNavigate={setCurrentPage}
    >
      {renderPage()}
    </Layout>
  );
};

export default App;