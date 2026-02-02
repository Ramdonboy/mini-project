import { Outlet } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { Car, Calendar, User, LogOut } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function UserLayout() {
  const { isAuthenticated, user, logout } = useAuth();

  return (
    <div className="min-h-screen bg-[#F3F4F6]">
      <nav className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center gap-8">
              <Link to="/" className="flex items-center gap-2 text-xl font-bold text-gray-900">
                <Car className="w-8 h-8 text-primary-600" />
                CarRent
              </Link>
              <div className="hidden md:flex gap-6">
                <Link to="/" className="text-gray-600 hover:text-primary-600 font-medium">
                  Browse
                </Link>
                {isAuthenticated && user?.role === 'USER' && (
                  <Link to="/my-bookings" className="text-gray-600 hover:text-primary-600 font-medium">
                    My Bookings
                  </Link>
                )}
              </div>
            </div>
            <div className="flex items-center gap-4">
              {isAuthenticated ? (
                <>
                  {(user?.role === 'ADMIN' || user?.role === 'OWNER') && (
                    <Link
                      to={user.role === 'ADMIN' ? '/admin' : '/owner'}
                      className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 font-medium"
                    >
                      {user.role === 'ADMIN' ? 'Admin' : 'Owner'} Dashboard
                    </Link>
                  )}
                  <Link
                    to="/profile"
                    className="flex items-center gap-2 text-gray-600 hover:text-primary-600"
                  >
                    <User className="w-5 h-5" />
                    <span>{user?.fullName}</span>
                  </Link>
                  <button
                    onClick={logout}
                    className="flex items-center gap-2 text-gray-600 hover:text-red-600 p-2"
                  >
                    <LogOut className="w-5 h-5" />
                  </button>
                </>
              ) : (
                <>
                  <Link to="/login" className="text-gray-600 hover:text-primary-600 font-medium">
                    Login
                  </Link>
                  <Link
                    to="/register"
                    className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 font-medium"
                  >
                    Register
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </nav>
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Outlet />
      </main>
    </div>
  );
}
