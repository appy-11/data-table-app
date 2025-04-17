import axios from 'axios';

const API_URL = 'http://localhost:3001';

// Create an axios instance
const apiClient = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3001',
    headers: {
        'Content-Type': 'application/json',
    },
});


export const fetchUsers = async (params = {}) => {
    try {
        const { page = 1, limit = 5, sortBy, sortOrder, search, filter } = params;

        // If we have a search term, implement multi-field search
        if (search && search.trim()) {
            // First, get all users with the filters applied (but no pagination)
            let filterQuery = '';

            // Add filtering if provided
            if (filter && Object.keys(filter).length > 0) {
                Object.keys(filter).forEach(key => {
                    if (filter[key]) {
                        filterQuery += `&${key}=${encodeURIComponent(filter[key])}`;
                    }
                });
            }

            // Get all users with just the filters (no pagination, no search)
            const allUsersResponse = await apiClient.get(`/users?${filterQuery}`, {
                validateStatus: () => true
            });

            // Perform client-side search across multiple fields
            const searchTerm = search.toLowerCase();
            const searchResults = allUsersResponse.data.filter(user =>
                (user.name?.toLowerCase().includes(searchTerm)) ||
                (user.email?.toLowerCase().includes(searchTerm)) ||
                (user.role?.toLowerCase().includes(searchTerm)) ||
                (user.status?.toLowerCase().includes(searchTerm))
            );

            // Apply sorting if needed
            if (sortBy && sortOrder) {
                searchResults.sort((a, b) => {
                    const aValue = a[sortBy]?.toLowerCase() || '';
                    const bValue = b[sortBy]?.toLowerCase() || '';

                    if (sortOrder === 'asc') {
                        return aValue.localeCompare(bValue);
                    } else {
                        return bValue.localeCompare(aValue);
                    }
                });
            }

            // Apply pagination manually
            const startIndex = (page - 1) * limit;
            const paginatedResults = searchResults.slice(startIndex, startIndex + limit);

            return {
                data: paginatedResults,
                totalCount: searchResults.length,
                page: parseInt(page),
                limit: parseInt(limit),
                totalPages: Math.ceil(searchResults.length / limit),
            };
        }

        // If no search term, use the regular API with pagination
        let query = `_page=${page}&_limit=${limit}`;

        // Add sorting if provided
        if (sortBy && sortOrder) {
            query += `&_sort=${sortBy}&_order=${sortOrder}`;
        }

        // Add filtering if provided
        if (filter && Object.keys(filter).length > 0) {
            Object.keys(filter).forEach(key => {
                if (filter[key]) {
                    query += `&${key}=${encodeURIComponent(filter[key])}`;
                }
            });
        }

        console.log('Query:', query); // Debugging log
        const response = await apiClient.get(`/users?${query}`, {
            validateStatus: () => true // avoids 404 on empty result
        });

        // Parse total count from headers
        const totalCount = parseInt(response.headers['x-total-count'], 10);

        if (isNaN(totalCount)) {
            // Make a separate call to count total users matching the filter
            const countQuery = query.replace(`_page=${page}&_limit=${limit}`, '');
            const countResponse = await apiClient.get(`/users?${countQuery}`);
            const calculatedTotal = countResponse.data.length;
            console.log('Calculated total count:', calculatedTotal);

            return {
                data: response.data,
                totalCount: calculatedTotal,
                page: parseInt(page),
                limit: parseInt(limit),
                totalPages: Math.ceil(calculatedTotal / limit),
            };
        }

        return {
            data: response.data,
            totalCount: totalCount,
            page: parseInt(page),
            limit: parseInt(limit),
            totalPages: Math.ceil(totalCount / limit),
        };
    } catch (error) {
        console.error('Error fetching users:', error);
        throw error;
    }
};

export const getUserById = async (id) => {
    try {
        const response = await apiClient.get(`/users/${id}`);
        return response.data;
    } catch (error) {
        console.error(`Error fetching user with id ${id}:`, error);
        throw error;
    }
};

export const createUser = async (userData) => {
    try {
        const response = await apiClient.post('/users', userData);
        return response.data;
    } catch (error) {
        console.error('Error creating user:', error);
        throw error;
    }
};

export const updateUser = async (id, userData) => {
    try {
        const response = await apiClient.put(`/users/${id}`, userData);
        return response.data;
    } catch (error) {
        console.error(`Error updating user with id ${id}:`, error);
        throw error;
    }
};

export const deleteUser = async (id) => {
    try {
        const response = await apiClient.delete(`/users/${id}`);
        return response.data;
    } catch (error) {
        console.error(`Error deleting user with id ${id}:`, error);
        throw error;
    }
};