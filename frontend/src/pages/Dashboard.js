import React, { useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '../App';

// Import Dashboard Components
import DashboardLayout from '../components/dashboard/DashboardLayout';
import AdminDashboard from '../components/dashboard/AdminDashboard';
import ManagerDashboard from '../components/dashboard/ManagerDashboard';
import OwnerDashboard from '../components/dashboard/OwnerDashboard';
import SupplierDashboard from '../components/dashboard/SupplierDashboard';
import BuyerDashboard from '../components/dashboard/BuyerDashboard';

// Import Management Components
import UserManagement from '../components/UserManagement';
import BranchManagement from '../components/BranchManagement';
import StockManagement from '../components/StockManagement';
import DepartmentManagement from '../components/DepartmentManagement';
import TransportationManagement from '../components/TransportationManagement';
import SupplyManagement from '../components/SupplyManagement';
import OrderManagement from '../components/OrderManagement';
import AgreementManagement from '../components/AgreementManagement';
import CommandManagement from '../components/CommandManagement';
import EmployeeManagement from '../components/EmployeeManagement';
import SystemReports from '../components/AdminReports';

const Dashboard = () => {
  const { user } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  if (!user) {
    return <Navigate to="/login" />;
  }

  const getDashboardComponent = () => {
    switch (user.role) {
      case 'ADMIN':
        return <AdminDashboard />;
      case 'OWNER':
        return <OwnerDashboard />;
      case 'MANAGER':
        return <ManagerDashboard />;
      case 'SUPPLIER':
        return <SupplierDashboard />;
      case 'BUYER':
        return <BuyerDashboard />;
      default:
        return (
          <div className="p-6">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Dashboard</h1>
            <p className="text-gray-600 dark:text-gray-400 mt-2">Welcome to your dashboard!</p>
          </div>
        );
    }
  };

  return (
    <DashboardLayout sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen}>
      <Routes>
        <Route path="/" element={getDashboardComponent()} />
        
        {/* Admin Routes */}
        {user.role === 'ADMIN' && (
          <>
            <Route path="/add-user" element={<UserManagement />} />
            <Route path="/branches" element={<BranchManagement />} />
            <Route path="/users" element={<UserManagement />} />
            <Route path="/commands" element={<CommandManagement />} />
            <Route path="/reports" element={<SystemReports />} />
          </>
        )}
        
        {/* Owner Routes */}
        {user.role === 'OWNER' && (
          <>
            <Route path="/users" element={<UserManagement />} />
            <Route path="/branches" element={<BranchManagement />} />
            <Route path="/orders" element={<OrderManagement />} />
            <Route path="/agreements" element={<AgreementManagement />} />
            <Route path="/commands" element={<CommandManagement />} />
            <Route path="/reports" element={<SystemReports />} />
          </>
        )}
        
        {/* Manager Routes */}
        {(user.role === 'MANAGER' || user.role === 'ADMIN' || user.role === 'OWNER') && (
          <>
            <Route path="/employees" element={<EmployeeManagement />} />
            <Route path="/stock" element={<StockManagement />} />
            <Route path="/departments" element={<DepartmentManagement />} />
            <Route path="/transportation" element={<TransportationManagement />} />
            <Route path="/supplies" element={<SupplyManagement />} />
            <Route path="/orders" element={<OrderManagement />} />
            <Route path="/commands" element={<CommandManagement />} />
            <Route path="/reports" element={<SystemReports />} />
          </>
        )}
        
        {/* Catch all route */}
        <Route path="*" element={<Navigate to="/dashboard" />} />
      </Routes>
    </DashboardLayout>
  );
};

export default Dashboard;
