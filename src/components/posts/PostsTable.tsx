/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @next/next/no-img-element */
"use client";

import { useEffect, useState } from 'react';
import { FaTrash } from 'react-icons/fa';
import { getUserPosts, deletePost } from '@/services/postsService';
import ConfirmationDialog from '../ConfirmationDialog';
import Snackbar from '../SnackBar';

interface Post {
    userId: string;
    name: string;
    description: string;
    imageUrl: string;
    reactions: any[];
    createdAt: string;
    updatedAt: string;
    id: string;
}

export default function PostsTable() {
    const [posts, setPosts] = useState<Post[]>([]);
    const [userRole, setUserRole] = useState<string>('');
    const [loading, setLoading] = useState(true);
    const [confirmDialog, setConfirmDialog] = useState({
        isOpen: false,
        postId: ''
    });
    const [snackbar, setSnackbar] = useState({
        show: false,
        message: '',
        type: 'success' as 'success' | 'error'
    });

    const fetchPosts = async () => {
        try {
            const data = await getUserPosts();
            if (data) {
                setPosts(data);
            }
        } catch (error) {
            setSnackbar({
                show: true,
                message: 'Failed to fetch posts: ' + error,
                type: 'error'
            });
        }
        setLoading(false);
    };

    useEffect(() => {
        // Get current user's role from localStorage
        const userData = localStorage.getItem('userData');
        if (userData) {
            const { role } = JSON.parse(userData);
            setUserRole(role);
        }

        fetchPosts();
    }, []);

    const handleDelete = async (id: string) => {
        if (!id) {
            setSnackbar({
                show: true,
                message: 'Failed to delete post: Invalid ID',
                type: 'error'
            });
            return;
        }

        try {
            const success = await deletePost(id);
            if (success) {
                await fetchPosts(); // Refresh the list
                setSnackbar({
                    show: true,
                    message: 'Post deleted successfully',
                    type: 'success'
                });
            } else {
                throw new Error('Failed to delete post');
            }
        } catch (error) {
            console.error('Delete failed:', error);
            setSnackbar({
                show: true,
                message: 'Failed to delete post: ' + error,
                type: 'error'
            });
        }
        setConfirmDialog({ isOpen: false, postId: '' });
    };

    if (loading) return <div className="text-center text-gray-600">Loading posts...</div>;

    return (
        <div className="overflow-x-auto h-[77vh] scrollbar-hide">
            <table className="min-w-full bg-white rounded-lg">
                <thead className="bg-gray-100 h-[10%]">
                    <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Image</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Created Date</th>
                        {/* <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Reactions</th> */}
                        {userRole === 'super' && (
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                        )}
                    </tr>
                </thead>
                <tbody className="bg-white h-[90%] divide-y divide-gray-200 overflow-y-auto scrollbar-hide">
                    {posts.map((post) => (
                        <tr key={post.id} className="hover:bg-gray-50">
                            <td className="px-6 py-4 whitespace-nowrap">
                                <img
                                    src={post.imageUrl}
                                    alt={post.name}
                                    className="w-16 h-16 rounded-lg object-cover"
                                />
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                                <div className="text-sm font-medium text-gray-900">{post.name}</div>
                            </td>
                            <td className="px-6 py-4">
                                <div className="text-sm text-gray-900 max-w-xs truncate">
                                    {post.description}
                                </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                                <div className="text-sm text-gray-500">
                                    {new Date(post.createdAt).toLocaleDateString()}
                                </div>
                            </td>
                            {/* <td className="px-6 py-4 whitespace-nowrap">
                                <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                                    {post.reactions.length}
                                </span>
                            </td> */}
                            {userRole === 'super' && (
                                <td className="px-6 py-4 whitespace-nowrap text-center text-sm font-medium">
                                    <button
                                        onClick={() => setConfirmDialog({ isOpen: true, postId: post.id })}
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
                message="Are you sure you want to delete this post?"
                onConfirm={() => handleDelete(confirmDialog.postId)}
                onCancel={() => setConfirmDialog({ isOpen: false, postId: '' })}
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
