import React, { useEffect } from 'react';

interface SnackbarProps {
    message: string;
    type: 'success' | 'error';
    show: boolean;
    onClose: () => void;
}

const Snackbar: React.FC<SnackbarProps> = ({ message, type, show, onClose }) => {
    useEffect(() => {
        if (show) {
            const timer = setTimeout(() => {
                onClose();
            }, 3000);

            return () => clearTimeout(timer);
        }
    }, [show, onClose]);

    if (!show) return null;

    const backgroundColor = type === 'success' ? 'bg-green-500' : 'bg-red-500';

    return (
        <div className={`fixed bottom-4 right-4 ${backgroundColor} text-white px-6 py-3 rounded-md shadow-lg z-50 transition-all duration-300 transform ${show ? 'translate-y-0 opacity-100' : 'translate-y-2 opacity-0'}`}>
            {message}
        </div>
    );
};

export default Snackbar;
