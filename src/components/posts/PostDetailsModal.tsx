/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @next/next/no-img-element */
import { FaTimes, FaHeart } from 'react-icons/fa';
import UserProfileCard from '../UserProfileCard';

interface PostDetailsModalProps {
    isOpen: boolean;
    onClose: () => void;
    post: {
        userId: string;
        name: string;
        description: string;
        imageUrl: string;
        likes: any[];
        createdAt: string;
    } | null;
}

export default function PostDetailsModal({ isOpen, onClose, post }: PostDetailsModalProps) {
    if (!isOpen || !post) return null;

    return (
        <div className="fixed inset-0 bg-black/30 backdrop-blur flex items-center justify-center z-50">
            <div className="bg-white rounded-lg max-w-3xl w-full mx-4 max-h-[90vh] overflow-y-auto scrollbar-hide shadow-lg">
                <div className="p-6">
                    {/* Header with close button */}
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-2xl font-bold text-gray-900">{post.name}</h2>
                        <button
                            onClick={onClose}
                            className="text-gray-500 hover:text-gray-700 transition-colors"
                        >
                            <FaTimes size={24} />
                        </button>
                    </div>

                    {/* User Profile */}
                    <div className="mb-6">
                        <UserProfileCard userId={post.userId} />
                        <div className="text-sm text-gray-500 mt-2">
                            Posted on {new Date(post.createdAt).toLocaleDateString()}
                        </div>
                    </div>

                    {/* Image */}
                    <div className="mb-6">
                        <img
                            src={post.imageUrl}
                            alt={post.name}
                            className="w-full h-auto rounded-lg object-cover max-h-96"
                        />
                    </div>

                    {/* Description */}
                    <div className="mb-6">
                        <h3 className="text-lg font-semibold mb-2">Description</h3>
                        <p className="text-gray-700 whitespace-pre-wrap">{post.description}</p>
                    </div>

                    {/* Likes */}
                    <div className="flex items-center text-gray-600">
                        <FaHeart className="text-red-500 mr-2" />
                        <span>{post.likes.length} likes</span>
                    </div>
                </div>
            </div>
        </div>
    );
}
