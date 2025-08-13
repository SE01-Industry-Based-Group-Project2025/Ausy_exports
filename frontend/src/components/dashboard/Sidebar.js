import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../App';

const Sidebar = () => {
  const { user } = useAuth();
  const location = useLocation();

  const getMenuItems = () => {
    const baseItems = [
      { name: 'Dashboard', href: '/dashboard', icon: '📊' }
    ];

    switch (user?.role) {
      case 'ADMIN':
        return [
          ...baseItems,
          { name: 'Add New User', href: '/dashboard/add-user', icon: '👤' },
          { name: 'View Reports', href: '/dashboard/reports', icon: '📈' },
          { name: 'Manage Branches', href: '/dashboard/branches', icon: '🏢' },
        ];
      
      case 'OWNER':
        return [
          ...baseItems,
          { name: 'Manage Users', href: '/dashboard/users', icon: '👥' },
          { name: 'Manage Branches', href: '/dashboard/branches', icon: '🏢' },
          { name: 'Activate Accounts', href: '/dashboard/activate-accounts', icon: '✅' },
          { name: 'Give Commands', href: '/dashboard/commands', icon: '📋' },
          { name: 'View Reports', href: '/dashboard/reports', icon: '📈' },
        ];
      
      case 'MANAGER':
        return [
          ...baseItems,
          { name: 'Manage Employees', href: '/dashboard/employees', icon: '👷' },
          { name: 'Manage Salary', href: '/dashboard/salary', icon: '💰' },
          { name: 'Manage Departments', href: '/dashboard/departments', icon: '🏛️' },
          { name: 'Manage Stock', href: '/dashboard/stock', icon: '📦' },
          { name: 'Manage Transportation', href: '/dashboard/transportation', icon: '🚛' },
          { name: 'Manage Supply', href: '/dashboard/supply', icon: '📋' },
        ];
      
      case 'SUPPLIER':
        return [
          ...baseItems,
          { name: 'My Supplies', href: '/dashboard/my-supplies', icon: '📦' },
          { name: 'Orders', href: '/dashboard/orders', icon: '📋' },
          { name: 'Payments', href: '/dashboard/payments', icon: '💳' },
        ];
      
      case 'BUYER':
        return [
          ...baseItems,
          { name: 'My Orders', href: '/dashboard/my-orders', icon: '🛍️' },
          { name: 'Browse Products', href: '/dashboard/products', icon: '👕' },
          { name: 'Order History', href: '/dashboard/order-history', icon: '📚' },
        ];
      
      default:
        return baseItems;
    }
  };

  const menuItems = getMenuItems();

  return (
    <div className="flex flex-col flex-1 min-h-0 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700">
      <div className="flex items-center h-16 flex-shrink-0 px-4 border-b border-gray-200 dark:border-gray-700">
        <Link to="/dashboard" className="text-xl font-bold text-primary-600 dark:text-primary-400">
          AUSY EXPO
        </Link>
      </div>
      
      <div className="flex-1 flex flex-col pt-5 pb-4 overflow-y-auto">
        <div className="flex-1 px-3 space-y-1">
          {menuItems.map((item) => {
            const isActive = location.pathname === item.href;
            return (
              <Link
                key={item.name}
                to={item.href}
                className={`${
                  isActive
                    ? 'bg-primary-100 dark:bg-primary-900 text-primary-700 dark:text-primary-300'
                    : 'text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700'
                } group flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors`}
              >
                <span className="mr-3 text-lg">{item.icon}</span>
                {item.name}
              </Link>
            );
          })}
        </div>
      </div>
      
      <div className="flex-shrink-0 flex border-t border-gray-200 dark:border-gray-700 p-4">
        <div className="flex items-center">
          <div className="h-8 w-8 bg-primary-600 rounded-full flex items-center justify-center">
            <span className="text-white font-medium text-sm">
              {user?.firstName?.charAt(0)}{user?.lastName?.charAt(0)}
            </span>
          </div>
          <div className="ml-3">
            <p className="text-sm font-medium text-gray-900 dark:text-white">
              {user?.firstName} {user?.lastName}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              {user?.role}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
