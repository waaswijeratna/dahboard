import React, { useEffect, useState } from "react";
import { getNotices, deleteNotice, updateNotice, Notice } from "../../services/noticesService";
import NoticeCard from "./NoticeCard";
import Snackbar from "../SnackBar";

const NoticesContainer: React.FC = () => {
  const [notices, setNotices] = useState<Notice[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [snackbar, setSnackbar] = useState({
    show: false,
    message: '',
    type: 'success' as 'success' | 'error'
  });

  const fetchNotices = async () => {
    setLoading(true);
    const data = await getNotices();
    if (data) {
      setNotices(data);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchNotices();
  }, []);

  const handleAccept = async (id: string) => {
    try {
      const response = await updateNotice(id, { status: 'active' });
      if (response) {
        await fetchNotices();
        setSnackbar({
          show: true,
          message: 'Notice accepted successfully',
          type: 'success'
        });
      } else {
        throw new Error('Failed to accept notice');
      }
    } catch (error) {
      setSnackbar({
        show: true,
        message: 'Failed to accept notice' + error,
        type: 'error'
      });
    }
  };

  const handleReject = async (id: string) => {
    try {
      const response = await deleteNotice(id);
      if (response) {
        setNotices(prev => prev.filter(notice => notice._id !== id));
        setSnackbar({
          show: true,
          message: 'Notice rejected successfully',
          type: 'success'
        });
      } else {
        throw new Error('Failed to reject notice');
      }
    } catch (error) {
      setSnackbar({
        show: true,
        message: 'Failed to reject notice' + error,
        type: 'error'
      });
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const response = await deleteNotice(id);
      if (response) {
        setNotices(prev => prev.filter(notice => notice._id !== id));
        setSnackbar({
          show: true,
          message: 'Notice deleted successfully',
          type: 'success'
        });
      } else {
        throw new Error('Failed to delete notice');
      }
    } catch (error) {
      setSnackbar({
        show: true,
        message: 'Failed to delete notice' + error,
        type: 'error'
      });
    }
  };

  const activeNotices = notices.filter(notice => notice.status === 'active');
  const inactiveNotices = notices.filter(notice => notice.status === 'inactive');

  if (loading) return <p className="text-center text-gray-600">Loading notices...</p>;

  return (
    <div className="w-full h-[81vh]">
      <div className="flex gap-2">
        {/* Inactive Notices Section */}
        <div className="w-1/2 h-full p-2">
          <div className="h-[77vh] bg-white rounded-lg shadow-md p-4 ">
            <h2 className="h-[10%] text-lg font-semibold text-gray-800 mb-4 pb-2 border-b">Pending Notices</h2>
            <div className="space-y-2 h-[90%] overflow-y-auto scrollbar-hide">
              {inactiveNotices.length > 0 ? (
                inactiveNotices.map((notice) => (
                  <NoticeCard
                    key={notice._id}
                    notice={notice}
                    onAccept={handleAccept}
                    onReject={handleReject}
                  />
                ))
              ) : (
                <p className="text-gray-500 text-center py-4">No pending notices available.</p>
              )}
            </div>
          </div>
        </div>

        {/* Active Notices Section */}
        <div className="w-1/2 h-full p-2">
          <div className="h-[77vh] bg-white rounded-lg shadow-md p-4">
            <h2 className="h-[1/5] text-lg font-semibold text-gray-800 mb-4 pb-2 border-b">Active Notices</h2>
            <div className="space-y-2 h-4/5 overflow-y-auto scrollbar-hide">
              {activeNotices.length > 0 ? (
                activeNotices.map((notice) => (
                  <NoticeCard
                    key={notice._id}
                    notice={notice}
                    onDelete={handleDelete}
                  />
                ))
              ) : (
                <p className="text-gray-500 text-center py-4">No active notices available.</p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Snackbar */}
      <Snackbar
        show={snackbar.show}
        message={snackbar.message}
        type={snackbar.type}
        onClose={() => setSnackbar(prev => ({ ...prev, show: false }))}
      />

    </div>
  );
};

export default NoticesContainer;
