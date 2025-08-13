import React from 'react';
import { Link } from 'react-router-dom';
import { useTheme } from '../App';

const Navbar = () => {
  const { darkMode, toggleDarkMode } = useTheme();

  return (
    <nav className="bg-white dark:bg-gray-800 shadow-lg transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center">
              <div className="flex-shrink-0">
                <h1 className="text-2xl font-bold text-primary-600 dark:text-primary-400">
                  AUSY EXPO
                </h1>
              </div>
            </Link>
          </div>

          {/* Centered Navigation Links */}
          <div className="hidden md:flex items-center justify-center flex-1">
            <div className="flex items-baseline space-x-8">
              <Link
                to="/"
                className="text-gray-900 dark:text-white hover:text-primary-600 dark:hover:text-primary-400 px-3 py-2 rounded-md text-lg font-medium transition-colors"
              >
                Home
              </Link>
              <Link
                to="/about"
                className="text-gray-900 dark:text-white hover:text-primary-600 dark:hover:text-primary-400 px-3 py-2 rounded-md text-lg font-medium transition-colors"
              >
                About
              </Link>
              <Link
                to="/services"
                className="text-gray-900 dark:text-white hover:text-primary-600 dark:hover:text-primary-400 px-3 py-2 rounded-md text-lg font-medium transition-colors"
              >
                Services
              </Link>
              <Link
                to="/contact"
                className="text-gray-900 dark:text-white hover:text-primary-600 dark:hover:text-primary-400 px-3 py-2 rounded-md text-lg font-medium transition-colors"
              >
                Contact
              </Link>
            </div>
          </div>

          {/* Right Side - Theme Toggle and Auth Buttons */}
          <div className="flex items-center space-x-4">
            <button
              onClick={toggleDarkMode}
              className="p-2 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
            >
              {darkMode ? '☀️' : '🌙'}
            </button>
            
            <div className="flex space-x-3">
              <Link
                to="/login"
                className="bg-primary-600 hover:bg-primary-700 text-white px-6 py-3 rounded-lg text-base font-medium transition-colors"
              >
                Login
              </Link>
              <Link
                to="/signup"
                className="bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-900 dark:text-white px-6 py-3 rounded-lg text-base font-medium transition-colors"
              >
                Sign Up
              </Link>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
