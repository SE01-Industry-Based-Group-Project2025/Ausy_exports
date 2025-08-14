import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalBranches: 0,
    totalEmployees: 0,
  });
  const [loading, setLoading] = useState(true);

  const fetchStats = async () => {
    try {
      const token = localStorage.getItem('token');
      const headers = {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      };

      // Fetch user count
      const usersResponse = await fetch('http://localhost:8080/api/users', { headers });
      const usersData = usersResponse.ok ? await usersResponse.json() : [];

      // Fetch branch count
      const branchesResponse = await fetch('http://localhost:8080/api/branches', { headers });
      const branchesData = branchesResponse.ok ? await branchesResponse.json() : [];

      // Fetch employee count
      const employeesResponse = await fetch('http://localhost:8080/api/employees', { headers });
      const employeesData = employeesResponse.ok ? await employeesResponse.json() : [];

      setStats({
        totalUsers: usersData.length || 0,
        totalBranches: branchesData.length || 0,
        totalEmployees: employeesData.length || 0,
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
          Admin Dashboard
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2">
          System administration and overall management.
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <div className="card">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-blue-100 dark:bg-blue-900">
              <span className="text-2xl">👥</span>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Users</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {loading ? '...' : stats.totalUsers}
              </p>
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
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {loading ? '...' : stats.totalBranches}
              </p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-purple-100 dark:bg-purple-900">
              <span className="text-2xl">�</span>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Employees</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {loading ? '...' : stats.totalEmployees}
              </p>
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
            <button 
              onClick={() => navigate('/dashboard/add-user')} 
              className="w-full text-left p-3 rounded-lg bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
            >
              <div className="flex items-center">
                <span className="text-xl mr-3">👤</span>
                <div>
                  <p className="font-medium text-gray-900 dark:text-white">Add New User</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Create new user accounts</p>
                </div>
              </div>
            </button>
            <button 
              onClick={() => navigate('/dashboard/users')} 
              className="w-full text-left p-3 rounded-lg bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
            >
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
            <button 
              onClick={() => navigate('/dashboard/branches')} 
              className="w-full text-left p-3 rounded-lg bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
            >
              <div className="flex items-center">
                <span className="text-xl mr-3">🏢</span>
                <div>
                  <p className="font-medium text-gray-900 dark:text-white">Manage Branches</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Oversee branch operations</p>
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
