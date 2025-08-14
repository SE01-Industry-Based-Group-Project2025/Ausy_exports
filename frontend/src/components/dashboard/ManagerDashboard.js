import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const ManagerDashboard = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    totalEmployees: 0,
    departments: 0,
    stockItems: 0,
    vehicles: 0,
  });
  const [loading, setLoading] = useState(true);

  const fetchStats = async () => {
    try {
      const token = localStorage.getItem('token');
      const headers = {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      };

      // Fetch employee count
      const employeesResponse = await fetch('http://localhost:8080/api/employees', { headers });
      const employeesData = employeesResponse.ok ? await employeesResponse.json() : [];

      // Fetch department count
      const departmentsResponse = await fetch('http://localhost:8080/api/departments', { headers });
      const departmentsData = departmentsResponse.ok ? await departmentsResponse.json() : [];

      // Fetch stock count
      const stockResponse = await fetch('http://localhost:8080/api/stock', { headers });
      const stockData = stockResponse.ok ? await stockResponse.json() : [];

      // Fetch transportation/vehicles count
      const transportationResponse = await fetch('http://localhost:8080/api/transportation', { headers });
      const transportationData = transportationResponse.ok ? await transportationResponse.json() : [];

      setStats({
        totalEmployees: employeesData.length || 0,
        departments: departmentsData.length || 0,
        stockItems: stockData.length || 0,
        vehicles: transportationData.length || 0,
      });
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
      // Keep default values on error
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Manager Dashboard
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2">
          Manage your branch operations and oversee daily activities.
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="card">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-blue-100 dark:bg-blue-900">
              <span className="text-2xl">👷</span>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Employees</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {loading ? '...' : stats.totalEmployees}
              </p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-green-100 dark:bg-green-900">
              <span className="text-2xl">🏛️</span>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Departments</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {loading ? '...' : stats.departments}
              </p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-yellow-100 dark:bg-yellow-900">
              <span className="text-2xl">📦</span>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Stock Items</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {loading ? '...' : stats.stockItems}
              </p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-purple-100 dark:bg-purple-900">
              <span className="text-2xl">🚛</span>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Vehicles</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {loading ? '...' : stats.vehicles}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Management Sections */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Staff Management
          </h3>
          <div className="space-y-3">
            <button 
              onClick={() => navigate('/dashboard/employees')}
              className="w-full text-left p-3 rounded-lg bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
            >
              <div className="flex items-center">
                <span className="text-xl mr-3">👷</span>
                <div>
                  <p className="font-medium text-gray-900 dark:text-white">Manage Employees</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Add, edit, or remove employees</p>
                </div>
              </div>
            </button>
            <button className="w-full text-left p-3 rounded-lg bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors">
              <div className="flex items-center">
                <span className="text-xl mr-3">💰</span>
                <div>
                  <p className="font-medium text-gray-900 dark:text-white">Manage Salary</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Handle payroll and salary details</p>
                </div>
              </div>
            </button>
            <button 
              onClick={() => navigate('/dashboard/departments')}
              className="w-full text-left p-3 rounded-lg bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
            >
              <div className="flex items-center">
                <span className="text-xl mr-3">🏛️</span>
                <div>
                  <p className="font-medium text-gray-900 dark:text-white">Manage Departments</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Organize departmental structure</p>
                </div>
              </div>
            </button>
          </div>
        </div>

        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Operations Management
          </h3>
          <div className="space-y-3">
            <button 
              onClick={() => navigate('/dashboard/stock')}
              className="w-full text-left p-3 rounded-lg bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
            >
              <div className="flex items-center">
                <span className="text-xl mr-3">📦</span>
                <div>
                  <p className="font-medium text-gray-900 dark:text-white">Manage Stock</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Track inventory and stock levels</p>
                </div>
              </div>
            </button>
            <button 
              onClick={() => navigate('/dashboard/transportation')}
              className="w-full text-left p-3 rounded-lg bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
            >
              <div className="flex items-center">
                <span className="text-xl mr-3">🚛</span>
                <div>
                  <p className="font-medium text-gray-900 dark:text-white">Manage Transportation</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Vehicle fleet management</p>
                </div>
              </div>
            </button>
            <button 
              onClick={() => navigate('/dashboard/supplies')}
              className="w-full text-left p-3 rounded-lg bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
            >
              <div className="flex items-center">
                <span className="text-xl mr-3">📋</span>
                <div>
                  <p className="font-medium text-gray-900 dark:text-white">Manage Supply</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Handle supply chain operations</p>
                </div>
              </div>
            </button>
            <button 
              onClick={() => navigate('/dashboard/reports')}
              className="w-full text-left p-3 rounded-lg bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
            >
              <div className="flex items-center">
                <span className="text-xl mr-3">📈</span>
                <div>
                  <p className="font-medium text-gray-900 dark:text-white">View Reports</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Analytics and performance reports</p>
                </div>
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ManagerDashboard;
