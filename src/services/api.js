// services/api.js
import axios from 'axios';

const API_URL = 'http://localhost:3001';

// Create an axios instance
const apiClient = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

export const fetchUsers = async (params = {}) => {
    try {
        const { page = 1, limit = 5, sortBy, sortOrder, search, filter } = params;

        // Build query parameters
        let query = `_page=${page}&_limit=${limit}`;

        // Add sorting if provided
        if (sortBy && sortOrder) {
            query += `&_sort=${sortBy}&_order=${sortOrder}`;
        }

        // Add search if provided
        if (search) {
            query += `&q=${search}`;
        }

        // Add filtering if provided
        if (filter && Object.keys(filter).length > 0) {
            Object.keys(filter).forEach(key => {
                if (filter[key]) {
                    query += `&${key}=${filter[key]}`;
                }
            });
        }

        const response = await apiClient.get(`/users?${query}`);
        const totalCount = response.headers['x-total-count'] || 0;

        return {
            data: response.data,
            totalCount: parseInt(totalCount),
            page: parseInt(page),
            limit: parseInt(limit),
            totalPages: Math.ceil(parseInt(totalCount) / parseInt(limit)),
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