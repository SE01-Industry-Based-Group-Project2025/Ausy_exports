import React, { useState, useEffect } from 'react';

const SupplierDashboard = () => {
  const [stats, setStats] = useState({
    totalSupplies: 0,
    pendingOrders: 0,
    completedOrders: 0,
    totalRevenue: 0,
  });

  useEffect(() => {
    setStats({
      totalSupplies: 28,
      pendingOrders: 5,
      completedOrders: 142,
      totalRevenue: 85600,
    });
  }, []);

  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Supplier Dashboard
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2">
          Manage your supplies and track order status.
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="card">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-blue-100 dark:bg-blue-900">
              <span className="text-2xl">📦</span>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Supplies</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.totalSupplies}</p>
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

        <div className="card">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-green-100 dark:bg-green-900">
              <span className="text-2xl">✅</span>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Completed Orders</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.completedOrders}</p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-purple-100 dark:bg-purple-900">
              <span className="text-2xl">💰</span>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Revenue</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">${stats.totalRevenue.toLocaleString()}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Supply Management */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Supply Management
          </h3>
          <div className="space-y-3">
            <button className="w-full text-left p-3 rounded-lg bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors">
              <div className="flex items-center">
                <span className="text-xl mr-3">📦</span>
                <div>
                  <p className="font-medium text-gray-900 dark:text-white">My Supplies</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">View and manage your supply catalog</p>
                </div>
              </div>
            </button>
            <button className="w-full text-left p-3 rounded-lg bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors">
              <div className="flex items-center">
                <span className="text-xl mr-3">📋</span>
                <div>
                  <p className="font-medium text-gray-900 dark:text-white">Orders</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Track incoming orders and requests</p>
                </div>
              </div>
            </button>
            <button className="w-full text-left p-3 rounded-lg bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors">
              <div className="flex items-center">
                <span className="text-xl mr-3">💳</span>
                <div>
                  <p className="font-medium text-gray-900 dark:text-white">Payments</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Payment history and invoices</p>
                </div>
              </div>
            </button>
          </div>
        </div>

        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Recent Orders
          </h3>
          <div className="space-y-3">
            <div className="flex items-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <div className="w-2 h-2 bg-yellow-500 rounded-full mr-3"></div>
              <div className="flex-1">
                <p className="text-sm text-gray-900 dark:text-white">Cotton Fabric - 500 yards</p>
                <p className="text-xs text-gray-600 dark:text-gray-400">Order #12345 - Pending</p>
              </div>
              <span className="text-sm font-medium text-gray-900 dark:text-white">$2,500</span>
            </div>
            <div className="flex items-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
              <div className="flex-1">
                <p className="text-sm text-gray-900 dark:text-white">Silk Material - 200 yards</p>
                <p className="text-xs text-gray-600 dark:text-gray-400">Order #12344 - Completed</p>
              </div>
              <span className="text-sm font-medium text-gray-900 dark:text-white">$3,200</span>
            </div>
            <div className="flex items-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
              <div className="flex-1">
                <p className="text-sm text-gray-900 dark:text-white">Polyester Blend - 800 yards</p>
                <p className="text-xs text-gray-600 dark:text-gray-400">Order #12343 - In Progress</p>
              </div>
              <span className="text-sm font-medium text-gray-900 dark:text-white">$1,800</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SupplierDashboard;
