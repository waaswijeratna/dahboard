/* eslint-disable @next/next/no-img-element */
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { deleteExhibition, getAllExhibitions } from "@/services/exhibitionService";
import UserProfileCard from "@/components/UserProfileCard";
import { FaTrash } from "react-icons/fa";
import Snackbar from "../SnackBar";
import ConfirmationDialog from "../ConfirmationDialog";
import { useSearchFilters } from "../SearchFilterContext";

interface ExhibitionCardData {
    _id: string;
    name: string;
    userId: string;
    gallery: {
        name: string;
        image: string;
    };
    date: string;
    time: string;
}

export default function ExhibitionCards() {
    const router = useRouter();
    const { filters } = useSearchFilters();
    const [exhibitions, setExhibitions] = useState<ExhibitionCardData[]>([]);
    const [loading, setLoading] = useState(true);
    const [snackbar, setSnackbar] = useState({
        show: false,
        message: '',
        type: 'success' as 'success' | 'error'
    });
    const [confirmDialog, setConfirmDialog] = useState({
        isOpen: false,
        exhibitionId: ''
    });

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const data = await getAllExhibitions(filters);
                setExhibitions(data);
                console.log(data);
            } catch (error) {
                console.error("Failed to load exhibitions:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [filters]);

    const handleCardClick = (id: string) => {
        router.push(`/exhibitionsGallery?id=${id}`);
    };

    const handleDeleteClick = (e: React.MouseEvent, id: string) => {
        e.stopPropagation();
        setConfirmDialog({
            isOpen: true,
            exhibitionId: id
        });
    };

    const handleConfirmDelete = async () => {
        const id = confirmDialog.exhibitionId;
        try {
            await deleteExhibition(id);
            setExhibitions(prevExhibitions => 
                prevExhibitions.filter(exhibition => exhibition._id !== id)
            );
            setSnackbar({
                show: true,
                message: 'Exhibition deleted successfully',
                type: 'success'
            });
        } catch (error) {
            setSnackbar({
                show: true,
                message: 'Failed to delete exhibition'+error,
                type: 'error'
            });
        } finally {
            setConfirmDialog({
                isOpen: false,
                exhibitionId: ''
            });
        }
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toISOString().split('T')[0];
    };

    if (loading) {
        return <p className="text-center text-black">Loading exhibitions...</p>;
    }

    return (
        <div className="w-full h-[81vh] overflow-y-auto scrollbar-hide">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 px-4">
                {exhibitions.map((data) => (
                    <div
                        key={data._id}
                        className="w-full mx-auto bg-white shadow-lg rounded-lg overflow-hidden cursor-pointer relative"
                        onClick={() => handleCardClick(data._id)}
                    >
                        {/* Delete Button */}
                        <div 
                            className="absolute top-2 right-2 z-10 p-1.5 bg-red-500 rounded-full hover:bg-red-600 transition-colors"
                            onClick={(e) => handleDeleteClick(e, data._id)}
                        >
                            <FaTrash className="text-white text-sm" />
                        </div>

                        {/* Exhibition Name */}
                        <div className="px-3 py-2">
                            <h2 className="text-lg font-bold text-gray-800 truncate">{data.name}</h2>
                        </div>

                        {/* Image with Overlay */}
                        <div className="relative">
                            <img
                                src={data.gallery.image}
                                alt={data.name}
                                className="w-full h-36 object-cover"
                            />
                            <div className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-black to-transparent p-1.5">
                                <p className="text-white text-sm">Gallery - {data.gallery.name}</p>
                            </div>
                        </div>

                        {/* Date and Time Information */}
                        <div className="px-3 py-2 border-t border-gray-100">
                            <div className="flex flex-col gap-1">
                                <p className="text-sm text-gray-600">
                                    <span className="font-medium">Created:</span> {formatDate(data.date)}
                                </p>
                                <p className="text-sm text-gray-600">
                                    <span className="font-medium">Starts at:</span> {data.time}
                                </p>
                            </div>
                        </div>

                        {/* Exhibition By */}
                        <div className="px-3 py-2 border-t border-gray-100">
                            <UserProfileCard userId={data.userId} />
                        </div>
                    </div>
                ))}
            </div>

            {/* Confirmation Dialog */}
            <ConfirmationDialog
                isOpen={confirmDialog.isOpen}
                message="Are you sure you want to delete this exhibition?"
                onConfirm={handleConfirmDelete}
                onCancel={() => setConfirmDialog({ isOpen: false, exhibitionId: '' })}
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
