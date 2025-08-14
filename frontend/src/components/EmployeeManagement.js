import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';

const EmployeeManagement = () => {
    const [employees, setEmployees] = useState([]);
    const [departments, setDepartments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [currentEmployee, setCurrentEmployee] = useState({
        id: '',
        firstName: '',
        lastName: '',
        dateOfBirth: '',
        gender: 'MALE',
        contactInformation: '',
        departmentId: ''
    });
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedDepartment, setSelectedDepartment] = useState('');

    const token = localStorage.getItem('token');

    const fetchEmployees = async () => {
        try {
            setLoading(true);
            const token = localStorage.getItem('token');
            const response = await fetch('http://localhost:8080/api/employees', {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            if (response.ok) {
                const data = await response.json();
                setEmployees(data);
            } else {
                toast.error('Failed to load employees');
                setEmployees([]);
            }
        } catch (error) {
            console.error('Error loading employees:', error);
            toast.error('Failed to load employees');
            setEmployees([]);
        } finally {
            setLoading(false);
        }
    };

    const fetchDepartments = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch('http://localhost:8080/api/departments', {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            if (response.ok) {
                const data = await response.json();
                setDepartments(data);
            } else {
                toast.error('Failed to load departments');
                setDepartments([]);
            }
        } catch (error) {
            console.error('Error loading departments:', error);
            toast.error('Failed to load departments');
            setDepartments([]);
        }
    };

    useEffect(() => {
        fetchEmployees();
        fetchDepartments();
    }, []);

    const resetForm = () => {
        setCurrentEmployee({
            id: '',
            firstName: '',
            lastName: '',
            dateOfBirth: '',
            gender: 'MALE',
            contactInformation: '',
            departmentId: ''
        });
        setIsEditing(false);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!currentEmployee.firstName.trim() || !currentEmployee.lastName.trim()) {
            toast.error('First name and last name are required');
            return;
        }

        if (!currentEmployee.dateOfBirth) {
            toast.error('Date of birth is required');
            return;
        }

        if (!currentEmployee.contactInformation.trim()) {
            toast.error('Contact information is required');
            return;
        }

        try {
            const token = localStorage.getItem('token');
            const employeeData = {
                firstName: currentEmployee.firstName.trim(),
                lastName: currentEmployee.lastName.trim(),
                dateOfBirth: currentEmployee.dateOfBirth,
                gender: currentEmployee.gender,
                contactInformation: currentEmployee.contactInformation.trim(),
                department: currentEmployee.departmentId ? 
                    departments.find(dept => dept.id === parseInt(currentEmployee.departmentId)) : null
            };

            const url = isEditing 
                ? `http://localhost:8080/api/employees/${currentEmployee.id}`
                : 'http://localhost:8080/api/employees';
            
            const method = isEditing ? 'PUT' : 'POST';

            const response = await fetch(url, {
                method: method,
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(employeeData)
            });

            if (response.ok) {
                toast.success(isEditing ? 'Employee updated successfully!' : 'Employee created successfully!');
                setShowModal(false);
                resetForm();
                fetchEmployees();
            } else {
                const errorText = await response.text();
                toast.error(errorText || 'Failed to save employee');
            }
        } catch (error) {
            console.error('Error saving employee:', error);
            toast.error('Failed to save employee');
        }
    };

    const handleEdit = (employee) => {
        setCurrentEmployee({
            id: employee.id,
            firstName: employee.firstName,
            lastName: employee.lastName,
            dateOfBirth: employee.dateOfBirth,
            gender: employee.gender,
            contactInformation: employee.contactInformation,
            departmentId: employee.department?.id || ''
        });
        setIsEditing(true);
        setShowModal(true);
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this employee?')) {
            try {
                const token = localStorage.getItem('token');
                const response = await fetch(`http://localhost:8080/api/employees/${id}`, {
                    method: 'DELETE',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                });

                if (response.ok) {
                    toast.success('Employee deleted successfully!');
                    fetchEmployees();
                } else {
                    const errorText = await response.text();
                    toast.error(errorText || 'Failed to delete employee');
                }
            } catch (error) {
                console.error('Error deleting employee:', error);
                toast.error('Failed to delete employee');
            }
        }
    };

    const getDepartmentName = (departmentId) => {
        const department = departments.find(dept => dept.id === departmentId);
        return department ? department.name : 'No Department';
    };

    const filteredEmployees = employees.filter(employee => {
        const matchesSearch = 
            employee.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            employee.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            employee.contactInformation.toLowerCase().includes(searchTerm.toLowerCase());
        
        const matchesDepartment = selectedDepartment === '' || 
            (employee.department && employee.department.id.toString() === selectedDepartment);

        return matchesSearch && matchesDepartment;
    });

    if (loading) {
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
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Employee Management</h1>
                    <button
                        onClick={() => {
                            resetForm();
                            setShowModal(true);
                        }}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
                    >
                        Add Employee
                    </button>
                </div>

                {/* Search and Filter Section */}
                <div className="mb-6 grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Search Employees
                        </label>
                        <input
                            type="text"
                            placeholder="Search by name or contact..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Filter by Department
                        </label>
                        <select
                            value={selectedDepartment}
                            onChange={(e) => setSelectedDepartment(e.target.value)}
                            className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                        >
                            <option value="">All Departments</option>
                            {departments.map((department) => (
                                <option key={department.id} value={department.id}>
                                    {department.name}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div className="flex items-end">
                        <button
                            onClick={() => {
                                setSearchTerm('');
                                setSelectedDepartment('');
                            }}
                            className="w-full bg-gray-600 hover:bg-gray-700 text-white py-2 px-4 rounded-lg transition-colors"
                        >
                            Clear Filters
                        </button>
                    </div>
                </div>

                {/* Employees Table */}
                <div className="overflow-x-auto">
                    <table className="min-w-full bg-white dark:bg-gray-800">
                        <thead className="bg-gray-50 dark:bg-gray-700">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Name</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Contact</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Department</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                            {filteredEmployees.length === 0 ? (
                                <tr>
                                    <td colSpan="4" className="px-6 py-4 text-center text-gray-500 dark:text-gray-400">
                                        No employees found
                                    </td>
                                </tr>
                            ) : (
                                filteredEmployees.map((employee) => (
                                    <tr key={employee.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                                            {employee.firstName} {employee.lastName}
                                            <div className="text-xs text-gray-500 dark:text-gray-400">
                                                {employee.gender} • {new Date(employee.dateOfBirth).toLocaleDateString()}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-900 dark:text-white">
                                            {employee.contactInformation}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                                            {getDepartmentName(employee.department?.id)}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                                            <button
                                                onClick={() => handleEdit(employee)}
                                                className="text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-300"
                                            >
                                                Edit
                                            </button>
                                            <button
                                                onClick={() => handleDelete(employee.id)}
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
                    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg w-full max-w-md mx-4 max-h-screen overflow-y-auto">
                        <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">
                            {isEditing ? 'Edit Employee' : 'Add New Employee'}
                        </h2>
                        <form onSubmit={handleSubmit}>
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    First Name *
                                </label>
                                <input
                                    type="text"
                                    value={currentEmployee.firstName}
                                    onChange={(e) => setCurrentEmployee({...currentEmployee, firstName: e.target.value})}
                                    className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                                    required
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    Last Name *
                                </label>
                                <input
                                    type="text"
                                    value={currentEmployee.lastName}
                                    onChange={(e) => setCurrentEmployee({...currentEmployee, lastName: e.target.value})}
                                    className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                                    required
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    Date of Birth *
                                </label>
                                <input
                                    type="date"
                                    value={currentEmployee.dateOfBirth}
                                    onChange={(e) => setCurrentEmployee({...currentEmployee, dateOfBirth: e.target.value})}
                                    className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                                    required
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    Gender
                                </label>
                                <select
                                    value={currentEmployee.gender}
                                    onChange={(e) => setCurrentEmployee({...currentEmployee, gender: e.target.value})}
                                    className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                                >
                                    <option value="MALE">Male</option>
                                    <option value="FEMALE">Female</option>
                                    <option value="OTHER">Other</option>
                                </select>
                            </div>
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    Contact Information *
                                </label>
                                <input
                                    type="text"
                                    value={currentEmployee.contactInformation}
                                    onChange={(e) => setCurrentEmployee({...currentEmployee, contactInformation: e.target.value})}
                                    placeholder="Phone, email, or address"
                                    className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                                    required
                                />
                            </div>
                            <div className="mb-6">
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    Department
                                </label>
                                <select
                                    value={currentEmployee.departmentId}
                                    onChange={(e) => setCurrentEmployee({...currentEmployee, departmentId: e.target.value})}
                                    className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                                >
                                    <option value="">No Department</option>
                                    {departments.map((department) => (
                                        <option key={department.id} value={department.id}>
                                            {department.name}
                                        </option>
                                    ))}
                                </select>
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

export default EmployeeManagement;
