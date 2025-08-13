import React, { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';

const OrderManagement = () => {
    const [orders, setOrders] = useState([]);
    const [branches, setBranches] = useState([]);
    const [loading, setLoading] = useState(false);
    const [showForm, setShowForm] = useState(false);
    const [editingOrder, setEditingOrder] = useState(null);
    const [showFilters, setShowFilters] = useState(false);
    const [statistics, setStatistics] = useState({});

    const [filters, setFilters] = useState({
        branchId: '',
        status: '',
        priority: '',
        customerName: '',
        productName: '',
        orderNumber: ''
    });

    const [formData, setFormData] = useState({
        orderNumber: '',
        customerName: '',
        customerEmail: '',
        customerPhone: '',
        customerAddress: '',
        productName: '',
        productCategory: '',
        productDescription: '',
        quantity: '',
        unitPrice: '',
        totalAmount: '',
        status: 'PENDING',
        priority: 'MEDIUM',
        expectedDeliveryDate: '',
        paymentStatus: 'PENDING',
        paymentMethod: '',
        notes: '',
        specifications: '',
        branchId: ''
    });

    const statusOptions = ['PENDING', 'CONFIRMED', 'IN_PRODUCTION', 'READY_FOR_DELIVERY', 'DELIVERED', 'CANCELLED'];
    const priorityOptions = ['LOW', 'MEDIUM', 'HIGH', 'URGENT'];
    const paymentStatusOptions = ['PENDING', 'PARTIAL', 'PAID', 'OVERDUE'];
    const paymentMethodOptions = ['CASH', 'BANK_TRANSFER', 'CREDIT_CARD', 'CHECK', 'OTHER'];

    useEffect(() => {
        fetchOrders();
        fetchBranches();
        fetchStatistics();
    }, []);

    const fetchOrders = async () => {
        setLoading(true);
        try {
            const token = localStorage.getItem('token');
            const response = await fetch('http://localhost:8080/api/orders', {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            if (response.ok) {
                const data = await response.json();
                setOrders(data);
            } else {
                toast.error('Failed to fetch orders');
            }
        } catch (error) {
            console.error('Error fetching orders:', error);
            toast.error('Error fetching orders');
        } finally {
            setLoading(false);
        }
    };

    const fetchBranches = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch('http://localhost:8080/api/branches', {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            if (response.ok) {
                const data = await response.json();
                setBranches(data);
            }
        } catch (error) {
            console.error('Error fetching branches:', error);
        }
    };

    const fetchStatistics = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch('http://localhost:8080/api/orders/statistics', {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            if (response.ok) {
                const data = await response.json();
                setStatistics(data);
            }
        } catch (error) {
            console.error('Error fetching statistics:', error);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const token = localStorage.getItem('token');
            const dataToSend = {
                ...formData,
                quantity: parseInt(formData.quantity),
                unitPrice: parseFloat(formData.unitPrice),
                totalAmount: parseFloat(formData.totalAmount),
                branch: formData.branchId ? { id: parseInt(formData.branchId) } : null,
                expectedDeliveryDate: formData.expectedDeliveryDate ? `${formData.expectedDeliveryDate}T00:00:00` : null
            };

            const url = editingOrder 
                ? `http://localhost:8080/api/orders/${editingOrder.id}`
                : 'http://localhost:8080/api/orders';

            const method = editingOrder ? 'PUT' : 'POST';

            const response = await fetch(url, {
                method,
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(dataToSend)
            });

            if (response.ok) {
                toast.success(editingOrder ? 'Order updated successfully!' : 'Order created successfully!');
                fetchOrders();
                fetchStatistics();
                resetForm();
            } else {
                const errorData = await response.json();
                toast.error(errorData.error || 'Failed to save order');
            }
        } catch (error) {
            console.error('Error saving order:', error);
            toast.error('Error saving order');
        } finally {
            setLoading(false);
        }
    };

    const handleEdit = (order) => {
        setEditingOrder(order);
        setFormData({
            orderNumber: order.orderNumber || '',
            customerName: order.customerName || '',
            customerEmail: order.customerEmail || '',
            customerPhone: order.customerPhone || '',
            customerAddress: order.customerAddress || '',
            productName: order.productName || '',
            productCategory: order.productCategory || '',
            productDescription: order.productDescription || '',
            quantity: order.quantity || '',
            unitPrice: order.unitPrice || '',
            totalAmount: order.totalAmount || '',
            status: order.status || 'PENDING',
            priority: order.priority || 'MEDIUM',
            expectedDeliveryDate: order.expectedDeliveryDate ? order.expectedDeliveryDate.split('T')[0] : '',
            paymentStatus: order.paymentStatus || 'PENDING',
            paymentMethod: order.paymentMethod || '',
            notes: order.notes || '',
            specifications: order.specifications || '',
            branchId: order.branch?.id || ''
        });
        setShowForm(true);
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this order?')) {
            try {
                const token = localStorage.getItem('token');
                const response = await fetch(`http://localhost:8080/api/orders/${id}`, {
                    method: 'DELETE',
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });

                if (response.ok) {
                    toast.success('Order deleted successfully!');
                    fetchOrders();
                    fetchStatistics();
                } else {
                    toast.error('Failed to delete order');
                }
            } catch (error) {
                console.error('Error deleting order:', error);
                toast.error('Error deleting order');
            }
        }
    };

    const handleQuickStatusUpdate = async (orderId, newStatus) => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`http://localhost:8080/api/orders/${orderId}/status`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ status: newStatus })
            });

            if (response.ok) {
                toast.success('Order status updated successfully!');
                fetchOrders();
                fetchStatistics();
            } else {
                toast.error('Failed to update order status');
            }
        } catch (error) {
            console.error('Error updating order status:', error);
            toast.error('Error updating order status');
        }
    };

    const handleSearch = async () => {
        setLoading(true);
        try {
            const token = localStorage.getItem('token');
            const queryParams = new URLSearchParams();
            
            Object.entries(filters).forEach(([key, value]) => {
                if (value) {
                    queryParams.append(key, value);
                }
            });

            const response = await fetch(`http://localhost:8080/api/orders/search?${queryParams}`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            if (response.ok) {
                const data = await response.json();
                setOrders(data);
            } else {
                toast.error('Failed to search orders');
            }
        } catch (error) {
            console.error('Error searching orders:', error);
            toast.error('Error searching orders');
        } finally {
            setLoading(false);
        }
    };

    const resetForm = () => {
        setFormData({
            orderNumber: '',
            customerName: '',
            customerEmail: '',
            customerPhone: '',
            customerAddress: '',
            productName: '',
            productCategory: '',
            productDescription: '',
            quantity: '',
            unitPrice: '',
            totalAmount: '',
            status: 'PENDING',
            priority: 'MEDIUM',
            expectedDeliveryDate: '',
            paymentStatus: 'PENDING',
            paymentMethod: '',
            notes: '',
            specifications: '',
            branchId: ''
        });
        setEditingOrder(null);
        setShowForm(false);
    };

    const clearFilters = () => {
        setFilters({
            branchId: '',
            status: '',
            priority: '',
            customerName: '',
            productName: '',
            orderNumber: ''
        });
        fetchOrders();
    };

    const calculateTotal = () => {
        const quantity = parseFloat(formData.quantity) || 0;
        const unitPrice = parseFloat(formData.unitPrice) || 0;
        const total = quantity * unitPrice;
        setFormData(prev => ({ ...prev, totalAmount: total.toFixed(2) }));
    };

    useEffect(() => {
        calculateTotal();
    }, [formData.quantity, formData.unitPrice]);

    const getStatusColor = (status) => {
        const colors = {
            'PENDING': 'bg-yellow-100 text-yellow-800',
            'CONFIRMED': 'bg-blue-100 text-blue-800',
            'IN_PRODUCTION': 'bg-purple-100 text-purple-800',
            'READY_FOR_DELIVERY': 'bg-indigo-100 text-indigo-800',
            'DELIVERED': 'bg-green-100 text-green-800',
            'CANCELLED': 'bg-red-100 text-red-800'
        };
        return colors[status] || 'bg-gray-100 text-gray-800';
    };

    const getPriorityColor = (priority) => {
        const colors = {
            'LOW': 'bg-gray-100 text-gray-800',
            'MEDIUM': 'bg-blue-100 text-blue-800',
            'HIGH': 'bg-orange-100 text-orange-800',
            'URGENT': 'bg-red-100 text-red-800'
        };
        return colors[priority] || 'bg-gray-100 text-gray-800';
    };

    return (
        <div className="p-6 max-w-7xl mx-auto">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Order Management</h1>
                <div className="flex gap-2">
                    <button
                        onClick={() => setShowFilters(!showFilters)}
                        className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
                    >
                        {showFilters ? 'Hide Filters' : 'Show Filters'}
                    </button>
                    <button
                        onClick={() => setShowForm(true)}
                        className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                    >
                        Add New Order
                    </button>
                </div>
            </div>

            {/* Statistics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                <div className="bg-blue-50 dark:bg-blue-900 p-4 rounded-lg">
                    <h3 className="text-lg font-semibold text-blue-800 dark:text-blue-200">Total Orders</h3>
                    <p className="text-2xl font-bold text-blue-600 dark:text-blue-300">{statistics.totalOrders || 0}</p>
                </div>
                <div className="bg-yellow-50 dark:bg-yellow-900 p-4 rounded-lg">
                    <h3 className="text-lg font-semibold text-yellow-800 dark:text-yellow-200">Pending</h3>
                    <p className="text-2xl font-bold text-yellow-600 dark:text-yellow-300">{statistics.pendingOrders || 0}</p>
                </div>
                <div className="bg-green-50 dark:bg-green-900 p-4 rounded-lg">
                    <h3 className="text-lg font-semibold text-green-800 dark:text-green-200">Delivered</h3>
                    <p className="text-2xl font-bold text-green-600 dark:text-green-300">{statistics.deliveredOrders || 0}</p>
                </div>
                <div className="bg-purple-50 dark:bg-purple-900 p-4 rounded-lg">
                    <h3 className="text-lg font-semibold text-purple-800 dark:text-purple-200">Total Revenue</h3>
                    <p className="text-2xl font-bold text-purple-600 dark:text-purple-300">
                        ${statistics.totalRevenue ? parseFloat(statistics.totalRevenue).toFixed(2) : '0.00'}
                    </p>
                </div>
            </div>

            {/* Filters */}
            {showFilters && (
                <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md mb-6">
                    <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">Filter Orders</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                        <select
                            value={filters.branchId}
                            onChange={(e) => setFilters(prev => ({ ...prev, branchId: e.target.value }))}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                        >
                            <option value="">All Branches</option>
                            {branches.map(branch => (
                                <option key={branch.id} value={branch.id}>{branch.name}</option>
                            ))}
                        </select>

                        <select
                            value={filters.status}
                            onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value }))}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                        >
                            <option value="">All Statuses</option>
                            {statusOptions.map(status => (
                                <option key={status} value={status}>{status}</option>
                            ))}
                        </select>

                        <select
                            value={filters.priority}
                            onChange={(e) => setFilters(prev => ({ ...prev, priority: e.target.value }))}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                        >
                            <option value="">All Priorities</option>
                            {priorityOptions.map(priority => (
                                <option key={priority} value={priority}>{priority}</option>
                            ))}
                        </select>

                        <input
                            type="text"
                            placeholder="Customer Name"
                            value={filters.customerName}
                            onChange={(e) => setFilters(prev => ({ ...prev, customerName: e.target.value }))}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder-gray-400"
                        />

                        <input
                            type="text"
                            placeholder="Product Name"
                            value={filters.productName}
                            onChange={(e) => setFilters(prev => ({ ...prev, productName: e.target.value }))}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder-gray-400"
                        />

                        <input
                            type="text"
                            placeholder="Order Number"
                            value={filters.orderNumber}
                            onChange={(e) => setFilters(prev => ({ ...prev, orderNumber: e.target.value }))}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder-gray-400"
                        />
                    </div>
                    <div className="flex gap-2">
                        <button
                            onClick={handleSearch}
                            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                        >
                            Search
                        </button>
                        <button
                            onClick={clearFilters}
                            className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
                        >
                            Clear
                        </button>
                    </div>
                </div>
            )}

            {/* Orders Table */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                        <thead className="bg-gray-50 dark:bg-gray-700">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                    Order Details
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                    Customer
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                    Product
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                    Amount
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                    Status
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                            {loading ? (
                                <tr>
                                    <td colSpan="6" className="px-6 py-4 text-center text-gray-500 dark:text-gray-400">
                                        Loading orders...
                                    </td>
                                </tr>
                            ) : orders.length === 0 ? (
                                <tr>
                                    <td colSpan="6" className="px-6 py-4 text-center text-gray-500 dark:text-gray-400">
                                        No orders found
                                    </td>
                                </tr>
                            ) : (
                                orders.map((order) => (
                                    <tr key={order.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm font-medium text-gray-900 dark:text-white">
                                                #{order.orderNumber}
                                            </div>
                                            <div className="text-sm text-gray-500 dark:text-gray-400">
                                                {new Date(order.orderDate).toLocaleDateString()}
                                            </div>
                                            <div className="text-sm text-gray-500 dark:text-gray-400">
                                                Branch: {order.branch?.name || 'N/A'}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm font-medium text-gray-900 dark:text-white">
                                                {order.customerName}
                                            </div>
                                            <div className="text-sm text-gray-500 dark:text-gray-400">
                                                {order.customerEmail}
                                            </div>
                                            <div className="text-sm text-gray-500 dark:text-gray-400">
                                                {order.customerPhone}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm font-medium text-gray-900 dark:text-white">
                                                {order.productName}
                                            </div>
                                            <div className="text-sm text-gray-500 dark:text-gray-400">
                                                Category: {order.productCategory}
                                            </div>
                                            <div className="text-sm text-gray-500 dark:text-gray-400">
                                                Qty: {order.quantity}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm font-medium text-gray-900 dark:text-white">
                                                ${parseFloat(order.totalAmount).toFixed(2)}
                                            </div>
                                            <div className="text-sm text-gray-500 dark:text-gray-400">
                                                Unit: ${parseFloat(order.unitPrice).toFixed(2)}
                                            </div>
                                            <div className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                                                order.paymentStatus === 'PAID' ? 'bg-green-100 text-green-800' :
                                                order.paymentStatus === 'PENDING' ? 'bg-yellow-100 text-yellow-800' :
                                                'bg-red-100 text-red-800'
                                            }`}>
                                                {order.paymentStatus}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex flex-col gap-1">
                                                <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(order.status)}`}>
                                                    {order.status}
                                                </span>
                                                <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getPriorityColor(order.priority)}`}>
                                                    {order.priority}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                            <div className="flex flex-col gap-1">
                                                <button
                                                    onClick={() => handleEdit(order)}
                                                    className="text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-300"
                                                >
                                                    Edit
                                                </button>
                                                <select
                                                    value={order.status}
                                                    onChange={(e) => handleQuickStatusUpdate(order.id, e.target.value)}
                                                    className="text-xs border border-gray-300 rounded px-1 py-0.5 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                                                >
                                                    {statusOptions.map(status => (
                                                        <option key={status} value={status}>{status}</option>
                                                    ))}
                                                </select>
                                                <button
                                                    onClick={() => handleDelete(order.id)}
                                                    className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
                                                >
                                                    Delete
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Add/Edit Order Modal */}
            {showForm && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
                        <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">
                            {editingOrder ? 'Edit Order' : 'Add New Order'}
                        </h2>

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {/* Order Information */}
                                <div className="space-y-4">
                                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Order Information</h3>
                                    
                                    <input
                                        type="text"
                                        placeholder="Order Number *"
                                        value={formData.orderNumber}
                                        onChange={(e) => setFormData(prev => ({ ...prev, orderNumber: e.target.value }))}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder-gray-400"
                                        required
                                    />

                                    <select
                                        value={formData.branchId}
                                        onChange={(e) => setFormData(prev => ({ ...prev, branchId: e.target.value }))}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                                    >
                                        <option value="">Select Branch</option>
                                        {branches.map(branch => (
                                            <option key={branch.id} value={branch.id}>{branch.name}</option>
                                        ))}
                                    </select>

                                    <div className="grid grid-cols-2 gap-2">
                                        <select
                                            value={formData.status}
                                            onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value }))}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                                        >
                                            {statusOptions.map(status => (
                                                <option key={status} value={status}>{status}</option>
                                            ))}
                                        </select>

                                        <select
                                            value={formData.priority}
                                            onChange={(e) => setFormData(prev => ({ ...prev, priority: e.target.value }))}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                                        >
                                            {priorityOptions.map(priority => (
                                                <option key={priority} value={priority}>{priority}</option>
                                            ))}
                                        </select>
                                    </div>

                                    <input
                                        type="date"
                                        placeholder="Expected Delivery Date"
                                        value={formData.expectedDeliveryDate}
                                        onChange={(e) => setFormData(prev => ({ ...prev, expectedDeliveryDate: e.target.value }))}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                                    />
                                </div>

                                {/* Customer Information */}
                                <div className="space-y-4">
                                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Customer Information</h3>
                                    
                                    <input
                                        type="text"
                                        placeholder="Customer Name *"
                                        value={formData.customerName}
                                        onChange={(e) => setFormData(prev => ({ ...prev, customerName: e.target.value }))}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder-gray-400"
                                        required
                                    />

                                    <input
                                        type="email"
                                        placeholder="Customer Email"
                                        value={formData.customerEmail}
                                        onChange={(e) => setFormData(prev => ({ ...prev, customerEmail: e.target.value }))}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder-gray-400"
                                    />

                                    <input
                                        type="tel"
                                        placeholder="Customer Phone"
                                        value={formData.customerPhone}
                                        onChange={(e) => setFormData(prev => ({ ...prev, customerPhone: e.target.value }))}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder-gray-400"
                                    />

                                    <textarea
                                        placeholder="Customer Address"
                                        value={formData.customerAddress}
                                        onChange={(e) => setFormData(prev => ({ ...prev, customerAddress: e.target.value }))}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder-gray-400"
                                        rows="3"
                                    />
                                </div>
                            </div>

                            {/* Product Information */}
                            <div className="space-y-4">
                                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Product Information</h3>
                                
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <input
                                        type="text"
                                        placeholder="Product Name *"
                                        value={formData.productName}
                                        onChange={(e) => setFormData(prev => ({ ...prev, productName: e.target.value }))}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder-gray-400"
                                        required
                                    />

                                    <input
                                        type="text"
                                        placeholder="Product Category"
                                        value={formData.productCategory}
                                        onChange={(e) => setFormData(prev => ({ ...prev, productCategory: e.target.value }))}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder-gray-400"
                                    />
                                </div>

                                <textarea
                                    placeholder="Product Description"
                                    value={formData.productDescription}
                                    onChange={(e) => setFormData(prev => ({ ...prev, productDescription: e.target.value }))}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder-gray-400"
                                    rows="3"
                                />

                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <input
                                        type="number"
                                        placeholder="Quantity *"
                                        value={formData.quantity}
                                        onChange={(e) => setFormData(prev => ({ ...prev, quantity: e.target.value }))}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder-gray-400"
                                        min="1"
                                        required
                                    />

                                    <input
                                        type="number"
                                        step="0.01"
                                        placeholder="Unit Price *"
                                        value={formData.unitPrice}
                                        onChange={(e) => setFormData(prev => ({ ...prev, unitPrice: e.target.value }))}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder-gray-400"
                                        min="0"
                                        required
                                    />

                                    <input
                                        type="number"
                                        step="0.01"
                                        placeholder="Total Amount"
                                        value={formData.totalAmount}
                                        readOnly
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-100 dark:bg-gray-600 dark:border-gray-500 dark:text-gray-300"
                                    />
                                </div>
                            </div>

                            {/* Payment Information */}
                            <div className="space-y-4">
                                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Payment Information</h3>
                                
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <select
                                        value={formData.paymentStatus}
                                        onChange={(e) => setFormData(prev => ({ ...prev, paymentStatus: e.target.value }))}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                                    >
                                        {paymentStatusOptions.map(status => (
                                            <option key={status} value={status}>{status}</option>
                                        ))}
                                    </select>

                                    <select
                                        value={formData.paymentMethod}
                                        onChange={(e) => setFormData(prev => ({ ...prev, paymentMethod: e.target.value }))}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                                    >
                                        <option value="">Select Payment Method</option>
                                        {paymentMethodOptions.map(method => (
                                            <option key={method} value={method}>{method}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            {/* Additional Information */}
                            <div className="space-y-4">
                                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Additional Information</h3>
                                
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <textarea
                                        placeholder="Order Notes"
                                        value={formData.notes}
                                        onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder-gray-400"
                                        rows="3"
                                    />

                                    <textarea
                                        placeholder="Product Specifications"
                                        value={formData.specifications}
                                        onChange={(e) => setFormData(prev => ({ ...prev, specifications: e.target.value }))}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder-gray-400"
                                        rows="3"
                                    />
                                </div>
                            </div>

                            <div className="flex justify-end gap-4 pt-6">
                                <button
                                    type="button"
                                    onClick={resetForm}
                                    className="px-4 py-2 text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300 transition-colors dark:bg-gray-600 dark:text-gray-300 dark:hover:bg-gray-500"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
                                >
                                    {loading ? 'Saving...' : (editingOrder ? 'Update Order' : 'Create Order')}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default OrderManagement;
