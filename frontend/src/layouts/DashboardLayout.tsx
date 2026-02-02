import { Outlet, Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, Car, Calendar, Users, LogOut } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface DashboardLayoutProps {
  role: 'admin' | 'owner';
}

const adminNav = [
  { to: '/admin', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/admin/cars', icon: Car, label: 'Cars' },
  { to: '/admin/bookings', icon: Calendar, label: 'Bookings' },
  { to: '/admin/users', icon: Users, label: 'Users' },
];

const ownerNav = [
  { to: '/owner', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/owner/cars', icon: Car, label: 'Cars' },
  { to: '/owner/bookings', icon: Calendar, label: 'Bookings' },
];

export default function DashboardLayout({ role }: DashboardLayoutProps) {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navItems = role === 'admin' ? adminNav : ownerNav;

  return (
    <div className="min-h-screen bg-[#F3F4F6] flex">
      <aside className="w-64 bg-white shadow-sm border-r border-gray-200 flex flex-col">
        <div className="p-6 border-b border-gray-200">
          <Link to="/" className="text-xl font-bold text-gray-900">
            CarRent
          </Link>
          <p className="text-sm text-gray-500 mt-1 capitalize">{role} Portal</p>
        </div>
        <nav className="flex-1 p-4 space-y-1">
          {navItems.map(({ to, icon: Icon, label }) => (
            <Link
              key={to}
              to={to}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-colors ${
                location.pathname === to
                  ? 'bg-primary-50 text-primary-700'
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              <Icon className="w-5 h-5" />
              {label}
            </Link>
          ))}
        </nav>
        <div className="p-4 border-t border-gray-200">
          <Link to="/" className="block text-sm text-gray-600 hover:text-primary-600 mb-2">
            ← Back to Browse
          </Link>
          <button
            onClick={logout}
            className="flex items-center gap-2 text-gray-600 hover:text-red-600 w-full"
          >
            <LogOut className="w-5 h-5" />
            Logout
          </button>
        </div>
      </aside>
      <main className="flex-1 overflow-auto p-8">
        <Outlet />
      </main>
    </div>
  );
}
