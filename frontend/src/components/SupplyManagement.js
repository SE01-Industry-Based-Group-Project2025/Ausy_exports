import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';

const SupplyManagement = () => {
    const [supplies, setSupplies] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [branches, setBranches] = useState([]);
    const [currentSupply, setCurrentSupply] = useState({
        id: '',
        itemName: '',
        supplierName: '',
        supplierContact: '',
        category: '',
        status: 'PENDING',
        description: '',
        unit: '',
        quantity: '',
        unitPrice: '',
        minimumQuantity: '',
        branchId: ''
    });
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedBranch, setSelectedBranch] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('');
    const [selectedStatus, setSelectedStatus] = useState('');

    const categories = ['GENERAL', 'RAW_MATERIALS', 'EQUIPMENT', 'PACKAGING', 'OFFICE_SUPPLIES', 'MAINTENANCE'];
    const statuses = ['PENDING', 'APPROVED', 'ORDERED', 'DELIVERED', 'COMPLETED', 'CANCELLED'];
    const units = ['PCS', 'KG', 'TONS', 'METERS', 'LITERS', 'BOXES', 'SETS'];

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

    const fetchSupplies = async () => {
        try {
            setLoading(true);
            const data = await apiCall('/supplies');
            setSupplies(data);
        } catch (error) {
            toast.error('Failed to fetch supplies: ' + error.message);
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
        fetchSupplies();
        fetchBranches();
    }, []);

    const resetForm = () => {
        setCurrentSupply({
            id: '',
            itemName: '',
            supplierName: '',
            supplierContact: '',
            category: '',
            status: 'PENDING',
            description: '',
            unit: '',
            quantity: '',
            unitPrice: '',
            minimumQuantity: '',
            branchId: ''
        });
        setIsEditing(false);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!currentSupply.itemName.trim()) {
            toast.error('Item name is required');
            return;
        }
        
        if (!currentSupply.supplierName.trim()) {
            toast.error('Supplier name is required');
            return;
        }
        
        if (!currentSupply.quantity || currentSupply.quantity <= 0) {
            toast.error('Quantity must be greater than 0');
            return;
        }
        
        if (!currentSupply.unitPrice || currentSupply.unitPrice < 0) {
            toast.error('Unit price must be 0 or greater');
            return;
        }
        
        if (!currentSupply.branchId) {
            toast.error('Branch selection is required');
            return;
        }

        try {
            const supplyData = {
                itemName: currentSupply.itemName.trim(),
                supplierName: currentSupply.supplierName.trim(),
                supplierContact: currentSupply.supplierContact.trim(),
                category: currentSupply.category || 'GENERAL',
                status: currentSupply.status || 'PENDING',
                description: currentSupply.description.trim(),
                unit: currentSupply.unit.trim(),
                quantity: parseInt(currentSupply.quantity),
                unitPrice: parseFloat(currentSupply.unitPrice),
                minimumQuantity: currentSupply.minimumQuantity ? parseInt(currentSupply.minimumQuantity) : 0,
                branch: { id: parseInt(currentSupply.branchId) }
            };

            if (isEditing) {
                await apiCall(`/supplies/${currentSupply.id}`, {
                    method: 'PUT',
                    body: JSON.stringify(supplyData),
                });
                toast.success('Supply updated successfully!');
            } else {
                await apiCall('/supplies', {
                    method: 'POST',
                    body: JSON.stringify(supplyData),
                });
                toast.success('Supply created successfully!');
            }

            setShowModal(false);
            resetForm();
            fetchSupplies();
        } catch (error) {
            toast.error(isEditing ? 'Failed to update supply: ' + error.message : 'Failed to create supply: ' + error.message);
        }
    };

    const handleEdit = (supply) => {
        setCurrentSupply({
            id: supply.id,
            itemName: supply.itemName || '',
            supplierName: supply.supplierName || '',
            supplierContact: supply.supplierContact || '',
            category: supply.category || '',
            status: supply.status || 'PENDING',
            description: supply.description || '',
            unit: supply.unit || '',
            quantity: supply.quantity || '',
            unitPrice: supply.unitPrice || '',
            minimumQuantity: supply.minimumQuantity || '',
            branchId: supply.branch?.id || ''
        });
        setIsEditing(true);
        setShowModal(true);
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this supply?')) {
            try {
                await apiCall(`/supplies/${id}`, {
                    method: 'DELETE',
                });
                toast.success('Supply deleted successfully!');
                fetchSupplies();
            } catch (error) {
                toast.error('Failed to delete supply: ' + error.message);
            }
        }
    };

    const handleStatusUpdate = async (id, newStatus) => {
        try {
            await apiCall(`/supplies/${id}/status?status=${newStatus}`, {
                method: 'PUT',
            });
            toast.success('Supply status updated successfully!');
            fetchSupplies();
        } catch (error) {
            toast.error('Failed to update status: ' + error.message);
        }
    };

    const handleSearch = async () => {
        try {
            setLoading(true);
            let url = '/supplies/search?';
            const params = new URLSearchParams();
            
            if (searchTerm.trim()) {
                params.append('itemName', searchTerm.trim());
            }
            if (selectedBranch) {
                params.append('branchId', selectedBranch);
            }
            if (selectedCategory) {
                params.append('category', selectedCategory);
            }
            if (selectedStatus) {
                params.append('status', selectedStatus);
            }
            
            url += params.toString();
            const data = await apiCall(url);
            setSupplies(data);
        } catch (error) {
            toast.error('Search failed: ' + error.message);
        } finally {
            setLoading(false);
        }
    };

    const clearSearch = () => {
        setSearchTerm('');
        setSelectedBranch('');
        setSelectedCategory('');
        setSelectedStatus('');
        fetchSupplies();
    };

    const getBranchName = (branchId) => {
        const branch = branches.find(b => b.id === branchId);
        return branch ? branch.name : 'Unknown';
    };

    const getStatusColor = (status) => {
        const colors = {
            'PENDING': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
            'APPROVED': 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
            'ORDERED': 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200',
            'DELIVERED': 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200',
            'COMPLETED': 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
            'CANCELLED': 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
        };
        return colors[status] || 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    };

    if (loading && supplies.length === 0) {
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
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Supply Management</h1>
                    <button
                        onClick={() => {
                            resetForm();
                            setShowModal(true);
                        }}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
                    >
                        Add Supply Request
                    </button>
                </div>

                {/* Search and Filter Section */}
                <div className="mb-6 grid grid-cols-1 md:grid-cols-6 gap-4">
                    <input
                        type="text"
                        placeholder="Search by item name..."
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
                    <select
                        value={selectedCategory}
                        onChange={(e) => setSelectedCategory(e.target.value)}
                        className="border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                    >
                        <option value="">All Categories</option>
                        {categories.map(category => (
                            <option key={category} value={category}>{category.replace('_', ' ')}</option>
                        ))}
                    </select>
                    <select
                        value={selectedStatus}
                        onChange={(e) => setSelectedStatus(e.target.value)}
                        className="border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                    >
                        <option value="">All Status</option>
                        {statuses.map(status => (
                            <option key={status} value={status}>{status}</option>
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

                {/* Supplies Table */}
                <div className="overflow-x-auto">
                    <table className="min-w-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
                        <thead className="bg-gray-50 dark:bg-gray-700">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Item</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Supplier</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Category</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Quantity</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Unit Price</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Total</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Status</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Branch</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                            {supplies.length === 0 ? (
                                <tr>
                                    <td colSpan="9" className="px-6 py-4 text-center text-gray-500 dark:text-gray-400">
                                        No supplies found
                                    </td>
                                </tr>
                            ) : (
                                supplies.map((supply) => (
                                    <tr key={supply.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                                            {supply.itemName}
                                            {supply.unit && <span className="text-gray-500"> ({supply.unit})</span>}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                                            <div>
                                                <div>{supply.supplierName}</div>
                                                {supply.supplierContact && (
                                                    <div className="text-xs text-gray-500">{supply.supplierContact}</div>
                                                )}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                                            {supply.category ? supply.category.replace('_', ' ') : 'N/A'}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                                            {supply.quantity}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                                            ${supply.unitPrice?.toFixed(2) || '0.00'}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                                            ${supply.totalCost?.toFixed(2) || '0.00'}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <select
                                                value={supply.status || 'PENDING'}
                                                onChange={(e) => handleStatusUpdate(supply.id, e.target.value)}
                                                className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border-0 ${getStatusColor(supply.status)}`}
                                            >
                                                {statuses.map(status => (
                                                    <option key={status} value={status}>{status}</option>
                                                ))}
                                            </select>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                                            {getBranchName(supply.branch?.id)}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                                            <button
                                                onClick={() => handleEdit(supply)}
                                                className="text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-300"
                                            >
                                                Edit
                                            </button>
                                            <button
                                                onClick={() => handleDelete(supply.id)}
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
                            {isEditing ? 'Edit Supply Request' : 'Add New Supply Request'}
                        </h2>
                        <form onSubmit={handleSubmit}>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="mb-4">
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        Item Name *
                                    </label>
                                    <input
                                        type="text"
                                        value={currentSupply.itemName}
                                        onChange={(e) => setCurrentSupply({...currentSupply, itemName: e.target.value})}
                                        className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                                        required
                                    />
                                </div>
                                <div className="mb-4">
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        Supplier Name *
                                    </label>
                                    <input
                                        type="text"
                                        value={currentSupply.supplierName}
                                        onChange={(e) => setCurrentSupply({...currentSupply, supplierName: e.target.value})}
                                        className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                                        required
                                    />
                                </div>
                                <div className="mb-4">
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        Supplier Contact
                                    </label>
                                    <input
                                        type="text"
                                        value={currentSupply.supplierContact}
                                        onChange={(e) => setCurrentSupply({...currentSupply, supplierContact: e.target.value})}
                                        className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                                    />
                                </div>
                                <div className="mb-4">
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        Category
                                    </label>
                                    <select
                                        value={currentSupply.category}
                                        onChange={(e) => setCurrentSupply({...currentSupply, category: e.target.value})}
                                        className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                                    >
                                        <option value="">Select Category</option>
                                        {categories.map(category => (
                                            <option key={category} value={category}>{category.replace('_', ' ')}</option>
                                        ))}
                                    </select>
                                </div>
                                <div className="mb-4">
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        Unit
                                    </label>
                                    <select
                                        value={currentSupply.unit}
                                        onChange={(e) => setCurrentSupply({...currentSupply, unit: e.target.value})}
                                        className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                                    >
                                        <option value="">Select Unit</option>
                                        {units.map(unit => (
                                            <option key={unit} value={unit}>{unit}</option>
                                        ))}
                                    </select>
                                </div>
                                <div className="mb-4">
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        Quantity *
                                    </label>
                                    <input
                                        type="number"
                                        min="1"
                                        value={currentSupply.quantity}
                                        onChange={(e) => setCurrentSupply({...currentSupply, quantity: e.target.value})}
                                        className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                                        required
                                    />
                                </div>
                                <div className="mb-4">
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        Unit Price *
                                    </label>
                                    <input
                                        type="number"
                                        step="0.01"
                                        min="0"
                                        value={currentSupply.unitPrice}
                                        onChange={(e) => setCurrentSupply({...currentSupply, unitPrice: e.target.value})}
                                        className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                                        required
                                    />
                                </div>
                                <div className="mb-4">
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        Minimum Quantity
                                    </label>
                                    <input
                                        type="number"
                                        min="0"
                                        value={currentSupply.minimumQuantity}
                                        onChange={(e) => setCurrentSupply({...currentSupply, minimumQuantity: e.target.value})}
                                        className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                                    />
                                </div>
                                <div className="mb-4">
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        Branch *
                                    </label>
                                    <select
                                        value={currentSupply.branchId}
                                        onChange={(e) => setCurrentSupply({...currentSupply, branchId: e.target.value})}
                                        className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                                        required
                                    >
                                        <option value="">Select Branch</option>
                                        {branches.map(branch => (
                                            <option key={branch.id} value={branch.id}>{branch.name}</option>
                                        ))}
                                    </select>
                                </div>
                                {isEditing && (
                                    <div className="mb-4">
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                            Status
                                        </label>
                                        <select
                                            value={currentSupply.status}
                                            onChange={(e) => setCurrentSupply({...currentSupply, status: e.target.value})}
                                            className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                                        >
                                            {statuses.map(status => (
                                                <option key={status} value={status}>{status}</option>
                                            ))}
                                        </select>
                                    </div>
                                )}
                            </div>
                            
                            <div className="mb-6 col-span-2">
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    Description
                                </label>
                                <textarea
                                    value={currentSupply.description}
                                    onChange={(e) => setCurrentSupply({...currentSupply, description: e.target.value})}
                                    className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                                    rows="3"
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

export default SupplyManagement;
