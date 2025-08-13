import React, { useState, useEffect } from 'react';

const BuyerDashboard = () => {
  const [stats, setStats] = useState({
    totalOrders: 0,
    pendingOrders: 0,
    completedOrders: 0,
    totalSpent: 0,
  });

  useEffect(() => {
    setStats({
      totalOrders: 18,
      pendingOrders: 3,
      completedOrders: 15,
      totalSpent: 45800,
    });
  }, []);

  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Buyer Dashboard
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2">
          Browse products and manage your orders.
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="card">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-blue-100 dark:bg-blue-900">
              <span className="text-2xl">🛍️</span>
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
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Spent</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">${stats.totalSpent.toLocaleString()}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Order Management */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Order Management
          </h3>
          <div className="space-y-3">
            <button className="w-full text-left p-3 rounded-lg bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors">
              <div className="flex items-center">
                <span className="text-xl mr-3">🛍️</span>
                <div>
                  <p className="font-medium text-gray-900 dark:text-white">My Orders</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">View and track your current orders</p>
                </div>
              </div>
            </button>
            <button className="w-full text-left p-3 rounded-lg bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors">
              <div className="flex items-center">
                <span className="text-xl mr-3">👕</span>
                <div>
                  <p className="font-medium text-gray-900 dark:text-white">Browse Products</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Explore available garment products</p>
                </div>
              </div>
            </button>
            <button className="w-full text-left p-3 rounded-lg bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors">
              <div className="flex items-center">
                <span className="text-xl mr-3">📚</span>
                <div>
                  <p className="font-medium text-gray-900 dark:text-white">Order History</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">View past order history and details</p>
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
                <p className="text-sm text-gray-900 dark:text-white">T-Shirts - 100 units</p>
                <p className="text-xs text-gray-600 dark:text-gray-400">Order #B12345 - In Production</p>
              </div>
              <span className="text-sm font-medium text-gray-900 dark:text-white">$1,200</span>
            </div>
            <div className="flex items-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
              <div className="flex-1">
                <p className="text-sm text-gray-900 dark:text-white">Formal Shirts - 50 units</p>
                <p className="text-xs text-gray-600 dark:text-gray-400">Order #B12344 - Delivered</p>
              </div>
              <span className="text-sm font-medium text-gray-900 dark:text-white">$2,500</span>
            </div>
            <div className="flex items-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
              <div className="flex-1">
                <p className="text-sm text-gray-900 dark:text-white">Casual Wear - 200 units</p>
                <p className="text-xs text-gray-600 dark:text-gray-400">Order #B12343 - Quality Check</p>
              </div>
              <span className="text-sm font-medium text-gray-900 dark:text-white">$3,800</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BuyerDashboard;
