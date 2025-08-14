import React, { useState, useEffect } from 'react';
import { useAuth } from '../App';

const CommandManagement = () => {
  const { user } = useAuth();
  const token = localStorage.getItem('token');
  const [commands, setCommands] = useState([]);
  const [users, setUsers] = useState([]);
  const [branches, setBranches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingCommand, setEditingCommand] = useState(null);
  const [filterStatus, setFilterStatus] = useState('');
  const [filterPriority, setFilterPriority] = useState('');
  const [filterType, setFilterType] = useState('');

  // Command form state
  const [commandForm, setCommandForm] = useState({
    title: '',
    description: '',
    type: 'GENERAL_INSTRUCTION',
    priority: 'MEDIUM',
    status: 'PENDING',
    dueDate: '',
    assignedTo: '',
    notes: ''
  });

  const commandTypes = [
    'GENERAL_INSTRUCTION',
    'TASK_ASSIGNMENT',
    'POLICY_UPDATE',
    'URGENT_NOTICE',
    'OPERATIONAL_CHANGE',
    'SAFETY_DIRECTIVE',
    'TRAINING_REQUIREMENT',
    'PERFORMANCE_REVIEW',
    'MAINTENANCE_REQUEST',
    'OTHER'
  ];

  const priorities = ['LOW', 'MEDIUM', 'HIGH', 'URGENT'];
  const statuses = ['PENDING', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED', 'ON_HOLD'];

  useEffect(() => {
    fetchCommands();
    fetchUsers();
    fetchBranches();
  }, []);

  const fetchCommands = async () => {
    try {
      console.log('Fetching commands with token:', token); // Debug log
      
      if (!token) {
        setError('No authentication token found. Please log in again.');
        setLoading(false);
        return;
      }

      const response = await fetch('http://localhost:8080/api/commands', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      console.log('Response status:', response.status); // Debug log
      console.log('Response ok:', response.ok); // Debug log

      if (response.ok) {
        const data = await response.json();
        console.log('Fetched commands:', data); // Debug log
        setCommands(data);
        setError(''); // Clear any previous errors
      } else {
        const errorText = await response.text();
        console.error('Failed to fetch commands:', response.status, errorText);
        setError(`Failed to fetch commands: ${response.status} ${errorText}`);
      }
    } catch (error) {
      console.error('Error fetching commands:', error);
      setError('Error fetching commands: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchUsers = async () => {
    try {
      const response = await fetch('http://localhost:8080/api/users', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const data = await response.json();
        setUsers(data);
      }
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  const fetchBranches = async () => {
    try {
      const response = await fetch('http://localhost:8080/api/branches', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const data = await response.json();
        setBranches(data);
      }
    } catch (error) {
      console.error('Error fetching branches:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    console.log('User object:', user); // Debug log
    console.log('Token:', token); // Debug log

    if (!user || !user.id) {
      setError('User information not found. Please log in again.');
      return;
    }

    try {
      const commandData = {
        ...commandForm,
        issuedBy: { id: user.id },
        assignedTo: commandForm.assignedTo ? { id: parseInt(commandForm.assignedTo) } : null,
        dueDate: commandForm.dueDate ? new Date(commandForm.dueDate).toISOString() : null
      };

      console.log('Command data to send:', commandData); // Debug log

      const url = editingCommand 
        ? `http://localhost:8080/api/commands/${editingCommand.id}`
        : 'http://localhost:8080/api/commands';
      
      const method = editingCommand ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method: method,
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(commandData),
      });

      if (response.ok) {
        const createdCommand = await response.json();
        console.log('Command saved successfully:', createdCommand); // Debug log
        setSuccess(editingCommand ? 'Command updated successfully!' : 'Command created successfully!');
        setShowAddForm(false);
        setEditingCommand(null);
        resetForm();
        await fetchCommands(); // Wait for fetch to complete
      } else {
        const errorMessage = await response.text();
        console.error('Server response:', response.status, errorMessage); // Debug log
        setError(`Failed to save command: ${response.status} - ${errorMessage}`);
      }
    } catch (error) {
      console.error('Error saving command:', error); // Debug log
      setError('Error saving command: ' + error.message);
    }
  };

  const handleEdit = (command) => {
    setEditingCommand(command);
    setCommandForm({
      title: command.title,
      description: command.description,
      type: command.type,
      priority: command.priority,
      status: command.status,
      dueDate: command.dueDate ? new Date(command.dueDate).toISOString().slice(0, 16) : '',
      assignedTo: command.assignedTo ? command.assignedTo.id.toString() : '',
      notes: command.notes || ''
    });
    setShowAddForm(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this command?')) {
      try {
        const response = await fetch(`http://localhost:8080/api/commands/${id}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        if (response.ok) {
          setSuccess('Command deleted successfully!');
          fetchCommands();
        } else {
          setError('Failed to delete command');
        }
      } catch (error) {
        setError('Error deleting command: ' + error.message);
      }
    }
  };

  const handleStatusChange = async (commandId, newStatus) => {
    try {
      const response = await fetch(`http://localhost:8080/api/commands/${commandId}/status?status=${newStatus}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        setSuccess('Command status updated successfully!');
        fetchCommands();
      } else {
        setError('Failed to update command status');
      }
    } catch (error) {
      setError('Error updating command status: ' + error.message);
    }
  };

  const resetForm = () => {
    setCommandForm({
      title: '',
      description: '',
      type: 'GENERAL_INSTRUCTION',
      priority: 'MEDIUM',
      status: 'PENDING',
      dueDate: '',
      assignedTo: '',
      notes: ''
    });
  };

  const getFilteredCommands = () => {
    return commands.filter(command => {
      return (
        (!filterStatus || command.status === filterStatus) &&
        (!filterPriority || command.priority === filterPriority) &&
        (!filterType || command.type === filterType)
      );
    });
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'URGENT': return 'text-red-600 bg-red-100';
      case 'HIGH': return 'text-orange-600 bg-orange-100';
      case 'MEDIUM': return 'text-yellow-600 bg-yellow-100';
      case 'LOW': return 'text-green-600 bg-green-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'COMPLETED': return 'text-green-600 bg-green-100';
      case 'IN_PROGRESS': return 'text-blue-600 bg-blue-100';
      case 'PENDING': return 'text-yellow-600 bg-yellow-100';
      case 'CANCELLED': return 'text-red-600 bg-red-100';
      case 'ON_HOLD': return 'text-gray-600 bg-gray-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const formatDateTime = (dateTimeString) => {
    if (!dateTimeString) return 'Not set';
    return new Date(dateTimeString).toLocaleString();
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">Command Management</h1>
        <button
          onClick={() => {
            setShowAddForm(true);
            setEditingCommand(null);
            resetForm();
          }}
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2"
        >
          <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          <span>Give New Command</span>
        </button>
      </div>

      {/* Messages */}
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}
      {success && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded">
          {success}
        </div>
      )}

      {/* Filters */}
      <div className="bg-white p-4 rounded-lg shadow">
        <h3 className="text-lg font-medium mb-4">Filters</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">All Statuses</option>
              {statuses.map(status => (
                <option key={status} value={status}>{status.replace('_', ' ')}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Priority</label>
            <select
              value={filterPriority}
              onChange={(e) => setFilterPriority(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">All Priorities</option>
              {priorities.map(priority => (
                <option key={priority} value={priority}>{priority}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">All Types</option>
              {commandTypes.map(type => (
                <option key={type} value={type}>{type.replace(/_/g, ' ')}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Add/Edit Form */}
      {showAddForm && (
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">
            {editingCommand ? 'Edit Command' : 'Give New Command'}
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Title *</label>
                <input
                  type="text"
                  value={commandForm.title}
                  onChange={(e) => setCommandForm({...commandForm, title: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Type *</label>
                <select
                  value={commandForm.type}
                  onChange={(e) => setCommandForm({...commandForm, type: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  required
                >
                  {commandTypes.map(type => (
                    <option key={type} value={type}>{type.replace(/_/g, ' ')}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Priority</label>
                <select
                  value={commandForm.priority}
                  onChange={(e) => setCommandForm({...commandForm, priority: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                >
                  {priorities.map(priority => (
                    <option key={priority} value={priority}>{priority}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                <select
                  value={commandForm.status}
                  onChange={(e) => setCommandForm({...commandForm, status: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                >
                  {statuses.map(status => (
                    <option key={status} value={status}>{status.replace('_', ' ')}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Due Date</label>
                <input
                  type="datetime-local"
                  value={commandForm.dueDate}
                  onChange={(e) => setCommandForm({...commandForm, dueDate: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Assign To</label>
                <select
                  value={commandForm.assignedTo}
                  onChange={(e) => setCommandForm({...commandForm, assignedTo: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">Select a user (optional)</option>
                  {users.map(user => (
                    <option key={user.id} value={user.id}>
                      {user.firstName} {user.lastName} ({user.role})
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Description *</label>
              <textarea
                value={commandForm.description}
                onChange={(e) => setCommandForm({...commandForm, description: e.target.value})}
                rows="4"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
              <textarea
                value={commandForm.notes}
                onChange={(e) => setCommandForm({...commandForm, notes: e.target.value})}
                rows="3"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div className="flex space-x-2">
              <button
                type="submit"
                className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
              >
                {editingCommand ? 'Update Command' : 'Give Command'}
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowAddForm(false);
                  setEditingCommand(null);
                  resetForm();
                }}
                className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Commands Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-medium">Commands ({getFilteredCommands().length})</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Command Details
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Type & Priority
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Assignment
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Dates
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {getFilteredCommands().map((command) => (
                <tr key={command.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div>
                      <div className="text-sm font-medium text-gray-900">{command.title}</div>
                      <div className="text-sm text-gray-500">{command.description.substring(0, 100)}...</div>
                      <div className="text-xs text-gray-400">
                        Issued by: {command.issuedBy?.firstName} {command.issuedBy?.lastName}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="space-y-1">
                      <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                        {command.type.replace(/_/g, ' ')}
                      </span>
                      <br />
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getPriorityColor(command.priority)}`}>
                        {command.priority}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm">
                      <div>
                        <span className="text-gray-500">To:</span> {command.assignedTo ? 
                          `${command.assignedTo.firstName} ${command.assignedTo.lastName}` : 
                          'Not assigned'
                        }
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <select
                      value={command.status}
                      onChange={(e) => handleStatusChange(command.id, e.target.value)}
                      className={`text-xs px-2 py-1 rounded-full border-0 ${getStatusColor(command.status)}`}
                    >
                      {statuses.map(status => (
                        <option key={status} value={status}>{status.replace('_', ' ')}</option>
                      ))}
                    </select>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    <div>
                      <div>Created: {formatDateTime(command.createdAt)}</div>
                      {command.dueDate && (
                        <div>Due: {formatDateTime(command.dueDate)}</div>
                      )}
                      {command.completedDate && (
                        <div>Completed: {formatDateTime(command.completedDate)}</div>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm font-medium space-x-2">
                    <button
                      onClick={() => handleEdit(command)}
                      className="text-blue-600 hover:text-blue-900"
                    >
                      Edit
                    </button>
                    {user.role === 'OWNER' && (
                      <button
                        onClick={() => handleDelete(command.id)}
                        className="text-red-600 hover:text-red-900"
                      >
                        Delete
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {getFilteredCommands().length === 0 && (
            <div className="text-center py-8 text-gray-500">
              No commands found matching the current filters.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CommandManagement;
