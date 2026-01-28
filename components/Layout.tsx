import React, { useState } from 'react';
import { User, Role } from '../types';
import { 
  LayoutDashboard, 
  Users, 
  ClipboardCheck, 
  BarChart3, 
  Settings, 
  LogOut, 
  Menu, 
  X,
  Network,
  BookOpen,
  UserCog
} from 'lucide-react';

interface LayoutProps {
  user: User;
  children: React.ReactNode;
  onLogout: () => void;
  currentPage: string;
  onNavigate: (page: string) => void;
}

export const Layout: React.FC<LayoutProps> = ({ user, children, onLogout, currentPage, onNavigate }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const NavItem = ({ page, icon: Icon, label }: { page: string; icon: any; label: string }) => {
    const isActive = currentPage === page;
    return (
      <button
        onClick={() => {
          onNavigate(page);
          setIsMobileMenuOpen(false);
        }}
        className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
          isActive 
            ? 'bg-primary-600 text-white shadow-md' 
            : 'text-chocolate-800 hover:bg-ache-100 hover:text-chocolate-900'
        }`}
      >
        <Icon size={20} />
        <span className="font-medium">{label}</span>
      </button>
    );
  };

  const Logo = () => (
    <img 
      src="/logo.png"
      alt="NewLife Logo" 
      className="h-10 w-auto object-contain"
    />
  );

  return (
    <div className="min-h-screen bg-ache-100/30 flex flex-col md:flex-row">
      {/* Mobile Header */}
      <div className="md:hidden bg-white shadow-sm p-4 flex justify-between items-center sticky top-0 z-20">
        <Logo />
        <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="text-chocolate-900">
          {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Sidebar Navigation */}
      <aside className={`
        fixed inset-y-0 left-0 z-10 w-64 bg-white shadow-xl transform transition-transform duration-300 ease-in-out
        md:relative md:translate-x-0
        ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="h-full flex flex-col">
          <div className="p-6 border-b border-gray-100 flex items-center justify-center">
            <Logo />
          </div>

          <div className="p-6">
            <div className="mb-6 px-4 py-3 bg-primary-50 rounded-lg border border-primary-100">
              <p className="text-xs text-primary-600 uppercase font-bold tracking-wider mb-1">Signed in as</p>
              <p className="font-semibold text-chocolate-900 truncate">{user.name}</p>
              <p className="text-xs text-primary-700 capitalize">{user.role.toLowerCase()}</p>
            </div>

            <nav className="space-y-2">
              <NavItem page="dashboard" icon={LayoutDashboard} label="Dashboard" />
              
              {user.role === Role.ADMIN && (
                <>
                  <NavItem page="cells" icon={Network} label="Manage Cells" />
                  <NavItem page="users" icon={UserCog} label="User Management" />
                </>
              )}
              
              <NavItem page="members" icon={Users} label="Members" />
              <NavItem page="attendance" icon={ClipboardCheck} label="Attendance" />
              <NavItem page="resources" icon={BookOpen} label="Resources" />

              {user.role === Role.ADMIN && (
                <NavItem page="reports" icon={BarChart3} label="Reports" />
              )}
            </nav>
          </div>

          <div className="mt-auto p-6 border-t border-gray-100 space-y-2">
             <NavItem page="settings" icon={Settings} label="Settings" />
            <button
              onClick={onLogout}
              className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-red-600 hover:bg-red-50 transition-colors"
            >
              <LogOut size={20} />
              <span className="font-medium">Sign Out</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-4 md:p-8 overflow-y-auto">
        <div className="max-w-6xl mx-auto">
          {children}
        </div>
      </main>

      {/* Mobile Overlay */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/20 z-0 md:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}
    </div>
  );
};