import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';

const StockManagement = () => {
  const [stocks, setStocks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [editingStock, setEditingStock] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL'); // ALL, UNRELEASED, RELEASED
  const [stockTypeFilter, setStockTypeFilter] = useState('');
  
  const [formData, setFormData] = useState({
    stockType: '',
    materialType: '',
    quantity: '',
    price: '',
    purchaseDate: '',
    releaseDate: ''
  });
  
  const [errors, setErrors] = useState({});

  // Load data on component mount
  useEffect(() => {
    loadStocks();
  }, []);

  const loadStocks = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:8080/api/stock', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const data = await response.json();
        setStocks(data);
      } else {
        toast.error('Failed to load stocks');
        setStocks([]);
      }
    } catch (error) {
      console.error('Error loading stocks:', error);
      toast.error('Failed to load stocks');
      setStocks([]);
    } finally {
      setLoading(false);
    }
  };

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  // Validate form
  const validateForm = () => {
    const newErrors = {};

    if (!formData.stockType.trim()) {
      newErrors.stockType = 'Stock type is required';
    }

    if (!formData.materialType.trim()) {
      newErrors.materialType = 'Material type is required';
    }

    if (!formData.quantity || formData.quantity <= 0) {
      newErrors.quantity = 'Valid quantity is required';
    }

    if (!formData.price || formData.price <= 0) {
      newErrors.price = 'Valid price is required';
    }

    if (!formData.purchaseDate) {
      newErrors.purchaseDate = 'Purchase date is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      const token = localStorage.getItem('token');
      const stockData = {
        stockType: formData.stockType,
        materialType: formData.materialType,
        quantity: parseInt(formData.quantity),
        price: parseFloat(formData.price),
        purchaseDate: formData.purchaseDate,
        releaseDate: formData.releaseDate || null
      };

      const url = editingStock 
        ? `http://localhost:8080/api/stock/${editingStock.id}`
        : 'http://localhost:8080/api/stock';
      
      const method = editingStock ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(stockData)
      });

      if (response.ok) {
        const result = await response.json();
        if (editingStock) {
          toast.success('Stock updated successfully');
        } else {
          toast.success('Stock created successfully');
        }
        setShowModal(false);
        resetForm();
        await loadStocks();
      } else {
        const errorText = await response.text();
        toast.error(errorText || 'Failed to save stock');
      }
    } catch (error) {
      console.error('Error saving stock:', error);
      toast.error('Failed to save stock');
    }
  };

  // Reset form
  const resetForm = () => {
    setFormData({
      stockType: '',
      materialType: '',
      quantity: '',
      price: '',
      purchaseDate: '',
      releaseDate: ''
    });
    setErrors({});
    setEditingStock(null);
  };

  // Handle edit stock
  const handleEdit = (stock) => {
    setEditingStock(stock);
    setFormData({
      stockType: stock.stockType || '',
      materialType: stock.materialType || '',
      quantity: stock.quantity?.toString() || '',
      price: stock.price?.toString() || '',
      purchaseDate: stock.purchaseDate || '',
      releaseDate: stock.releaseDate || ''
    });
    setShowModal(true);
  };

  // Handle delete stock
  const handleDelete = async (stock) => {
    if (window.confirm(`Are you sure you want to delete this ${stock.materialType} stock?`)) {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch(`http://localhost:8080/api/stock/${stock.id}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        if (response.ok) {
          toast.success('Stock deleted successfully');
          await loadStocks();
        } else {
          const errorText = await response.text();
          toast.error(errorText || 'Failed to delete stock');
        }
      } catch (error) {
        console.error('Error deleting stock:', error);
        toast.error('Failed to delete stock');
      }
    }
  };

  // Handle release stock
  const handleRelease = async (stock) => {
    if (window.confirm(`Are you sure you want to release this ${stock.materialType} stock?`)) {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch(`http://localhost:8080/api/stock/${stock.id}/release`, {
          method: 'PUT',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        if (response.ok) {
          toast.success('Stock released successfully');
          await loadStocks();
        } else {
          const errorText = await response.text();
          toast.error(errorText || 'Failed to release stock');
        }
      } catch (error) {
        console.error('Error releasing stock:', error);
        toast.error('Failed to release stock');
      }
    }
  };

  // Filter stocks based on search and status
  const filteredStocks = stocks.filter(stock => {
    const matchesSearch = stock.stockType.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         stock.materialType.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'ALL' || 
                         (statusFilter === 'UNRELEASED' && !stock.releaseDate) ||
                         (statusFilter === 'RELEASED' && stock.releaseDate);
    
    const matchesStockType = !stockTypeFilter || stock.stockType.toLowerCase().includes(stockTypeFilter.toLowerCase());

    return matchesSearch && matchesStatus && matchesStockType;
  });

  // Get unique stock types for filter
  const stockTypes = [...new Set(stocks.map(stock => stock.stockType))];

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 dark:bg-gray-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Stock Management</h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">Manage inventory and stock levels</p>
          </div>
          
          <button
            onClick={() => setShowModal(true)}
            className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
          >
            Add New Stock
          </button>
        </div>

        {/* Filters */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <input
                type="text"
                placeholder="Search stocks..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white"
              />
            </div>
            <div>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white"
              >
                <option value="ALL">All Status</option>
                <option value="UNRELEASED">Unreleased</option>
                <option value="RELEASED">Released</option>
              </select>
            </div>
            <div>
              <select
                value={stockTypeFilter}
                onChange={(e) => setStockTypeFilter(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white"
              >
                <option value="">All Stock Types</option>
                {stockTypes.map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => {
                  setSearchTerm('');
                  setStatusFilter('ALL');
                  setStockTypeFilter('');
                }}
                className="flex-1 bg-gray-500 hover:bg-gray-600 text-white px-3 py-2 rounded-lg font-medium transition-colors"
              >
                Clear
              </button>
            </div>
          </div>
        </div>

        {/* Stock Table */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Stock Details
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Quantity & Price
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Dates
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
                {filteredStocks.map((stock) => (
                  <tr key={stock.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900 dark:text-white">
                          {stock.stockType}
                        </div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">
                          {stock.materialType}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900 dark:text-white">Qty: {stock.quantity}</div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">₹{stock.price}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900 dark:text-white">
                        Purchase: {new Date(stock.purchaseDate).toLocaleDateString()}
                      </div>
                      {stock.releaseDate && (
                        <div className="text-sm text-gray-500 dark:text-gray-400">
                          Released: {new Date(stock.releaseDate).toLocaleDateString()}
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        stock.releaseDate 
                          ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200' 
                          : 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                      }`}>
                        {stock.releaseDate ? 'Released' : 'Available'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleEdit(stock)}
                          className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300"
                          title="Edit"
                        >
                          ✏️
                        </button>
                        {!stock.releaseDate && (
                          <button
                            onClick={() => handleRelease(stock)}
                            className="text-orange-600 hover:text-orange-900 dark:text-orange-400 dark:hover:text-orange-300"
                            title="Release Stock"
                          >
                            📤
                          </button>
                        )}
                        <button
                          onClick={() => handleDelete(stock)}
                          className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
                          title="Delete"
                        >
                          🗑️
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredStocks.length === 0 && (
            <div className="p-6 text-center">
              <div className="text-gray-500 dark:text-gray-400">
                {searchTerm || statusFilter !== 'ALL' || stockTypeFilter ? 'No stocks found matching your filters.' : 'No stocks found.'}
              </div>
            </div>
          )}
        </div>

        {/* Add/Edit Stock Modal */}
        {showModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white dark:bg-gray-800 rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    {editingStock ? 'Edit Stock' : 'Add New Stock'}
                  </h3>
                  <button
                    onClick={() => {
                      setShowModal(false);
                      resetForm();
                    }}
                    className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                  >
                    ✕
                  </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                  {/* Stock Type */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Stock Type *
                    </label>
                    <input
                      type="text"
                      name="stockType"
                      value={formData.stockType}
                      onChange={handleInputChange}
                      className={`w-full px-3 py-2 border rounded-lg focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white ${
                        errors.stockType ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                      }`}
                      placeholder="e.g., Raw Material, Finished Product"
                    />
                    {errors.stockType && <p className="text-red-500 text-sm mt-1">{errors.stockType}</p>}
                  </div>

                  {/* Material Type */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Material Type *
                    </label>
                    <input
                      type="text"
                      name="materialType"
                      value={formData.materialType}
                      onChange={handleInputChange}
                      className={`w-full px-3 py-2 border rounded-lg focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white ${
                        errors.materialType ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                      }`}
                      placeholder="e.g., Cotton, Silk, Polyester"
                    />
                    {errors.materialType && <p className="text-red-500 text-sm mt-1">{errors.materialType}</p>}
                  </div>

                  {/* Quantity */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Quantity *
                    </label>
                    <input
                      type="number"
                      name="quantity"
                      value={formData.quantity}
                      onChange={handleInputChange}
                      min="1"
                      className={`w-full px-3 py-2 border rounded-lg focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white ${
                        errors.quantity ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                      }`}
                      placeholder="Enter quantity"
                    />
                    {errors.quantity && <p className="text-red-500 text-sm mt-1">{errors.quantity}</p>}
                  </div>

                  {/* Price */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Price *
                    </label>
                    <input
                      type="number"
                      name="price"
                      value={formData.price}
                      onChange={handleInputChange}
                      step="0.01"
                      min="0"
                      className={`w-full px-3 py-2 border rounded-lg focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white ${
                        errors.price ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                      }`}
                      placeholder="Enter price"
                    />
                    {errors.price && <p className="text-red-500 text-sm mt-1">{errors.price}</p>}
                  </div>

                  {/* Purchase Date */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Purchase Date *
                    </label>
                    <input
                      type="date"
                      name="purchaseDate"
                      value={formData.purchaseDate}
                      onChange={handleInputChange}
                      className={`w-full px-3 py-2 border rounded-lg focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white ${
                        errors.purchaseDate ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                      }`}
                    />
                    {errors.purchaseDate && <p className="text-red-500 text-sm mt-1">{errors.purchaseDate}</p>}
                  </div>

                  {/* Release Date */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Release Date (Optional)
                    </label>
                    <input
                      type="date"
                      name="releaseDate"
                      value={formData.releaseDate}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white"
                    />
                  </div>

                  {/* Form Actions */}
                  <div className="flex gap-3 pt-4">
                    <button
                      type="submit"
                      className="flex-1 bg-primary-600 hover:bg-primary-700 text-white py-2 px-4 rounded-lg font-medium transition-colors"
                    >
                      {editingStock ? 'Update Stock' : 'Create Stock'}
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setShowModal(false);
                        resetForm();
                      }}
                      className="flex-1 bg-gray-300 hover:bg-gray-400 dark:bg-gray-600 dark:hover:bg-gray-500 text-gray-700 dark:text-white py-2 px-4 rounded-lg font-medium transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default StockManagement;
