import { useState, useEffect } from 'react';
import ReactModal from 'react-modal';
import { createUser, updateUser } from '../services/api';

// Bind modal app element for accessibility
if (typeof window !== 'undefined') {
    ReactModal.setAppElement('body');
}

const UserModal = ({ isOpen, onClose, onSubmit, user, mode }) => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        role: '',
        status: 'Active',
        joinDate: new Date().toISOString().substring(0, 10)
    });
    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Initialize form data when user prop changes
    useEffect(() => {
        if (user && mode === 'edit') {
            setFormData({
                name: user.name || '',
                email: user.email || '',
                role: user.role || '',
                status: user.status || 'Active',
                joinDate: user.joinDate || new Date().toISOString().substring(0, 10)
            });
        } else {
            // Reset form for new user
            setFormData({
                name: '',
                email: '',
                role: '',
                status: 'Active',
                joinDate: new Date().toISOString().substring(0, 10)
            });
        }

        setErrors({});
    }, [user, mode]);

    // Handle input changes
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));

        // Clear error for this field
        if (errors[name]) {
            setErrors(prev => ({
                ...prev,
                [name]: null
            }));
        }
    };

    // Validate form
    const validateForm = () => {
        const newErrors = {};

        if (!formData.name.trim()) {
            newErrors.name = 'Name is required';
        }

        if (!formData.email.trim()) {
            newErrors.email = 'Email is required';
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
            newErrors.email = 'Email is not valid';
        }

        if (!formData.role.trim()) {
            newErrors.role = 'Role is required';
        }

        if (!formData.joinDate) {
            newErrors.joinDate = 'Join Date is required';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm() || isSubmitting) {
            return;
        }

        setIsSubmitting(true);

        try {
            if (mode === 'edit' && user) {
                await updateUser(user.id, formData);
            } else {
                await createUser(formData);
            }

            onSubmit();
        } catch (error) {
            console.log('Error:', error);
            setErrors(prev => ({
                ...prev,
                form: 'An error occurred. Please try again.'
            }));
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <ReactModal
            isOpen={isOpen}
            onRequestClose={onClose}
            contentLabel={mode === 'edit' ? 'Edit User' : 'Create User'}
            className="max-w-md mx-auto mt-20 p-6 bg-white rounded shadow-lg"
            overlayClassName="fixed inset-0 bg-black/60 flex items-center justify-center"
        >
            <h2 className="text-xl font-bold mb-4">
                {mode === 'edit' ? 'Edit User' : 'Create User'}
            </h2>

            <form onSubmit={handleSubmit}>
                {errors.form && (
                    <div className="mb-4 text-red-500">{errors.form}</div>
                )}

                <div className="mb-4">
                    <label className="block text-gray-700 mb-1">Name</label>
                    <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        className={`w-full p-2 border rounded ${errors.name ? 'border-red-500' : 'border-gray-300'
                            }`}
                    />
                    {errors.name && (
                        <p className="text-red-500 text-sm mt-1">{errors.name}</p>
                    )}
                </div>

                <div className="mb-4">
                    <label className="block text-gray-700 mb-1">Email</label>
                    <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        className={`w-full p-2 border rounded ${errors.email ? 'border-red-500' : 'border-gray-300'
                            }`}
                    />
                    {errors.email && (
                        <p className="text-red-500 text-sm mt-1">{errors.email}</p>
                    )}
                </div>

                <div className="mb-4">
                    <label className="block text-gray-700 mb-1">Role</label>
                    <select
                        name="role"
                        value={formData.role}
                        onChange={handleChange}
                        className={`w-full p-2 border rounded ${errors.role ? 'border-red-500' : 'border-gray-300'
                            }`}
                    >
                        <option value="">Select Role</option>
                        <option value="Developer">Developer</option>
                        <option value="Designer">Designer</option>
                        <option value="Manager">Manager</option>
                        <option value="QA Engineer">QA Engineer</option>
                        <option value="Product Manager">Product Manager</option>
                    </select>
                    {errors.role && (
                        <p className="text-red-500 text-sm mt-1">{errors.role}</p>
                    )}
                </div>

                <div className="mb-4">
                    <label className="block text-gray-700 mb-1">Status</label>
                    <select
                        name="status"
                        value={formData.status}
                        onChange={handleChange}
                        className="w-full p-2 border border-gray-300 rounded"
                    >
                        <option value="Active">Active</option>
                        <option value="Inactive">Inactive</option>
                    </select>
                </div>

                <div className="mb-4">
                    <label className="block text-gray-700 mb-1">Join Date</label>
                    <input
                        type="date"
                        name="joinDate"
                        value={formData.joinDate}
                        onChange={handleChange}
                        className={`w-full p-2 border rounded ${errors.joinDate ? 'border-red-500' : 'border-gray-300'
                            }`}
                    />
                    {errors.joinDate && (
                        <p className="text-red-500 text-sm mt-1">{errors.joinDate}</p>
                    )}
                </div>

                <div className="flex justify-end space-x-2">
                    <button
                        type="button"
                        onClick={onClose}
                        className="px-4 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400"
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className={`px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700 ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''
                            }`}
                    >
                        {isSubmitting
                            ? mode === 'edit' ? 'Updating...' : 'Creating...'
                            : mode === 'edit' ? 'Update' : 'Create'}
                    </button>
                </div>
            </form>
        </ReactModal>
    );
};

export default UserModal;