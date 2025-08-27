/* eslint-disable @next/next/no-img-element */
import React, { useState } from "react";
import { Advertisements } from "@/types";
import { FaEdit, FaTrash, FaTimes, FaPhone, FaImages } from "react-icons/fa";
import moment from "moment";
import UserProfileCard from "../UserProfileCard";
import Snackbar from "../SnackBar";
import ConfirmationDialog from "../ConfirmationDialog";
import { deleteAd } from "@/services/advertisementsService";

interface AdCardProps {
    ad: Advertisements;
    onEdit: (ad: Advertisements) => void;
    onDelete: (id: string) => void;
    myAds: boolean;
}

export default function AdCard({ ad, onEdit, onDelete, myAds }: AdCardProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [confirmDialog, setConfirmDialog] = useState({
        isOpen: false,
        adId: ''
    });
    const [snackbar, setSnackbar] = useState({
        show: false,
        message: '',
        type: 'success' as 'success' | 'error'
    });

    // Format createdAt as relative time (e.g., "2 days ago")
    const formattedTime = ad.createdAt ? moment(ad.createdAt).fromNow() : "Unknown";

    const handleDeleteClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        setConfirmDialog({
            isOpen: true,
            adId: ad.id!
        });
    };

    const handleConfirmDelete = async () => {
        try {
            const success = await deleteAd(confirmDialog.adId);
            if (success) {
                onDelete(confirmDialog.adId);
                setSnackbar({
                    show: true,
                    message: 'Advertisement deleted successfully',
                    type: 'success'
                });
            } else {
                throw new Error('Failed to delete advertisement');
            }
        } catch (error) {
            setSnackbar({
                show: true,
                message: 'Failed to delete advertisement'+error,
                type: 'error'
            });
        } finally {
            setConfirmDialog({
                isOpen: false,
                adId: ''
            });
        }
    };

    return (
        <>
            {/* Small Preview Card */}
            <div
                className="bg-white shadow-lg rounded-lg p-4 cursor-pointer hover:shadow-xl transition duration-300 relative"
                onClick={() => setIsOpen(true)}
            >
                {/* Delete Button (Always visible) */}
                <div 
                    className="absolute top-2 right-2 z-10 p-1.5 bg-red-500 rounded-full hover:bg-red-600 transition-colors"
                    onClick={handleDeleteClick}
                >
                    <FaTrash className="text-white text-sm" />
                </div>

                <div className="mb-2" onClick={(e) => e.stopPropagation()}>
                    <UserProfileCard userId={ad.userId} />
                </div>
                <img src={ad.imageUrl} alt={ad.name} className="w-full h-40 object-cover rounded-md" />
                <h2 className="text-gray-800 font-bold mt-2 truncate">{ad.name}</h2>
                <div className="flex justify-between items-center">
                    <p className="text-lg text-green-600 font-semibold mt-1">${ad.price}</p>
                    <p className="text-gray-500 text-sm">{formattedTime}</p>
                </div>

                {myAds && (
                    <div className="flex justify-start mt-3 gap-4">
                        <button
                            onClick={(e) => { e.stopPropagation(); onEdit(ad); }}
                            className="cursor-pointer text-blue-500 hover:text-blue-600 duration-300"
                        >
                            <FaEdit size={20} />
                        </button>
                    </div>
                )}
            </div>


            {/* Full Detail Overlay */}
            {isOpen && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-md flex justify-center items-center z-50">
                    <div className="bg-white px-6 py-6 rounded-lg w-[80vw] h-[80vh] overflow-y-auto scrollbar-hide relative flex shadow-xl">
                        <button
                            className="absolute top-3 right-3 text-gray-600 cursor-pointer hover:text-gray-800 duration-300 text-2xl"
                            onClick={() => setIsOpen(false)}
                        >
                            <FaTimes />
                        </button>

                        {/* Left Section - Image */}
                        <div className="w-1/2">
                            <img src={ad.imageUrl} alt={ad.name} className="w-full h-full object-cover rounded-md shadow-md" />
                        </div>

                        {/* Right Section - Details */}
                        <div className="w-1/2 pl-6 flex flex-col justify-between">
                            <div className="mb-2" onClick={(e) => e.stopPropagation()}>
                                <UserProfileCard userId={ad.userId} />
                            </div>
                            <h2 className="text-2xl font-bold text-gray-800">{ad.name}</h2>
                            <p className="text-lg font-semibold text-green-600 mt-1">${ad.price}</p>
                            <p className="text-gray-500 text-sm">Posted {formattedTime}</p>

                            <hr className="my-3 border-gray-200" />

                            <p className="text-gray-700">{ad.description}</p>

                            {/* Category with Icon */}
                            <p className="text-gray-700 mt-2 flex items-center">
                                <FaImages className="text-blue-500 mr-2" /> {ad.category}
                            </p>

                            {/* Contact Number with Icon & Highlight */}
                            <p className="text-gray-700 mt-2 flex items-center font-semibold hover:text-blue-600 duration-300">
                                <FaPhone className="text-blue-500 mr-2" /> {ad.contact}
                            </p>

                            {/* Edit & Delete Buttons (Only if myAds is true) */}
                            {myAds && (
                                <div className="flex justify-between mt-4">
                                    <button
                                        onClick={() => onEdit(ad)}
                                        className="cursor-pointer text-blue-500 hover:text-blue-600 duration-300 flex items-center"
                                    >
                                        <FaEdit size={20} className="mr-2" /> Edit
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {/* Confirmation Dialog */}
            <ConfirmationDialog
                isOpen={confirmDialog.isOpen}
                message="Are you sure you want to delete this advertisement?"
                onConfirm={handleConfirmDelete}
                onCancel={() => setConfirmDialog({ isOpen: false, adId: '' })}
            />

            {/* Snackbar */}
            <Snackbar
                show={snackbar.show}
                message={snackbar.message}
                type={snackbar.type}
                onClose={() => setSnackbar(prev => ({ ...prev, show: false }))}
            />
        </>
    );
}
