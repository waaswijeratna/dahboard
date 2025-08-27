/* eslint-disable @next/next/no-img-element */
"use client";

import { useState, useEffect } from "react";
import { FaTrash, FaUserPlus } from "react-icons/fa";
import CreateModeratorModal from "./CreateModeratorModal";
import Snackbar from "../SnackBar";
import ConfirmationDialog from "../ConfirmationDialog";
import { getAllModerators, deleteModerator } from "@/services/authService";

interface Moderator {
  _id: string;
  name: string;
  email: string;
  age: number;
  pfpUrl: string;
  role: string;
}

export default function ModeratorsParent() {
  const [moderators, setModerators] = useState<Moderator[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [userRole, setUserRole] = useState<string>(""); // Current user's role
  const [loading, setLoading] = useState(true);
  const [snackbar, setSnackbar] = useState({
    show: false,
    message: "",
    type: "success" as "success" | "error"
  });
  const [confirmDialog, setConfirmDialog] = useState({
    isOpen: false,
    moderatorId: ""
  });

  const fetchModerators = async () => {
    try {
      const data = await getAllModerators();
      // Get current user's email from localStorage to filter them out
      const userData = localStorage.getItem("userData");
      if (userData) {
        const { email } = JSON.parse(userData);
        // Filter out the current user from the moderators list
        setModerators(data.filter((mod: Moderator) => mod.email !== email));
      } else {
        setModerators(data);
      }
    } catch (error) {
      setSnackbar({
        show: true,
        message: "Failed to fetch moderators: " + error,
        type: "error"
      });
    }
    setLoading(false);
  };

  // Fetch moderators and current user's role
  useEffect(() => {
    // Get current user's role from localStorage
    const userData = localStorage.getItem("userData");
    if (userData) {
      const { role } = JSON.parse(userData);
      setUserRole(role);
    }

    fetchModerators();
  }, []);

  const handleDelete = async (id: string) => {
    if (!id) {
      console.error('Delete failed: Moderator ID is undefined');
      setSnackbar({
        show: true,
        message: "Failed to delete moderator: Invalid ID",
        type: "error"
      });
      return;
    }

    try {
      await deleteModerator(id);
      setModerators(prev => prev.filter(mod => mod._id !== id));
      setSnackbar({
        show: true,
        message: "Moderator deleted successfully",
        type: "success"
      });
    } catch (error) {
      console.error('Delete failed:', error);
      setSnackbar({
        show: true,
        message: "Failed to delete moderator: " + error,
        type: "error"
      });
    }
    setConfirmDialog({ isOpen: false, moderatorId: "" });
  };

  if (loading) return <div className="text-center text-gray-600">Loading moderators...</div>;

  return (
    <div>
      {/* Header with Create Button (Only for super moderators) */}
      {userRole === "super" && (
        <div className="flex justify-between items-center mb-6">
          <button
            onClick={() => setShowModal(true)}
            className="flex items-center gap-2 bg-secondary cursor-pointer hover:bg-primary text-white px-4 py-2 rounded-lg transition duration-300"
          >
            <FaUserPlus />
            Create Moderator
          </button>
        </div>
      )}

      {/* Moderators Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {moderators.map(moderator => (
          <div
            key={moderator._id}
            className="bg-white rounded-lg shadow-md p-4 relative"
          >
            {/* Delete Button (Only show for super moderators) */}
            {userRole === "super" && (
              <button
                onClick={() => setConfirmDialog({ isOpen: true, moderatorId: moderator._id })}
                className="absolute top-2 cursor-pointer right-2 text-red-500 hover:text-red-600 transition-colors"
              >
                <FaTrash />
              </button>
            )}

            {/* Moderator Info */}
            <div className="flex items-center space-x-4">
              <img
                src={moderator.pfpUrl}
                alt={moderator.name}
                className="w-16 h-16 rounded-full object-cover"
              />
              <div>
                <h3 className="font-semibold text-gray-800">{moderator.name}</h3>
                <p className="text-gray-600 text-sm">{moderator.email}</p>
                <p className="text-gray-500 text-sm">Age: {moderator.age}</p>
                <p className={`text-sm ${
                  moderator.role === "super" ? "text-blue-400" : "text-gray-600"
                }`}>
                  {moderator.role === "super" ? "Super Moderator" : "Moderator"}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Create Moderator Modal */}
      {showModal && (
        <CreateModeratorModal 
          onClose={() => {
            setShowModal(false);
            fetchModerators(); // Refresh the list after creating a new moderator
          }} 
        />
      )}

      {/* Confirmation Dialog */}
      <ConfirmationDialog
        isOpen={confirmDialog.isOpen}
        message="Are you sure you want to delete this moderator?"
        onConfirm={() => handleDelete(confirmDialog.moderatorId)}
        onCancel={() => setConfirmDialog({ isOpen: false, moderatorId: "" })}
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
