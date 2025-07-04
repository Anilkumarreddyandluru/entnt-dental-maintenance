
import React from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Calendar, Users, Activity, BarChart3, User, LogOut, Menu, X } from 'lucide-react';
import { useState } from 'react';

const Layout = () => {
  const { user, logout, isAdmin } = useAuth();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const adminNavItems = [
    { path: '/dashboard', icon: BarChart3, label: 'Dashboard' },
    { path: '/patients', icon: Users, label: 'Patients' },
    { path: '/appointments', icon: Activity, label: 'Appointments' },
    { path: '/calendar', icon: Calendar, label: 'Calendar' },
  ];

  const patientNavItems = [
    { path: '/patient-dashboard', icon: BarChart3, label: 'My Dashboard' },
    { path: '/my-appointments', icon: Activity, label: 'My Appointments' },
  ];

  const navItems = isAdmin ? adminNavItems : patientNavItems;

  const handleLogout = () => {
    logout();
    setIsMobileMenuOpen(false);
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-50 to-purple-100">
      {/* Header */}
      <header className="bg-white shadow-lg border-b-4 border-violet-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center">
              <div className="bg-gradient-to-r from-violet-900 to-purple-900 p-2 rounded-lg">
                <img
                  src="/dental-icon.png"
                  alt="Dental Icon"
                  className="h-10 w-10 object-contain"
                />
              </div>
              <div className="ml-3">
                <h1 className="text-2xl font-bold bg-gradient-to-r from-violet-900 to-purple-900 bg-clip-text text-transparent">
                  DentalCare
                </h1>
                <p className="text-sm text-gray-600">Management Dashboard</p>
              </div>
            </div>

            <div className="hidden md:flex items-center space-x-4">
              <div className="flex items-center space-x-2 bg-gradient-to-r from-violet-100 to-purple-100 px-4 py-2 rounded-full">
                <User className="h-5 w-5 text-violet-600" />
                <span className="text-violet-800 font-medium">{user?.email}</span>
                <span className="bg-violet-200 text-violet-800 px-2 py-1 rounded-full text-xs font-semibold">
                  {user?.role}
                </span>
              </div>
              <button
                onClick={handleLogout}
                className="flex items-center space-x-2 bg-gradient-to-r from-violet-900 to-purple-700 text-white px-4 py-2 rounded-lg hover:from-violet-700 hover:to-purple-700 transition-all duration-200"
              >
                <LogOut className="h-4 w-4" />
                <span>Logout</span>
              </button>
            </div>

            <button
              onClick={toggleMobileMenu}
              className="md:hidden p-2 rounded-lg text-violet-600 hover:bg-violet-100"
            >
              {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Desktop Sidebar */}
        <aside className="hidden md:block w-64 bg-white shadow-lg min-h-screen">
          <nav className="mt-8">
            <div className="px-4 space-y-2">
              {navItems.map((item) => {
                const isActive = location.pathname === item.path;
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                      isActive
                        ? 'bg-gradient-to-r from-pink-700 to-purple-600 text-white shadow-lg'
                        : 'text-gray-700 hover:bg-gradient-to-r hover:from-violet-100 hover:to-purple-100 hover:text-violet-700'
                    }`}
                  >
                    <item.icon className={`h-5 w-5 ${isActive ? 'text-white' : 'text-violet-600'}`} />
                    <span className="font-medium">{item.label}</span>
                  </Link>
                );
              })}
            </div>
          </nav>
        </aside>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden fixed inset-0 z-50 bg-black bg-opacity-50">
            <div className="bg-white w-64 h-full shadow-lg">
              <div className="p-4">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center space-x-2">
                    <User className="h-5 w-5 text-violet-600" />
                    <span className="text-violet-800 font-medium">{user?.email}</span>
                  </div>
                  <button
                    onClick={toggleMobileMenu}
                    className="p-2 rounded-lg text-violet-600 hover:bg-violet-100"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>
                
                <nav className="space-y-2">
                  {navItems.map((item) => {
                    const isActive = location.pathname === item.path;
                    return (
                      <Link
                        key={item.path}
                        to={item.path}
                        onClick={() => setIsMobileMenuOpen(false)}
                        className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                          isActive
                            ? 'bg-gradient-to-r from-pink-700 to-purple-600 text-white shadow-lg'
                            : 'text-gray-700 hover:bg-gradient-to-r hover:from-violet-100 hover:to-purple-100 hover:text-violet-700'
                        }`}
                      >
                        <item.icon className={`h-5 w-5 ${isActive ? 'text-white' : 'text-violet-600'}`} />
                        <span className="font-medium">{item.label}</span>
                      </Link>
                    );
                  })}
                </nav>
                
                <div className="mt-8 pt-4 border-t border-gray-200">
                  <button
                    onClick={handleLogout}
                    className="flex items-center space-x-3 px-4 py-3 rounded-lg text-red-600 hover:bg-red-50 w-full transition-all duration-200"
                  >
                    <LogOut className="h-5 w-5" />
                    <span className="font-medium">Logout</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Main Content */}
        <main className="flex-1 p-4 md:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Layout;
