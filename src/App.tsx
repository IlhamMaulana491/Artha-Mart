import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import { 
  Briefcase, 
  Users, 
  Package, 
  LayoutDashboard, 
  Kanban,
  TrendingUp,
  Settings,
  Menu,
  X,
  Plus
} from 'lucide-react';
import React, { useState } from 'react';
import { cn } from './lib/utils';

import Dashboard from './pages/Dashboard';
import Customers from './pages/Customers';
import Pipeline from './pages/Pipeline';
import Inventory from './pages/Inventory';
import SettingsPage from './pages/Settings';

const NavLink = ({ to, icon: Icon, children }: { to: string; icon: any; children: React.ReactNode }) => {
  const location = useLocation();
  const isActive = location.pathname === to;
  
  return (
    <Link
      to={to}
      className={cn(
        "flex items-center gap-2.5 px-3 py-2 rounded-lg transition-all duration-200 group",
        isActive 
          ? "bg-slate-900 text-white shadow-md" 
          : "text-slate-500 hover:bg-slate-100 hover:text-slate-900"
      )}
    >
      <Icon className={cn("w-4 h-4", isActive ? "text-white" : "text-slate-400 group-hover:text-slate-900")} />
      <span className="text-sm font-medium">{children}</span>
    </Link>
  );
};

export default function App() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  return (
    <Router>
      <div className="min-h-screen bg-slate-50 flex">
        {/* Sidebar Overlay for Mobile */}
        {isSidebarOpen && (
          <div 
            className="fixed inset-0 bg-slate-900/20 backdrop-blur-sm z-40 lg:hidden"
            onClick={() => setIsSidebarOpen(false)}
          />
        )}

        {/* Sidebar */}
        <aside 
          className={cn(
            "fixed inset-y-0 left-0 z-50 w-56 bg-white border-r border-slate-200 transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:block",
            isSidebarOpen ? "translate-x-0" : "-translate-x-full"
          )}
        >
          <div className="h-full flex flex-col px-3 py-5 relative">
            {/* Close button inside sidebar for mobile */}
            <button 
              onClick={() => setIsSidebarOpen(false)}
              className="absolute top-4 right-2 p-2 text-slate-400 hover:text-slate-900 lg:hidden"
            >
              <X size={20} />
            </button>

            <div className="flex items-center gap-2 mb-6 px-2">
              <div className="w-7 h-7 bg-slate-900 rounded-md flex items-center justify-center">
                <Briefcase className="w-4 h-4 text-white" />
              </div>
              <h1 className="text-lg font-bold tracking-tight text-slate-900">Artha CRM</h1>
            </div>

            <nav className="flex-1 space-y-1">
              <NavLink to="/" icon={LayoutDashboard}>Dashboard</NavLink>
              <NavLink to="/pipeline" icon={Kanban}>Pipeline</NavLink>
              <NavLink to="/customers" icon={Users}>Pelanggan</NavLink>
              <NavLink to="/inventory" icon={Package}>Katalog</NavLink>
            </nav>

            <div className="pt-6 border-t border-slate-100">
              <NavLink to="/settings" icon={Settings}>Pengaturan</NavLink>
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 overflow-auto">
          {/* Header */}
          <header className="sticky top-0 z-30 h-14 bg-white/80 backdrop-blur-md border-b border-slate-200 px-4 flex items-center justify-between">
            <button 
              onClick={() => setIsSidebarOpen(true)}
              className="p-2.5 text-slate-500 hover:bg-slate-100 rounded-lg lg:hidden"
            >
              <Menu size={20} />
            </button>

            <div className="flex-1 hidden lg:block px-2">
              <p className="text-xs text-slate-400 font-medium italic">
                {new Date().toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
              </p>
            </div>

            <div className="flex items-center gap-3">
              <button className="flex items-center gap-1.5 bg-slate-900 text-white px-3 py-1.5 rounded-lg text-xs font-semibold hover:bg-slate-800 transition-colors shadow-sm">
                <Plus className="w-3.5 h-3.5" />
                <span>Baru</span>
              </button>
            </div>
          </header>

          <div className="p-4 max-w-7xl mx-auto">
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/pipeline" element={<Pipeline />} />
              <Route path="/customers" element={<Customers />} />
              <Route path="/inventory" element={<Inventory />} />
              <Route path="/settings" element={<SettingsPage />} />
            </Routes>
          </div>
        </main>
      </div>
    </Router>
  );
}

