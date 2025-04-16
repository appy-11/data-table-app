import { useState, useEffect } from 'react';
import { FaEdit, FaTrash, FaSort, FaSortUp, FaSortDown } from 'react-icons/fa';
import UserModal from './UserModal';
import ColumnSelector from './ColumnSelector';
import { fetchUsers, deleteUser } from '../services/api';

const UserTable = () => {
    // State variables
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);
    const [limit, setLimit] = useState(5);
    const [sortConfig, setSortConfig] = useState({ field: null, order: null });
    //a debounce mechanism for search
    const [searchTerm, setSearchTerm] = useState('');
    const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');
    const [filterConfig, setFilterConfig] = useState({});
    const [totalCount, setTotalCount] = useState(0);
    const [modalIsOpen, setModalIsOpen] = useState(false);
    const [currentUser, setCurrentUser] = useState(null);
    const [modalMode, setModalMode] = useState('create'); // 'create', 'edit'
    const [visibleColumns, setVisibleColumns] = useState({
        name: true,
        email: true,
        role: true,
        status: true,
        joinDate: true
    });


    // Load users on mount and when pagination, sorting, or filtering changes
    useEffect(() => {
        const loadUsers = async () => {
            try {
                setLoading(true);
                const params = {
                    page: currentPage,
                    limit,
                    sortBy: sortConfig.field,
                    sortOrder: sortConfig.order,
                    search: debouncedSearchTerm, // Use debounced value here
                    filter: filterConfig
                };

                const response = await fetchUsers(params);
                setUsers(response.data);
                setTotalPages(response.totalPages);
                setTotalCount(response.totalCount);
                setLoading(false);
            } catch (err) {
                setError('Failed to fetch users.');
                setLoading(false);
            }
        };

        loadUsers();
    }, [currentPage, limit, sortConfig, debouncedSearchTerm, filterConfig]); // Use debouncedSearchTerm in dependency array

    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedSearchTerm(searchTerm);
        }, 300); // 300ms delay for debouncing

        return () => clearTimeout(timer);
    }, [searchTerm]);

    // Handle sorting
    const handleSort = (field) => {
        let order = 'asc';

        if (sortConfig.field === field) {
            if (sortConfig.order === 'asc') {
                order = 'desc';
            } else if (sortConfig.order === 'desc') {
                field = null;
                order = null;
            }
        }

        setSortConfig({ field, order });
        setCurrentPage(1); // Reset to first page
    };

    // Get sort icon
    const getSortIcon = (field) => {
        if (sortConfig.field !== field) {
            return <FaSort />;
        }
        return sortConfig.order === 'asc' ? <FaSortUp /> : <FaSortDown />;
    };

    // Handle immediate search input changes
    const handleSearch = (e) => {
        setSearchTerm(e.target.value);
    };

    // Handle filter change
    const handleFilterChange = (field, value) => {
        setFilterConfig(prev => ({
            ...prev,
            [field]: value
        }));
        setCurrentPage(1); // Reset to first page
    };

    // Handle user deletion
    const handleDeleteUser = async (id) => {
        if (window.confirm('Are you sure you want to delete this user?')) {
            try {
                await deleteUser(id);

                // Reload users
                const params = {
                    page: currentPage,
                    limit,
                    sortBy: sortConfig.field,
                    sortOrder: sortConfig.order,
                    search: searchTerm,
                    filter: filterConfig
                };

                const response = await fetchUsers(params);
                setUsers(response.data);
                setTotalPages(response.totalPages);

                // If we deleted the last item on the page, go to previous page
                if (users.length === 1 && currentPage > 1) {
                    setCurrentPage(currentPage - 1);
                }
            } catch (err) {
                setError('Failed to delete user.');
            }
        }
    };

    // Handle edit user
    const handleEditUser = (user) => {
        setCurrentUser(user);
        setModalMode('edit');
        setModalIsOpen(true);
    };

    // Handle create user
    const handleCreateUser = () => {
        setCurrentUser(null);
        setModalMode('create');
        setModalIsOpen(true);
    };

    // Close modal
    const closeModal = () => {
        setModalIsOpen(false);
    };

    // Handle user modal submit (create or update)
    const handleUserSubmit = async () => {
        setModalIsOpen(false);

        // Reload users
        const params = {
            page: currentPage,
            limit,
            sortBy: sortConfig.field,
            sortOrder: sortConfig.order,
            search: searchTerm,
            filter: filterConfig
        };

        const response = await fetchUsers(params);
        setUsers(response.data);
        setTotalPages(response.totalPages);
    };

    // Toggle column visibility
    const toggleColumnVisibility = (column) => {
        setVisibleColumns(prev => ({
            ...prev,
            [column]: !prev[column]
        }));
    };

    // Render status with color
    const renderStatus = (status) => {
        const color = status === 'Active' ? 'text-green-600' : 'text-red-600';
        return <span className={color}>{status}</span>;
    };

    if (loading) return <div className="text-center p-4">Loading...</div>;
    if (error) return <div className="text-center text-red-500 p-4">{error}</div>;

    return (
        <div className="container mx-auto p-4">
            <div className="mb-4 flex justify-between items-center">
                <h1 className="text-2xl font-bold">User Management</h1>
                <button
                    onClick={handleCreateUser}
                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                >
                    Add User
                </button>
            </div>

            <div className="mb-4 flex flex-wrap gap-2 justify-between">
                {/* Search */}
                <div className="w-full md:w-auto">
                    <input
                        type="text"
                        placeholder="Search..."
                        value={searchTerm}
                        onChange={handleSearch}
                        className="border p-2 rounded w-full"
                        autoComplete="off"
                    />
                </div>

                {/* Status Filter */}
                <div className="w-full md:w-auto">
                    <select
                        value={filterConfig.status || ''}
                        onChange={(e) => handleFilterChange('status', e.target.value)}
                        className="border p-2 rounded w-full"
                    >
                        <option value="">Filter by Status</option>
                        <option value="Active">Active</option>
                        <option value="Inactive">Inactive</option>
                    </select>
                </div>

                {/* Role Filter */}
                <div className="w-full md:w-auto">
                    <select
                        value={filterConfig.role || ''}
                        onChange={(e) => handleFilterChange('role', e.target.value)}
                        className="border p-2 rounded w-full"
                    >
                        <option value="">Filter by Role</option>
                        <option value="Developer">Developer</option>
                        <option value="Designer">Designer</option>
                        <option value="Manager">Manager</option>
                        <option value="QA Engineer">QA Engineer</option>
                        <option value="Product Manager">Product Manager</option>
                    </select>
                </div>

                {/* Column Selector */}
                <ColumnSelector
                    columns={visibleColumns}
                    onToggle={toggleColumnVisibility}
                />
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
                <table className="min-w-full bg-white border border-gray-200">
                    <thead>
                        <tr className="bg-gray-100">
                            {visibleColumns.name && (
                                <th
                                    className="px-4 py-2 text-left cursor-pointer"
                                    onClick={() => handleSort('name')}
                                >
                                    <div className="flex items-center">
                                        Name {getSortIcon('name')}
                                    </div>
                                </th>
                            )}
                            {visibleColumns.email && (
                                <th
                                    className="px-4 py-2 text-left cursor-pointer"
                                    onClick={() => handleSort('email')}
                                >
                                    <div className="flex items-center">
                                        Email {getSortIcon('email')}
                                    </div>
                                </th>
                            )}
                            {visibleColumns.role && (
                                <th
                                    className="px-4 py-2 text-left cursor-pointer"
                                    onClick={() => handleSort('role')}
                                >
                                    <div className="flex items-center">
                                        Role {getSortIcon('role')}
                                    </div>
                                </th>
                            )}
                            {visibleColumns.status && (
                                <th
                                    className="px-4 py-2 text-left cursor-pointer"
                                    onClick={() => handleSort('status')}
                                >
                                    <div className="flex items-center">
                                        Status {getSortIcon('status')}
                                    </div>
                                </th>
                            )}
                            {visibleColumns.joinDate && (
                                <th
                                    className="px-4 py-2 text-left cursor-pointer"
                                    onClick={() => handleSort('joinDate')}
                                >
                                    <div className="flex items-center">
                                        Join Date {getSortIcon('joinDate')}
                                    </div>
                                </th>
                            )}
                            <th className="px-4 py-2 text-left">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.length > 0 ? (
                            users.map((user) => (
                                <tr key={user.id} className="border-t hover:bg-gray-50">
                                    {visibleColumns.name && <td className="px-4 py-2">{user.name}</td>}
                                    {visibleColumns.email && <td className="px-4 py-2">{user.email}</td>}
                                    {visibleColumns.role && <td className="px-4 py-2">{user.role}</td>}
                                    {visibleColumns.status && (
                                        <td className="px-4 py-2">{renderStatus(user.status)}</td>
                                    )}
                                    {visibleColumns.joinDate && <td className="px-4 py-2">{user.joinDate}</td>}
                                    <td className="px-4 py-2">
                                        <div className="flex space-x-2">
                                            <button
                                                onClick={() => handleEditUser(user)}
                                                className="text-blue-500 hover:text-blue-700"
                                            >
                                                <FaEdit />
                                            </button>
                                            <button
                                                onClick={() => handleDeleteUser(user.id)}
                                                className="text-red-500 hover:text-red-700"
                                            >
                                                <FaTrash />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td
                                    colSpan={
                                        Object.values(visibleColumns).filter(Boolean).length + 1
                                    }
                                    className="px-4 py-2 text-center"
                                >
                                    No users found
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* Pagination */}
            <div className="mt-4 flex justify-between items-center">
                <div>
                    <span>
                        Showing {(users.length ? (currentPage - 1) * limit + users.length : 0)} of {totalCount} entries
                    </span>
                    <select
                        value={limit}
                        onChange={(e) => {
                            setLimit(Number(e.target.value));
                            setCurrentPage(1);
                        }}
                        className="ml-2 border p-1 rounded"
                    >
                        <option value={5}>5</option>
                        <option value={10}>10</option>
                        <option value={25}>25</option>
                        <option value={50}>50</option>
                    </select>
                </div>

                <div className="flex space-x-1">
                    <button
                        onClick={() => setCurrentPage(1)}
                        disabled={currentPage === 1}
                        className={`px-3 py-1 rounded ${currentPage === 1
                            ? 'bg-gray-200 cursor-not-allowed'
                            : 'bg-blue-500 text-white hover:bg-blue-700'
                            }`}
                    >
                        First
                    </button>
                    <button
                        onClick={() => setCurrentPage(currentPage - 1)}
                        disabled={currentPage === 1}
                        className={`px-3 py-1 rounded ${currentPage === 1
                            ? 'bg-gray-200 cursor-not-allowed'
                            : 'bg-blue-500 text-white hover:bg-blue-700'
                            }`}
                    >
                        Prev
                    </button>
                    <span className="px-3 py-1">
                        Page {currentPage} of {Math.max(totalPages, 1)}
                    </span>
                    <button
                        onClick={() => setCurrentPage(currentPage + 1)}
                        disabled={currentPage === totalPages}
                        className={`px-3 py-1 rounded ${currentPage === totalPages
                            ? 'bg-gray-200 cursor-not-allowed'
                            : 'bg-blue-500 text-white hover:bg-blue-700'
                            }`}
                    >
                        Next
                    </button>
                    <button
                        onClick={() => setCurrentPage(totalPages)}
                        disabled={currentPage === totalPages}
                        className={`px-3 py-1 rounded ${currentPage === totalPages
                            ? 'bg-gray-200 cursor-not-allowed'
                            : 'bg-blue-500 text-white hover:bg-blue-700'
                            }`}
                    >
                        Last
                    </button>
                </div>
            </div>

            {/* Modal for Create/Edit User */}
            {modalIsOpen && (
                <UserModal
                    isOpen={modalIsOpen}
                    onClose={closeModal}
                    onSubmit={handleUserSubmit}
                    user={currentUser}
                    mode={modalMode}
                />
            )}
        </div>
    );
};

export default UserTable;