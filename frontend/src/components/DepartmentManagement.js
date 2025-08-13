import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';

const DepartmentManagement = () => {
    const [departments, setDepartments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [branches, setBranches] = useState([]);
    const [currentDepartment, setCurrentDepartment] = useState({
        id: '',
        name: '',
        description: '',
        branchId: '',
        budget: ''
    });
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedBranch, setSelectedBranch] = useState('');

    const token = localStorage.getItem('token');

    const apiCall = async (url, options = {}) => {
        const response = await fetch(`http://localhost:8080/api${url}`, {
            ...options,
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
                ...options.headers,
            },
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(errorText || `HTTP error! status: ${response.status}`);
        }

        if (response.status === 204) {
            return null;
        }

        return response.json();
    };

    const fetchDepartments = async () => {
        try {
            setLoading(true);
            const data = await apiCall('/departments');
            setDepartments(data);
        } catch (error) {
            toast.error('Failed to fetch departments: ' + error.message);
        } finally {
            setLoading(false);
        }
    };

    const fetchBranches = async () => {
        try {
            const data = await apiCall('/branches');
            setBranches(data);
        } catch (error) {
            toast.error('Failed to fetch branches: ' + error.message);
        }
    };

    useEffect(() => {
        fetchDepartments();
        fetchBranches();
    }, []);

    const resetForm = () => {
        setCurrentDepartment({
            id: '',
            name: '',
            description: '',
            branchId: '',
            budget: ''
        });
        setIsEditing(false);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!currentDepartment.name.trim()) {
            toast.error('Department name is required');
            return;
        }
        
        if (!currentDepartment.branchId) {
            toast.error('Branch selection is required');
            return;
        }

        try {
            const departmentData = {
                name: currentDepartment.name.trim(),
                description: currentDepartment.description.trim(),
                branch: { id: parseInt(currentDepartment.branchId) },
                budget: currentDepartment.budget ? parseFloat(currentDepartment.budget) : 0
            };

            if (isEditing) {
                await apiCall(`/departments/${currentDepartment.id}`, {
                    method: 'PUT',
                    body: JSON.stringify(departmentData),
                });
                toast.success('Department updated successfully!');
            } else {
                await apiCall('/departments', {
                    method: 'POST',
                    body: JSON.stringify(departmentData),
                });
                toast.success('Department created successfully!');
            }

            setShowModal(false);
            resetForm();
            fetchDepartments();
        } catch (error) {
            toast.error(isEditing ? 'Failed to update department: ' + error.message : 'Failed to create department: ' + error.message);
        }
    };

    const handleEdit = (department) => {
        setCurrentDepartment({
            id: department.id,
            name: department.name,
            description: department.description || '',
            branchId: department.branch?.id || '',
            budget: department.budget || ''
        });
        setIsEditing(true);
        setShowModal(true);
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this department?')) {
            try {
                await apiCall(`/departments/${id}`, {
                    method: 'DELETE',
                });
                toast.success('Department deleted successfully!');
                fetchDepartments();
            } catch (error) {
                toast.error('Failed to delete department: ' + error.message);
            }
        }
    };

    const handleSearch = async () => {
        try {
            setLoading(true);
            let url = '/departments/search?';
            const params = new URLSearchParams();
            
            if (searchTerm.trim()) {
                params.append('name', searchTerm.trim());
            }
            if (selectedBranch) {
                params.append('branchId', selectedBranch);
            }
            
            url += params.toString();
            const data = await apiCall(url);
            setDepartments(data);
        } catch (error) {
            toast.error('Search failed: ' + error.message);
        } finally {
            setLoading(false);
        }
    };

    const clearSearch = () => {
        setSearchTerm('');
        setSelectedBranch('');
        fetchDepartments();
    };

    const getBranchName = (branchId) => {
        const branch = branches.find(b => b.id === branchId);
        return branch ? branch.name : 'Unknown';
    };

    if (loading && departments.length === 0) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Department Management</h1>
                    <button
                        onClick={() => {
                            resetForm();
                            setShowModal(true);
                        }}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
                    >
                        Add Department
                    </button>
                </div>

                {/* Search and Filter Section */}
                <div className="mb-6 grid grid-cols-1 md:grid-cols-4 gap-4">
                    <input
                        type="text"
                        placeholder="Search by name..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                    />
                    <select
                        value={selectedBranch}
                        onChange={(e) => setSelectedBranch(e.target.value)}
                        className="border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                    >
                        <option value="">All Branches</option>
                        {branches.map(branch => (
                            <option key={branch.id} value={branch.id}>{branch.name}</option>
                        ))}
                    </select>
                    <button
                        onClick={handleSearch}
                        className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors"
                    >
                        Search
                    </button>
                    <button
                        onClick={clearSearch}
                        className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg transition-colors"
                    >
                        Clear
                    </button>
                </div>

                {/* Departments Table */}
                <div className="overflow-x-auto">
                    <table className="min-w-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
                        <thead className="bg-gray-50 dark:bg-gray-700">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Name</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Description</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Branch</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Budget</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                            {departments.length === 0 ? (
                                <tr>
                                    <td colSpan="5" className="px-6 py-4 text-center text-gray-500 dark:text-gray-400">
                                        No departments found
                                    </td>
                                </tr>
                            ) : (
                                departments.map((department) => (
                                    <tr key={department.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                                            {department.name}
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-900 dark:text-white">
                                            {department.description || 'N/A'}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                                            {getBranchName(department.branch?.id)}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                                            ${department.budget?.toLocaleString() || '0'}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                                            <button
                                                onClick={() => handleEdit(department)}
                                                className="text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-300"
                                            >
                                                Edit
                                            </button>
                                            <button
                                                onClick={() => handleDelete(department.id)}
                                                className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
                                            >
                                                Delete
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg w-full max-w-md mx-4">
                        <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">
                            {isEditing ? 'Edit Department' : 'Add New Department'}
                        </h2>
                        <form onSubmit={handleSubmit}>
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    Department Name *
                                </label>
                                <input
                                    type="text"
                                    value={currentDepartment.name}
                                    onChange={(e) => setCurrentDepartment({...currentDepartment, name: e.target.value})}
                                    className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                                    required
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    Description
                                </label>
                                <textarea
                                    value={currentDepartment.description}
                                    onChange={(e) => setCurrentDepartment({...currentDepartment, description: e.target.value})}
                                    className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                                    rows="3"
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    Branch *
                                </label>
                                <select
                                    value={currentDepartment.branchId}
                                    onChange={(e) => setCurrentDepartment({...currentDepartment, branchId: e.target.value})}
                                    className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                                    required
                                >
                                    <option value="">Select Branch</option>
                                    {branches.map(branch => (
                                        <option key={branch.id} value={branch.id}>{branch.name}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="mb-6">
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    Budget
                                </label>
                                <input
                                    type="number"
                                    step="0.01"
                                    min="0"
                                    value={currentDepartment.budget}
                                    onChange={(e) => setCurrentDepartment({...currentDepartment, budget: e.target.value})}
                                    className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                                />
                            </div>
                            <div className="flex space-x-4">
                                <button
                                    type="submit"
                                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg transition-colors"
                                >
                                    {isEditing ? 'Update' : 'Create'}
                                </button>
                                <button
                                    type="button"
                                    onClick={() => {
                                        setShowModal(false);
                                        resetForm();
                                    }}
                                    className="flex-1 bg-gray-600 hover:bg-gray-700 text-white py-2 px-4 rounded-lg transition-colors"
                                >
                                    Cancel
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default DepartmentManagement;
