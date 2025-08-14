import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';

const TransportationManagement = () => {
    const [vehicles, setVehicles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [branches, setBranches] = useState([]);
    const [currentVehicle, setCurrentVehicle] = useState({
        id: '',
        vehicleType: '',
        vehicleNumber: '',
        driverName: '',
        driverContact: '',
        capacity: '',
        description: '',
        maintenanceDetails: '',
        isActive: true
    });
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedBranch, setSelectedBranch] = useState('');
    const [selectedVehicleType, setSelectedVehicleType] = useState('');
    const [selectedStatus, setSelectedStatus] = useState('');

    const vehicleTypes = ['Truck', 'Van', 'Container', 'Trailer', 'Pickup', 'Other'];

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

    const fetchVehicles = async () => {
        try {
            setLoading(true);
            const data = await apiCall('/transportation');
            setVehicles(data);
        } catch (error) {
            toast.error('Failed to fetch vehicles: ' + error.message);
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
        fetchVehicles();
        fetchBranches();
    }, []);

    const resetForm = () => {
        setCurrentVehicle({
            id: '',
            vehicleType: '',
            vehicleNumber: '',
            driverName: '',
            driverContact: '',
            capacity: '',
            description: '',
            maintenanceDetails: '',
            isActive: true
        });
        setIsEditing(false);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!currentVehicle.vehicleType.trim()) {
            toast.error('Vehicle type is required');
            return;
        }
        
        if (!currentVehicle.vehicleNumber.trim()) {
            toast.error('Vehicle number is required');
            return;
        }
        
        if (!currentVehicle.driverName.trim()) {
            toast.error('Driver name is required');
            return;
        }

        try {
            const vehicleData = {
                vehicleType: currentVehicle.vehicleType.trim(),
                vehicleNumber: currentVehicle.vehicleNumber.trim(),
                driverName: currentVehicle.driverName.trim(),
                driverContact: currentVehicle.driverContact.trim(),
                capacity: currentVehicle.capacity ? parseFloat(currentVehicle.capacity) : null,
                description: currentVehicle.description.trim(),
                maintenanceDetails: currentVehicle.maintenanceDetails.trim(),
                isActive: currentVehicle.isActive
            };

            if (isEditing) {
                await apiCall(`/transportation/${currentVehicle.id}`, {
                    method: 'PUT',
                    body: JSON.stringify(vehicleData),
                });
                toast.success('Vehicle updated successfully!');
            } else {
                await apiCall('/transportation', {
                    method: 'POST',
                    body: JSON.stringify(vehicleData),
                });
                toast.success('Vehicle created successfully!');
            }

            setShowModal(false);
            resetForm();
            fetchVehicles();
        } catch (error) {
            toast.error(isEditing ? 'Failed to update vehicle: ' + error.message : 'Failed to create vehicle: ' + error.message);
        }
    };

    const handleEdit = (vehicle) => {
        setCurrentVehicle({
            id: vehicle.id,
            vehicleType: vehicle.vehicleType || '',
            vehicleNumber: vehicle.vehicleNumber || '',
            driverName: vehicle.driverName || '',
            driverContact: vehicle.driverContact || '',
            capacity: vehicle.capacity || '',
            description: vehicle.description || '',
            maintenanceDetails: vehicle.maintenanceDetails || '',
            isActive: vehicle.isActive !== undefined ? vehicle.isActive : true
        });
        setIsEditing(true);
        setShowModal(true);
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this vehicle?')) {
            try {
                await apiCall(`/transportation/${id}`, {
                    method: 'DELETE',
                });
                toast.success('Vehicle deleted successfully!');
                fetchVehicles();
            } catch (error) {
                toast.error('Failed to delete vehicle: ' + error.message);
            }
        }
    };

    const handleSearch = async () => {
        try {
            setLoading(true);
            let url = '/transportation/search?';
            const params = new URLSearchParams();
            
            if (searchTerm.trim()) {
                params.append('driverName', searchTerm.trim());
            }
            if (selectedBranch) {
                params.append('branchId', selectedBranch);
            }
            if (selectedVehicleType) {
                params.append('vehicleType', selectedVehicleType);
            }
            if (selectedStatus !== '') {
                params.append('isActive', selectedStatus);
            }
            
            url += params.toString();
            const data = await apiCall(url);
            setVehicles(data);
        } catch (error) {
            toast.error('Search failed: ' + error.message);
        } finally {
            setLoading(false);
        }
    };

    const clearSearch = () => {
        setSearchTerm('');
        setSelectedBranch('');
        setSelectedVehicleType('');
        setSelectedStatus('');
        fetchVehicles();
    };

    const getBranchName = (branchId) => {
        const branch = branches.find(b => b.id === branchId);
        return branch ? branch.name : 'Unknown';
    };

    if (loading && vehicles.length === 0) {
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
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Transportation Management</h1>
                    <button
                        onClick={() => {
                            resetForm();
                            setShowModal(true);
                        }}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
                    >
                        Add Vehicle
                    </button>
                </div>

                {/* Search and Filter Section */}
                <div className="mb-6 grid grid-cols-1 md:grid-cols-5 gap-4">
                    <input
                        type="text"
                        placeholder="Search by driver name..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                    />
                    <select
                        value={selectedVehicleType}
                        onChange={(e) => setSelectedVehicleType(e.target.value)}
                        className="border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                    >
                        <option value="">All Vehicle Types</option>
                        {vehicleTypes.map(type => (
                            <option key={type} value={type}>{type}</option>
                        ))}
                    </select>
                    <select
                        value={selectedStatus}
                        onChange={(e) => setSelectedStatus(e.target.value)}
                        className="border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                    >
                        <option value="">All Status</option>
                        <option value="true">Active</option>
                        <option value="false">Inactive</option>
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

                {/* Vehicles Table */}
                <div className="overflow-x-auto">
                    <table className="min-w-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
                        <thead className="bg-gray-50 dark:bg-gray-700">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Vehicle Number</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Type</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Driver</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Contact</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Branch</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Capacity</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Status</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                            {vehicles.length === 0 ? (
                                <tr>
                                    <td colSpan="8" className="px-6 py-4 text-center text-gray-500 dark:text-gray-400">
                                        No vehicles found
                                    </td>
                                </tr>
                            ) : (
                                vehicles.map((vehicle) => (
                                    <tr key={vehicle.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                                            {vehicle.vehicleNumber}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                                            {vehicle.vehicleType}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                                            {vehicle.driverName || 'N/A'}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                                            {vehicle.driverContact || 'N/A'}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                                            {getBranchName(vehicle.branch?.id)}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                                            {vehicle.capacity ? vehicle.capacity + ' tons' : 'N/A'}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                                vehicle.isActive 
                                                    ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' 
                                                    : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                                            }`}>
                                                {vehicle.isActive ? 'Active' : 'Inactive'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                                            <button
                                                onClick={() => handleEdit(vehicle)}
                                                className="text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-300"
                                            >
                                                Edit
                                            </button>
                                            <button
                                                onClick={() => handleDelete(vehicle.id)}
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
                    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg w-full max-w-2xl mx-4 max-h-screen overflow-y-auto">
                        <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">
                            {isEditing ? 'Edit Vehicle' : 'Add New Vehicle'}
                        </h2>
                        <form onSubmit={handleSubmit}>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="mb-4">
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        Vehicle Type *
                                    </label>
                                    <select
                                        value={currentVehicle.vehicleType}
                                        onChange={(e) => setCurrentVehicle({...currentVehicle, vehicleType: e.target.value})}
                                        className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                                        required
                                    >
                                        <option value="">Select Vehicle Type</option>
                                        {vehicleTypes.map(type => (
                                            <option key={type} value={type}>{type}</option>
                                        ))}
                                    </select>
                                </div>
                                <div className="mb-4">
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        Vehicle Number *
                                    </label>
                                    <input
                                        type="text"
                                        value={currentVehicle.vehicleNumber}
                                        onChange={(e) => setCurrentVehicle({...currentVehicle, vehicleNumber: e.target.value})}
                                        className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                                        required
                                    />
                                </div>
                                <div className="mb-4">
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        Driver Name *
                                    </label>
                                    <input
                                        type="text"
                                        value={currentVehicle.driverName}
                                        onChange={(e) => setCurrentVehicle({...currentVehicle, driverName: e.target.value})}
                                        className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                                        required
                                    />
                                </div>
                                <div className="mb-4">
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        Driver Contact
                                    </label>
                                    <input
                                        type="text"
                                        value={currentVehicle.driverContact}
                                        onChange={(e) => setCurrentVehicle({...currentVehicle, driverContact: e.target.value})}
                                        className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                                    />
                                </div>
                                <div className="mb-4">
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        Capacity (tons)
                                    </label>
                                    <input
                                        type="number"
                                        step="0.1"
                                        min="0"
                                        value={currentVehicle.capacity}
                                        onChange={(e) => setCurrentVehicle({...currentVehicle, capacity: e.target.value})}
                                        className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                                    />
                                </div>
                            </div>
                            
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    Description
                                </label>
                                <textarea
                                    value={currentVehicle.description}
                                    onChange={(e) => setCurrentVehicle({...currentVehicle, description: e.target.value})}
                                    className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                                    rows="3"
                                />
                            </div>
                            
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    Maintenance Details
                                </label>
                                <textarea
                                    value={currentVehicle.maintenanceDetails}
                                    onChange={(e) => setCurrentVehicle({...currentVehicle, maintenanceDetails: e.target.value})}
                                    className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                                    rows="3"
                                />
                            </div>
                            
                            <div className="mb-6">
                                <label className="flex items-center">
                                    <input
                                        type="checkbox"
                                        checked={currentVehicle.isActive}
                                        onChange={(e) => setCurrentVehicle({...currentVehicle, isActive: e.target.checked})}
                                        className="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                                    />
                                    <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">Active</span>
                                </label>
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

export default TransportationManagement;
