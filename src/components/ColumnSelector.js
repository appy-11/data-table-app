// components/ColumnSelector.js
import { useState, useRef, useEffect } from 'react';
import { FaColumns } from 'react-icons/fa';

const ColumnSelector = ({ columns, onToggle }) => {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    return (
        <div className="relative" ref={dropdownRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="border p-2 rounded flex items-center bg-white"
            >
                <FaColumns className="mr-1" /> Columns
            </button>

            {isOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-10 border border-gray-200">
                    <div className="py-1">
                        {Object.entries(columns).map(([column, isVisible]) => (
                            <label
                                key={column}
                                className="flex items-center px-4 py-2 hover:bg-gray-100 cursor-pointer"
                            >
                                <input
                                    type="checkbox"
                                    checked={isVisible}
                                    onChange={() => onToggle(column)}
                                    className="mr-2"
                                />
                                <span className="capitalize">{column}</span>
                            </label>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default ColumnSelector;