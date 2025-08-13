import React, { useState, useEffect } from 'react';

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalBranches: 0,
    totalOrders: 0,
    pendingOrders: 0,
  });

  useEffect(() => {
    setStats({
      totalUsers: 15,
      totalBranches: 8,
      totalOrders: 142,
      pendingOrders: 23,
    });
  }, []);

  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Admin Dashboard
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2">
          System administration and overall management.
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="card">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-blue-100 dark:bg-blue-900">
              <span className="text-2xl">👥</span>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Users</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.totalUsers}</p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-green-100 dark:bg-green-900">
              <span className="text-2xl">🏢</span>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Branches</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.totalBranches}</p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-purple-100 dark:bg-purple-900">
              <span className="text-2xl">📦</span>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Orders</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.totalOrders}</p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-yellow-100 dark:bg-yellow-900">
              <span className="text-2xl">⏳</span>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Pending Orders</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.pendingOrders}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Management Sections */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            User Management
          </h3>
          <div className="space-y-3">
            <button className="w-full text-left p-3 rounded-lg bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors">
              <div className="flex items-center">
                <span className="text-xl mr-3">👤</span>
                <div>
                  <p className="font-medium text-gray-900 dark:text-white">Add New User</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Create new user accounts</p>
                </div>
              </div>
            </button>
            <button className="w-full text-left p-3 rounded-lg bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors">
              <div className="flex items-center">
                <span className="text-xl mr-3">👥</span>
                <div>
                  <p className="font-medium text-gray-900 dark:text-white">Manage Users</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Edit and manage existing users</p>
                </div>
              </div>
            </button>
          </div>
        </div>

        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            System Management
          </h3>
          <div className="space-y-3">
            <button className="w-full text-left p-3 rounded-lg bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors">
              <div className="flex items-center">
                <span className="text-xl mr-3">🏢</span>
                <div>
                  <p className="font-medium text-gray-900 dark:text-white">Manage Branches</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Oversee branch operations</p>
                </div>
              </div>
            </button>
            <button className="w-full text-left p-3 rounded-lg bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors">
              <div className="flex items-center">
                <span className="text-xl mr-3">📈</span>
                <div>
                  <p className="font-medium text-gray-900 dark:text-white">View Reports</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">System-wide analytics</p>
                </div>
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
