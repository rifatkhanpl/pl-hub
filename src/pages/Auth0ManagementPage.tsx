import React, { useState, useEffect, useMemo } from 'react';
import { Users, Search, Plus, Shield, Mail, Trash2, Ban, CheckCircle, RefreshCw, Eye, Edit, Download, Filter, X, ArrowUp, ArrowDown } from 'lucide-react';

interface Auth0User {
  user_id: string;
  email: string;
  email_verified: boolean;
  name?: string;
  picture?: string;
  created_at: string;
  updated_at: string;
  last_login?: string;
  logins_count: number;
  blocked?: boolean;
  app_metadata?: Record<string, any>;
  user_metadata?: Record<string, any>;
}

interface UsersResponse {
  users: Auth0User[];
  total: number;
  start: number;
  limit: number;
}

type SortField = 'email' | 'name' | 'created_at' | 'last_login' | 'logins_count';
type SortOrder = 'asc' | 'desc';

export function Auth0ManagementPage() {
  const [allUsers, setAllUsers] = useState<Auth0User[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [page, setPage] = useState(0);
  const [perPage] = useState(50);
  const [selectedUser, setSelectedUser] = useState<Auth0User | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showUserDetails, setShowUserDetails] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedUsers, setSelectedUsers] = useState<Set<string>>(new Set());
  const [sortField, setSortField] = useState<SortField>('created_at');
  const [sortOrder, setSortOrder] = useState<SortOrder>('desc');
  const [filters, setFilters] = useState({
    status: 'all', // all, active, blocked
    emailVerified: 'all', // all, verified, unverified
  });

  const EDGE_FUNCTION_URL = import.meta.env.VITE_AUTH0_EDGE_FUNCTION_URL || 'YOUR_EDGE_FUNCTION_URL';
  const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;

  const fetchUsers = async () => {
    setLoading(true);
    setError(null);
    try {
      // Get PL session token from localStorage
      const plSession = localStorage.getItem('pl_session');
      if (!plSession) {
        setError('Not authenticated. Please log in.');
        setLoading(false);
        return;
      }

      const session = JSON.parse(plSession);

      const params = new URLSearchParams({
        path: '/users/export-all',
        page: '0',
        per_page: '10000', // Get all users at once
      });

      const response = await fetch(`${EDGE_FUNCTION_URL}?${params}`, {
        headers: {
          'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
          'apikey': SUPABASE_ANON_KEY,
          'x-pl-auth-token': session.access_token,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch users');
      }

      const data: UsersResponse = await response.json();
      setAllUsers(data.users || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      console.error('Error fetching users:', err);
    } finally {
      setLoading(false);
    }
  };

  // Client-side filtering, sorting, and pagination
  const filteredAndSortedUsers = useMemo(() => {
    let result = [...allUsers];

    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(user =>
        user.email?.toLowerCase().includes(query) ||
        user.name?.toLowerCase().includes(query) ||
        user.user_id?.toLowerCase().includes(query)
      );
    }

    // Apply status filter
    if (filters.status !== 'all') {
      result = result.filter(user =>
        filters.status === 'active' ? !user.blocked : user.blocked
      );
    }

    // Apply email verified filter
    if (filters.emailVerified !== 'all') {
      result = result.filter(user =>
        filters.emailVerified === 'verified' ? user.email_verified : !user.email_verified
      );
    }

    // Apply sorting
    result.sort((a, b) => {
      let aVal: any = a[sortField];
      let bVal: any = b[sortField];

      // Handle null/undefined values
      if (aVal === null || aVal === undefined) aVal = '';
      if (bVal === null || bVal === undefined) bVal = '';

      // For strings, use localeCompare
      if (typeof aVal === 'string' && typeof bVal === 'string') {
        return sortOrder === 'asc'
          ? aVal.localeCompare(bVal)
          : bVal.localeCompare(aVal);
      }

      // For numbers
      if (sortOrder === 'asc') {
        return aVal > bVal ? 1 : aVal < bVal ? -1 : 0;
      } else {
        return aVal < bVal ? 1 : aVal > bVal ? -1 : 0;
      }
    });

    return result;
  }, [allUsers, searchQuery, filters, sortField, sortOrder]);

  // Paginated users
  const paginatedUsers = useMemo(() => {
    const start = page * perPage;
    const end = start + perPage;
    return filteredAndSortedUsers.slice(start, end);
  }, [filteredAndSortedUsers, page, perPage]);

  const totalPages = Math.ceil(filteredAndSortedUsers.length / perPage);

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleSearch = () => {
    setPage(0);
    setSearchQuery(searchTerm);
  };

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('asc');
    }
  };

  const handleBlockUser = async (userId: string, blocked: boolean) => {
    try {
      const plSession = localStorage.getItem('pl_session');
      if (!plSession) {
        setError('Not authenticated. Please log in.');
        return;
      }

      const session = JSON.parse(plSession);

      const response = await fetch(`${EDGE_FUNCTION_URL}?path=/users/${encodeURIComponent(userId)}/block`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
          'apikey': SUPABASE_ANON_KEY,
          'x-pl-auth-token': session.access_token,
        },
        body: JSON.stringify({ blocked }),
      });

      if (!response.ok) {
        throw new Error('Failed to update user');
      }

      fetchUsers();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    }
  };

  const handleDeleteUser = async (userId: string) => {
    if (!confirm('Are you sure you want to delete this user? This action cannot be undone.')) {
      return;
    }

    try {
      const plSession = localStorage.getItem('pl_session');
      if (!plSession) {
        setError('Not authenticated. Please log in.');
        return;
      }

      const session = JSON.parse(plSession);

      const response = await fetch(`${EDGE_FUNCTION_URL}?path=/users/${encodeURIComponent(userId)}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
          'apikey': SUPABASE_ANON_KEY,
          'x-pl-auth-token': session.access_token,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to delete user');
      }

      fetchUsers();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    }
  };

  const handleSendVerificationEmail = async (userId: string) => {
    try {
      const plSession = localStorage.getItem('pl_session');
      if (!plSession) {
        setError('Not authenticated. Please log in.');
        return;
      }

      const session = JSON.parse(plSession);

      const response = await fetch(`${EDGE_FUNCTION_URL}?path=/users/${encodeURIComponent(userId)}/verification-email`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
          'apikey': SUPABASE_ANON_KEY,
          'x-pl-auth-token': session.access_token,
        },
        body: JSON.stringify({ user_id: userId }),
      });

      if (!response.ok) {
        throw new Error('Failed to send verification email');
      }

      alert('Verification email sent successfully');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    }
  };

  const handleViewDetails = async (user: Auth0User) => {
    setSelectedUser(user);
    setShowUserDetails(true);
  };

  const handleEditUser = (user: Auth0User) => {
    setSelectedUser(user);
    setShowEditModal(true);
  };

  const handleExportCSV = () => {
    const csv = [
      ['User ID', 'Email', 'Name', 'Email Verified', 'Status', 'Last Login', 'Logins Count', 'Created At'].join(','),
      ...filteredAndSortedUsers.map(user => [
        user.user_id,
        user.email,
        user.name || '',
        user.email_verified ? 'Yes' : 'No',
        user.blocked ? 'Blocked' : 'Active',
        user.last_login || 'Never',
        user.logins_count,
        user.created_at,
      ].map(field => `"${field}"`).join(','))
    ].join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `auth0-users-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const handleBulkBlock = async (block: boolean) => {
    if (selectedUsers.size === 0) return;
    if (!confirm(`Are you sure you want to ${block ? 'block' : 'unblock'} ${selectedUsers.size} user(s)?`)) return;

    try {
      const plSession = localStorage.getItem('pl_session');
      if (!plSession) {
        setError('Not authenticated. Please log in.');
        return;
      }

      const session = JSON.parse(plSession);

      for (const userId of Array.from(selectedUsers)) {
        await fetch(`${EDGE_FUNCTION_URL}?path=/users/${encodeURIComponent(userId)}/block`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
            'apikey': SUPABASE_ANON_KEY,
            'x-pl-auth-token': session.access_token,
          },
          body: JSON.stringify({ blocked: block }),
        });
      }

      setSelectedUsers(new Set());
      fetchUsers();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    }
  };

  const handleBulkDelete = async () => {
    if (selectedUsers.size === 0) return;
    if (!confirm(`Are you sure you want to delete ${selectedUsers.size} user(s)? This action cannot be undone.`)) return;

    try {
      const plSession = localStorage.getItem('pl_session');
      if (!plSession) {
        setError('Not authenticated. Please log in.');
        return;
      }

      const session = JSON.parse(plSession);

      for (const userId of Array.from(selectedUsers)) {
        await fetch(`${EDGE_FUNCTION_URL}?path=/users/${encodeURIComponent(userId)}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
            'apikey': SUPABASE_ANON_KEY,
            'x-pl-auth-token': session.access_token,
          },
        });
      }

      setSelectedUsers(new Set());
      fetchUsers();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    }
  };

  const toggleUserSelection = (userId: string) => {
    const newSelected = new Set(selectedUsers);
    if (newSelected.has(userId)) {
      newSelected.delete(userId);
    } else {
      newSelected.add(userId);
    }
    setSelectedUsers(newSelected);
  };

  const toggleSelectAll = () => {
    if (selectedUsers.size === paginatedUsers.length) {
      setSelectedUsers(new Set());
    } else {
      setSelectedUsers(new Set(paginatedUsers.map(u => u.user_id)));
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Shield className="w-8 h-8 text-blue-600" />
          <h1 className="text-3xl font-bold">Auth0 User Management</h1>
        </div>
        <div className="flex gap-2">
          <button
            onClick={handleExportCSV}
            className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
          >
            <Download className="w-5 h-5" />
            Export CSV
          </button>
          <button
            onClick={() => setShowCreateModal(true)}
            className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus className="w-5 h-5" />
            Create User
          </button>
        </div>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
        <div className="flex gap-4 mb-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search users by email or name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <button
            onClick={handleSearch}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Search
          </button>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${showFilters ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
          >
            <Filter className="w-5 h-5" />
            Filters
          </button>
          <button
            onClick={() => fetchUsers()}
            className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors"
          >
            <RefreshCw className="w-5 h-5" />
          </button>
        </div>

        {showFilters && (
          <div className="mb-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                <select
                  value={filters.status}
                  onChange={(e) => {
                    setFilters({ ...filters, status: e.target.value });
                    setPage(0);
                  }}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  <option value="all">All</option>
                  <option value="active">Active</option>
                  <option value="blocked">Blocked</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Email Verified</label>
                <select
                  value={filters.emailVerified}
                  onChange={(e) => {
                    setFilters({ ...filters, emailVerified: e.target.value });
                    setPage(0);
                  }}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  <option value="all">All</option>
                  <option value="verified">Verified</option>
                  <option value="unverified">Unverified</option>
                </select>
              </div>
            </div>
          </div>
        )}

        <div className="flex items-center justify-between">
          <div className="text-sm text-gray-600">
            Total users: {allUsers.length} {filters.status !== 'all' || filters.emailVerified !== 'all' || searchQuery ? `(${filteredAndSortedUsers.length} filtered)` : ''}
          </div>
          {selectedUsers.size > 0 && (
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600">{selectedUsers.size} selected</span>
              <button
                onClick={() => handleBulkBlock(false)}
                className="px-3 py-1 text-sm bg-green-100 text-green-700 rounded hover:bg-green-200"
              >
                Unblock
              </button>
              <button
                onClick={() => handleBulkBlock(true)}
                className="px-3 py-1 text-sm bg-orange-100 text-orange-700 rounded hover:bg-orange-200"
              >
                Block
              </button>
              <button
                onClick={handleBulkDelete}
                className="px-3 py-1 text-sm bg-red-100 text-red-700 rounded hover:bg-red-200"
              >
                Delete
              </button>
            </div>
          )}
        </div>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-12 space-y-4">
          <RefreshCw className="w-8 h-8 animate-spin text-blue-600" />
          <div className="text-center">
            <p className="text-gray-700 font-medium">Loading all users...</p>
            <p className="text-sm text-gray-500 mt-1">This may take up to 30 seconds for the export job to complete</p>
          </div>
        </div>
      ) : (
        <>
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left">
                    <input
                      type="checkbox"
                      checked={paginatedUsers.length > 0 && selectedUsers.size === paginatedUsers.length}
                      onChange={toggleSelectAll}
                      className="rounded border-gray-300"
                    />
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    <button
                      onClick={() => handleSort('email')}
                      className="flex items-center gap-1 hover:text-gray-700"
                    >
                      User
                      {sortField === 'email' && (
                        sortOrder === 'asc' ? <ArrowUp className="w-4 h-4" /> : <ArrowDown className="w-4 h-4" />
                      )}
                    </button>
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Email Verified
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    <button
                      onClick={() => handleSort('last_login')}
                      className="flex items-center gap-1 hover:text-gray-700"
                    >
                      Last Login
                      {sortField === 'last_login' && (
                        sortOrder === 'asc' ? <ArrowUp className="w-4 h-4" /> : <ArrowDown className="w-4 h-4" />
                      )}
                    </button>
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    <button
                      onClick={() => handleSort('logins_count')}
                      className="flex items-center gap-1 hover:text-gray-700"
                    >
                      Logins
                      {sortField === 'logins_count' && (
                        sortOrder === 'asc' ? <ArrowUp className="w-4 h-4" /> : <ArrowDown className="w-4 h-4" />
                      )}
                    </button>
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {paginatedUsers.map((user) => (
                  <tr key={user.user_id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <input
                        type="checkbox"
                        checked={selectedUsers.has(user.user_id)}
                        onChange={() => toggleUserSelection(user.user_id)}
                        className="rounded border-gray-300"
                      />
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <img
                          src={user.picture || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.email)}`}
                          alt={user.name || user.email}
                          className="w-10 h-10 rounded-full mr-3"
                        />
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {user.name || 'No name'}
                          </div>
                          <div className="text-sm text-gray-500">{user.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      {user.email_verified ? (
                        <CheckCircle className="w-5 h-5 text-green-500" />
                      ) : (
                        <button
                          onClick={() => handleSendVerificationEmail(user.user_id)}
                          className="text-blue-600 hover:text-blue-800 text-sm underline"
                        >
                          Send Email
                        </button>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      {user.blocked ? (
                        <span className="px-2 py-1 text-xs font-semibold rounded-full bg-red-100 text-red-800">
                          Blocked
                        </span>
                      ) : (
                        <span className="px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                          Active
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {user.last_login ? formatDate(user.last_login) : 'Never'}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {user.logins_count}
                    </td>
                    <td className="px-6 py-4 text-right text-sm font-medium">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleEditUser(user)}
                          className="text-purple-600 hover:text-purple-900"
                          title="Edit User"
                        >
                          <Edit className="w-5 h-5" />
                        </button>
                        <button
                          onClick={() => handleViewDetails(user)}
                          className="text-blue-600 hover:text-blue-900"
                          title="View Details"
                        >
                          <Eye className="w-5 h-5" />
                        </button>
                        <button
                          onClick={() => handleBlockUser(user.user_id, !user.blocked)}
                          className={`${user.blocked ? 'text-green-600 hover:text-green-900' : 'text-orange-600 hover:text-orange-900'}`}
                          title={user.blocked ? 'Unblock User' : 'Block User'}
                        >
                          <Ban className="w-5 h-5" />
                        </button>
                        <button
                          onClick={() => handleDeleteUser(user.user_id)}
                          className="text-red-600 hover:text-red-900"
                          title="Delete User"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mt-4 flex items-center justify-between">
            <button
              onClick={() => setPage(Math.max(0, page - 1))}
              disabled={page === 0}
              className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>
            <span className="text-sm text-gray-600">
              Page {page + 1} of {totalPages} ({filteredAndSortedUsers.length} users)
            </span>
            <button
              onClick={() => setPage(page + 1)}
              disabled={page + 1 >= totalPages}
              className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
            </button>
          </div>
        </>
      )}

      {showUserDetails && selectedUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-2xl w-full max-h-[80vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-bold">User Details</h2>
              <button
                onClick={() => setShowUserDetails(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-500">User ID</label>
                <p className="text-sm text-gray-900 font-mono">{selectedUser.user_id}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Email</label>
                <p className="text-sm text-gray-900">{selectedUser.email}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Name</label>
                <p className="text-sm text-gray-900">{selectedUser.name || 'N/A'}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Created At</label>
                <p className="text-sm text-gray-900">{formatDate(selectedUser.created_at)}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Updated At</label>
                <p className="text-sm text-gray-900">{formatDate(selectedUser.updated_at)}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">App Metadata</label>
                <pre className="text-sm text-gray-900 bg-gray-50 p-2 rounded">
                  {JSON.stringify(selectedUser.app_metadata, null, 2)}
                </pre>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">User Metadata</label>
                <pre className="text-sm text-gray-900 bg-gray-50 p-2 rounded">
                  {JSON.stringify(selectedUser.user_metadata, null, 2)}
                </pre>
              </div>
            </div>
          </div>
        </div>
      )}

      {showCreateModal && (
        <CreateUserModal
          edgeFunctionUrl={EDGE_FUNCTION_URL}
          supabaseAnonKey={SUPABASE_ANON_KEY}
          onClose={() => setShowCreateModal(false)}
          onSuccess={() => {
            setShowCreateModal(false);
            fetchUsers();
          }}
        />
      )}

      {showEditModal && selectedUser && (
        <EditUserModal
          user={selectedUser}
          edgeFunctionUrl={EDGE_FUNCTION_URL}
          supabaseAnonKey={SUPABASE_ANON_KEY}
          onClose={() => {
            setShowEditModal(false);
            setSelectedUser(null);
          }}
          onSuccess={() => {
            setShowEditModal(false);
            setSelectedUser(null);
            fetchUsers();
          }}
        />
      )}
    </div>
  );
}

function CreateUserModal({
  edgeFunctionUrl,
  supabaseAnonKey,
  onClose,
  onSuccess,
}: {
  edgeFunctionUrl: string;
  supabaseAnonKey: string;
  onClose: () => void;
  onSuccess: () => void;
}) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const plSession = localStorage.getItem('pl_session');
      if (!plSession) {
        setError('Not authenticated. Please log in.');
        setLoading(false);
        return;
      }

      const session = JSON.parse(plSession);

      const response = await fetch(`${edgeFunctionUrl}?path=/users`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${supabaseAnonKey}`,
          'apikey': supabaseAnonKey,
          'x-pl-auth-token': session.access_token,
        },
        body: JSON.stringify({
          email,
          password,
          name,
          connection: 'Username-Password-Authentication',
          email_verified: false,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to create user');
      }

      onSuccess();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold">Create New User</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            ✕
          </button>
        </div>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email *
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Password *
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={8}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <p className="text-xs text-gray-500 mt-1">Minimum 8 characters</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Creating...' : 'Create User'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function EditUserModal({
  user,
  edgeFunctionUrl,
  supabaseAnonKey,
  onClose,
  onSuccess,
}: {
  user: Auth0User;
  edgeFunctionUrl: string;
  supabaseAnonKey: string;
  onClose: () => void;
  onSuccess: () => void;
}) {
  const [email, setEmail] = useState(user.email);
  const [name, setName] = useState(user.name || '');
  const [password, setPassword] = useState('');
  const [blocked, setBlocked] = useState(user.blocked || false);
  const [emailVerified, setEmailVerified] = useState(user.email_verified);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const plSession = localStorage.getItem('pl_session');
      if (!plSession) {
        setError('Not authenticated. Please log in.');
        setLoading(false);
        return;
      }

      const session = JSON.parse(plSession);

      const updateData: any = {
        email,
        name,
        blocked,
        email_verified: emailVerified,
      };

      if (password) {
        updateData.password = password;
      }

      const response = await fetch(`${edgeFunctionUrl}?path=/users/${encodeURIComponent(user.user_id)}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${supabaseAnonKey}`,
          'apikey': supabaseAnonKey,
          'x-pl-auth-token': session.access_token,
        },
        body: JSON.stringify(updateData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to update user');
      }

      onSuccess();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold">Edit User</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            ✕
          </button>
        </div>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email *
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              New Password (leave blank to keep current)
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              minLength={8}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <p className="text-xs text-gray-500 mt-1">Minimum 8 characters if changing</p>
          </div>

          <div className="flex items-center gap-4">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={emailVerified}
                onChange={(e) => setEmailVerified(e.target.checked)}
                className="rounded border-gray-300"
              />
              <span className="text-sm font-medium text-gray-700">Email Verified</span>
            </label>

            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={blocked}
                onChange={(e) => setBlocked(e.target.checked)}
                className="rounded border-gray-300"
              />
              <span className="text-sm font-medium text-gray-700">Blocked</span>
            </label>
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Updating...' : 'Update User'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
