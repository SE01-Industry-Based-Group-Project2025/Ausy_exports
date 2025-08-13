import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const OwnerDashboard = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    totalBranches: 0,
    totalEmployees: 0,
    totalOrders: 0,
    activeAgreements: 0,
  });

  useEffect(() => {
    setStats({
      totalBranches: 8,
      totalEmployees: 234,
      totalOrders: 156,
      activeAgreements: 23,
    });
  }, []);

  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Owner Dashboard
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2">
          Manage your business operations and oversee all branches.
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="card">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-blue-100 dark:bg-blue-900">
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
            <div className="p-3 rounded-full bg-green-100 dark:bg-green-900">
              <span className="text-2xl">👷</span>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Employees</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.totalEmployees}</p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-yellow-100 dark:bg-yellow-900">
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
            <div className="p-3 rounded-full bg-purple-100 dark:bg-purple-900">
              <span className="text-2xl">📋</span>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Active Agreements</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.activeAgreements}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Owner Management Tools */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Business Management
          </h3>
          <div className="space-y-3">
            <button 
              onClick={() => navigate('/dashboard/orders')}
              className="w-full text-left p-3 rounded-lg bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
            >
              <div className="flex items-center">
                <span className="text-xl mr-3">�</span>
                <div>
                  <p className="font-medium text-gray-900 dark:text-white">Manage Orders</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">View and manage all customer orders</p>
                </div>
              </div>
            </button>
            <button 
              onClick={() => navigate('/dashboard/agreements')}
              className="w-full text-left p-3 rounded-lg bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
            >
              <div className="flex items-center">
                <span className="text-xl mr-3">📋</span>
                <div>
                  <p className="font-medium text-gray-900 dark:text-white">Manage Agreements</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Handle business agreements and contracts</p>
                </div>
              </div>
            </button>
            <button 
              onClick={() => navigate('/dashboard/commands')}
              className="w-full text-left p-3 rounded-lg bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
            >
              <div className="flex items-center">
                <span className="text-xl mr-3">📢</span>
                <div>
                  <p className="font-medium text-gray-900 dark:text-white">Give Commands</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Send instructions to managers and branches</p>
                </div>
              </div>
            </button>
            <button 
              onClick={() => navigate('/dashboard/reports')}
              className="w-full text-left p-3 rounded-lg bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
            >
              <div className="flex items-center">
                <span className="text-xl mr-3">📊</span>
                <div>
                  <p className="font-medium text-gray-900 dark:text-white">View Reports</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Access business analytics and reports</p>
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
            <button 
              onClick={() => navigate('/dashboard/users')}
              className="w-full text-left p-3 rounded-lg bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
            >
              <div className="flex items-center">
                <span className="text-xl mr-3">👥</span>
                <div>
                  <p className="font-medium text-gray-900 dark:text-white">Manage Users</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Add, edit, or remove user accounts</p>
                </div>
              </div>
            </button>
            <button 
              onClick={() => navigate('/dashboard/branches')}
              className="w-full text-left p-3 rounded-lg bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
            >
              <div className="flex items-center">
                <span className="text-xl mr-3">🏢</span>
                <div>
                  <p className="font-medium text-gray-900 dark:text-white">Manage Branches</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Oversee all branch operations</p>
                </div>
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OwnerDashboard;
