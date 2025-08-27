/* eslint-disable @next/next/no-img-element */
"use client";

import { useEffect, useState } from 'react';
import { FaTrash } from 'react-icons/fa';
import { getAllUsers, deleteUserById } from '@/services/usersService';
import ConfirmationDialog from '../ConfirmationDialog';
import Snackbar from '../SnackBar';

interface UserStats {
    totalPosts: number;
    totalCampaigns: number;
}

interface User {
    _id: string;
    name: string;
    email: string;
    age: number;
    pfpUrl: string;
    stats: UserStats;
}

export default function UsersTable() {
    const [users, setUsers] = useState<User[]>([]);
    const [userRole, setUserRole] = useState<string>('');
    const [loading, setLoading] = useState(true);
    const [confirmDialog, setConfirmDialog] = useState({
        isOpen: false,
        userId: ''
    });
    const [snackbar, setSnackbar] = useState({
        show: false,
        message: '',
        type: 'success' as 'success' | 'error'
    });

    const fetchUsers = async () => {
        try {
            const data = await getAllUsers();
            const userData = localStorage.getItem('userData');
            if (userData) {
                const { email } = JSON.parse(userData);
                setUsers(data.filter((user: User) => user.email !== email));
            } else {
                setUsers(data);
            }
        } catch (error) {
            setSnackbar({
                show: true,
                message: 'Failed to fetch users: ' + error,
                type: 'error'
            });
        }
        setLoading(false);
    };

    useEffect(() => {
        const userData = localStorage.getItem('userData');
        if (userData) {
            const { role } = JSON.parse(userData);
            setUserRole(role);
        }

        fetchUsers();
    }, []);

    const handleDelete = async (id: string) => {
        if (!id) {
            setSnackbar({
                show: true,
                message: 'Failed to delete user: Invalid ID',
                type: 'error'
            });
            return;
        }

        try {
            await deleteUserById(id);
            await fetchUsers();
            setSnackbar({
                show: true,
                message: 'User deleted successfully',
                type: 'success'
            });
        } catch (error) {
            console.error('Delete failed:', error);
            setSnackbar({
                show: true,
                message: 'Failed to delete user: ' + error,
                type: 'error'
            });
        }
        setConfirmDialog({ isOpen: false, userId: '' });
    };

    if (loading) return <div className="text-center text-gray-600">Loading users...</div>;

    return (
        <div className="overflow-x-auto h-[77vh] scrollbar-hide">
            <table className="min-w-full  bg-white rounded-lg  ">
                <thead className="bg-gray-100 h-[10%]">
                    <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Profile</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Age</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Posts</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Campaigns</th>
                        {userRole === 'super' && (
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                        )}
                    </tr>
                </thead>
                <tbody className="bg-white h-[90%] divide-y divide-gray-200 overflow-y-auto scrollbar-hide">
                    {users.map((user) => (
                        <tr key={user._id} className="hover:bg-gray-50">
                            <td className="px-6 py-4 whitespace-nowrap">
                                <img
                                    src={user.pfpUrl}
                                    alt={user.name}
                                    className="w-12 h-12 rounded-full object-cover"
                                />
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">{user.name}</td>
                            <td className="px-6 py-4 whitespace-nowrap">{user.email}</td>
                            <td className="px-6 py-4 whitespace-nowrap">{user.age}</td>
                            <td className="px-6 py-4 whitespace-nowrap">
                                <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                                    {user.stats.totalPosts}
                                </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                                <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">
                                    {user.stats.totalCampaigns}
                                </span>
                            </td>
                            {userRole === 'super' && (
                                <td className="px-6 py-4 whitespace-nowrap text-center text-sm font-medium">
                                    <button
                                        onClick={() => setConfirmDialog({ isOpen: true, userId: user._id })}
                                        className="text-red-500 hover:text-red-700"
                                    >
                                        <FaTrash />
                                    </button>
                                </td>
                            )}
                        </tr>
                    ))}
                </tbody>
            </table>

            {/* Confirmation Dialog */}
            <ConfirmationDialog
                isOpen={confirmDialog.isOpen}
                message="Are you sure you want to delete this user?"
                onConfirm={() => handleDelete(confirmDialog.userId)}
                onCancel={() => setConfirmDialog({ isOpen: false, userId: '' })}
            />

            {/* Snackbar */}
            <Snackbar
                show={snackbar.show}
                message={snackbar.message}
                type={snackbar.type}
                onClose={() => setSnackbar(prev => ({ ...prev, show: false }))}
            />
        </div>
    );
}
