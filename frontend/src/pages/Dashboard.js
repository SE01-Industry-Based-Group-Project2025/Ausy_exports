import React, { useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth, useTheme } from '../App';
import UserManagement from '../components/UserManagement';
import BranchManagement from '../components/BranchManagement';

// UserManagement with Sidebar Layout
const UserManagementWithSidebar = ({ user }) => {
  const { logout } = useAuth();

  return (
    <div className="flex h-screen bg-gray-100 dark:bg-gray-900">
      <SimpleSidebar user={user} logout={logout} />
      <div className="flex-1 overflow-auto">
        <UserManagement />
      </div>
    </div>
  );
};

// BranchManagement with Sidebar Layout
const BranchManagementWithSidebar = ({ user }) => {
  const { logout } = useAuth();

  return (
    <div className="flex h-screen bg-gray-100 dark:bg-gray-900">
      <SimpleSidebar user={user} logout={logout} />
      <div className="flex-1 overflow-auto">
        <BranchManagement />
      </div>
    </div>
  );
};

// Simple Sidebar component
const SimpleSidebar = ({ user, logout }) => {
  const { darkMode, toggleDarkMode } = useTheme();
  
  return (
    <div className="w-64 bg-white dark:bg-gray-800 shadow-lg">
      <div className="p-4">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white">AUSY EXPO</h2>
      </div>
      
      {/* Navigation */}
      <nav className="mt-4">
        <div className="px-4 py-2">
          <a 
            href="/dashboard" 
            className="flex items-center p-2 text-gray-900 dark:text-white rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            <span className="text-xl mr-3">🏠</span>
            Dashboard
          </a>
        </div>
        
        {user.role === 'ADMIN' && (
          <>
            <div className="px-4 py-2">
              <a 
                href="/dashboard/admin/users" 
                className="flex items-center p-2 text-gray-900 dark:text-white rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                <span className="text-xl mr-3">👥</span>
                Manage Users
              </a>
            </div>
            <div className="px-4 py-2">
              <a 
                href="/dashboard/admin/branches" 
                className="flex items-center p-2 text-gray-900 dark:text-white rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                <span className="text-xl mr-3">🏢</span>
                Manage Branches
              </a>
            </div>
            <div className="px-4 py-2">
              <div className="flex items-center p-2 text-gray-500 dark:text-gray-400 rounded-lg">
                <span className="text-xl mr-3">📦</span>
                Manage Orders
              </div>
            </div>
          </>
        )}
      </nav>
      
      {/* User Info & Actions */}
      <div className="absolute bottom-0 w-64 p-4 bg-gray-50 dark:bg-gray-700">
        <div className="flex items-center mb-3">
          <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white text-sm font-bold">
            {user.firstName?.charAt(0)}{user.lastName?.charAt(0)}
          </div>
          <div className="ml-3 flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
              {user.firstName} {user.lastName}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              {user.role}
            </p>
          </div>
        </div>
        
        <div className="flex space-x-2">
          <button
            onClick={toggleDarkMode}
            className="flex-1 bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-white px-3 py-1 rounded text-xs hover:bg-gray-300 dark:hover:bg-gray-500"
          >
            {darkMode ? '☀️' : '🌙'}
          </button>
          <button
            onClick={logout}
            className="flex-1 bg-red-500 text-white px-3 py-1 rounded text-xs hover:bg-red-600"
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  );
};

const Dashboard = () => {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/login" />;
  }

  return (
    <Routes>
      <Route path="/" element={<DashboardHome user={user} />} />
      <Route path="/admin/users" element={<UserManagementWithSidebar user={user} />} />
      <Route path="/admin/branches" element={<BranchManagementWithSidebar user={user} />} />
      <Route path="/*" element={<DashboardHome user={user} />} />
    </Routes>
  );
};

const DashboardHome = ({ user }) => {
  const { logout } = useAuth();

  return (
    <div className="flex h-screen bg-gray-100 dark:bg-gray-900">
      <SimpleSidebar user={user} logout={logout} />
      <div className="flex-1 overflow-auto p-8">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
            Welcome to Dashboard
          </h1>
          
          {/* User Info Card */}
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow mb-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              Hello, {user.firstName} {user.lastName}!
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              Role: {user.role}
            </p>
          </div>

          {/* Admin Dashboard */}
          {user.role === 'ADMIN' && (
            <div className="space-y-6">
              {/* Stats Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow">
                  <div className="flex items-center">
                    <div className="p-3 rounded-full bg-blue-100 dark:bg-blue-900">
                      <span className="text-2xl">👥</span>
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Users</p>
                      <p className="text-2xl font-bold text-gray-900 dark:text-white">15</p>
                    </div>
                  </div>
                </div>
                
                <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow">
                  <div className="flex items-center">
                    <div className="p-3 rounded-full bg-green-100 dark:bg-green-900">
                      <span className="text-2xl">🏢</span>
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Branches</p>
                      <p className="text-2xl font-bold text-gray-900 dark:text-white">8</p>
                    </div>
                  </div>
                </div>
                
                <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow">
                  <div className="flex items-center">
                    <div className="p-3 rounded-full bg-purple-100 dark:bg-purple-900">
                      <span className="text-2xl">📦</span>
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Orders</p>
                      <p className="text-2xl font-bold text-gray-900 dark:text-white">142</p>
                    </div>
                  </div>
                </div>
                
                <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow">
                  <div className="flex items-center">
                    <div className="p-3 rounded-full bg-yellow-100 dark:bg-yellow-900">
                      <span className="text-2xl">⏳</span>
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Pending Orders</p>
                      <p className="text-2xl font-bold text-gray-900 dark:text-white">23</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  Quick Actions
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <button 
                    onClick={() => window.location.href = '/dashboard/admin/users'}
                    className="w-full text-left p-4 rounded-lg bg-blue-50 dark:bg-blue-900 hover:bg-blue-100 dark:hover:bg-blue-800 transition-colors"
                  >
                    <div className="flex items-center">
                      <span className="text-xl mr-3">👥</span>
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white">Manage Users</p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">Add, edit, or remove users</p>
                      </div>
                    </div>
                  </button>
                  
                  <button className="w-full text-left p-4 rounded-lg bg-green-50 dark:bg-green-900 hover:bg-green-100 dark:hover:bg-green-800 transition-colors">
                    <div className="flex items-center">
                      <span className="text-xl mr-3">🏢</span>
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white">Manage Branches</p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">Add, edit, or remove branches</p>
                      </div>
                    </div>
                  </button>
                  
                  <button className="w-full text-left p-4 rounded-lg bg-purple-50 dark:bg-purple-900 hover:bg-purple-100 dark:hover:bg-purple-800 transition-colors">
                    <div className="flex items-center">
                      <span className="text-xl mr-3">📦</span>
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white">Manage Orders</p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">View and process orders</p>
                      </div>
                    </div>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Non-Admin Users */}
          {user.role !== 'ADMIN' && (
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                Welcome, {user.firstName}!
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Your {user.role} dashboard is under development. Please check back later.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
