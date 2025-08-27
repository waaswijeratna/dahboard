/* eslint-disable @next/next/no-img-element */
import React, { useState } from "react";
import { FaTrash, FaCheck, FaTimes } from "react-icons/fa";
import { Notice } from "@/services/noticesService";
import ConfirmationDialog from "../ConfirmationDialog";
import Snackbar from "../SnackBar";

interface NoticeCardProps {
  notice: Notice;
  onAccept?: (id: string) => void;
  onReject?: (id: string) => void;
  onDelete?: (id: string) => void;
}

const NoticeCard: React.FC<NoticeCardProps> = ({ notice, onAccept, onReject, onDelete }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [confirmDialog, setConfirmDialog] = useState({
    isOpen: false,
    action: '' as 'accept' | 'reject' | 'delete',
    message: ''
  });
  const [snackbar, setSnackbar] = useState({
    show: false,
    message: '',
    type: 'success' as 'success' | 'error'
  });

  const handleAction = (e: React.MouseEvent, action: 'accept' | 'reject' | 'delete') => {
    e.stopPropagation();
    const messages = {
      accept: "Are you sure you want to accept this notice?",
      reject: "Are you sure you want to reject this notice?",
      delete: "Are you sure you want to delete this notice?"
    };
    setConfirmDialog({
      isOpen: true,
      action,
      message: messages[action]
    });
  };

  const handleConfirm = async () => {
    try {
      switch (confirmDialog.action) {
        case 'accept':
          onAccept?.(notice._id!);
          break;
        case 'reject':
          onReject?.(notice._id!);
          break;
        case 'delete':
          onDelete?.(notice._id!);
          break;
      }
    } catch (error) {
      setSnackbar({
        show: true,
        message: `Failed to ${confirmDialog.action} notice`+error,
        type: 'error'
      });
    } finally {
      setConfirmDialog({ isOpen: false, action: 'delete', message: '' });
    }
  };

  return (
    <>
      {/* Notice Card */}
      <div 
        className="w-full bg-white rounded-lg shadow-md mb-3 cursor-pointer hover:shadow-lg transition-shadow duration-300 overflow-hidden" 
        onClick={() => setIsOpen(true)}
      >
        <div className="flex p-3">
          <div className="w-1/3 relative">
            <img className="w-full h-24 object-cover flex-shrink-0 rounded-lg" src={notice.imageUrl} alt={notice.title} />
          </div>
          <div className="w-2/3 pl-3 flex flex-col justify-between">
            <div>
              <h2 className="text-gray-800 font-semibold truncate">{notice.title}</h2>
              <p className="text-sm text-gray-600 line-clamp-2">{notice.description}</p>
            </div>
            
            {/* Action Buttons */}
            <div className="flex justify-end mt-2 gap-2" onClick={e => e.stopPropagation()}>
              {notice.status === 'inactive' ? (
                <>
                  <button
                    onClick={(e) => handleAction(e, 'accept')}
                    className="py-1.5 px-3 text-sm cursor-pointer bg-green-500 text-white rounded-full hover:bg-green-600 transition-colors flex items-center justify-center gap-1"
                  >
                    <FaCheck className="text-sm" />Accept
                  </button>
                  <button
                    onClick={(e) => handleAction(e, 'reject')}
                    className="p-1.5 px-3 text-sm cursor-pointer bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors flex items-center justify-center gap-1"
                  >
                    <FaTimes className="text-sm" />Reject
                  </button>
                </>
              ) : (
                <button
                  onClick={(e) => handleAction(e, 'delete')}
                  className="p-1.5 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                >
                  <FaTrash className="text-sm" />
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Overlay */}
      {isOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex justify-center items-center z-50">
          <div className="bg-white p-6 shadow-xl rounded-lg w-3/4 md:w-1/2 lg:w-1/3 relative">
            <button 
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 transition-colors"
              onClick={() => setIsOpen(false)}
            >
              <FaTimes size={20} />
            </button>
            <img className="w-full h-48 object-cover rounded-lg" src={notice.imageUrl} alt={notice.title} />
            <h2 className="text-xl font-semibold text-gray-800 mt-4">{notice.title}</h2>
            <p className="text-gray-600 mt-2">{notice.description}</p>
          </div>
        </div>
      )}

      {/* Confirmation Dialog */}
      <ConfirmationDialog
        isOpen={confirmDialog.isOpen}
        message={confirmDialog.message}
        onConfirm={handleConfirm}
        onCancel={() => setConfirmDialog({ isOpen: false, action: 'delete', message: '' })}
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
};

export default NoticeCard;
