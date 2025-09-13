import React from 'react';
import { AlertTriangle, X } from 'lucide-react';

const ConfirmationPopup = ({ isOpen, onClose, onConfirm, title, message, confirmText = "Supprimer", cancelText = "Annuler", type = "danger" }) => {
    if (!isOpen) return null;

    const getColors = () => {
        switch (type) {
            case 'danger':
                return {
                    icon: 'text-red-500',
                    button: 'bg-red-600 hover:bg-red-700 focus:ring-red-500',
                    border: 'border-red-200'
                };
            case 'warning':
                return {
                    icon: 'text-yellow-500',
                    button: 'bg-yellow-600 hover:bg-yellow-700 focus:ring-yellow-500',
                    border: 'border-yellow-200'
                };
            default:
                return {
                    icon: 'text-red-500',
                    button: 'bg-red-600 hover:bg-red-700 focus:ring-red-500',
                    border: 'border-red-200'
                };
        }
    };

    const colors = getColors();

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
            <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full transform transition-all duration-300 scale-100">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-gray-100">
                    <div className="flex items-center space-x-3">
                        <div className={`w-12 h-12 rounded-2xl ${colors.icon.replace('text-', 'bg-').replace('-500', '-100')} flex items-center justify-center`}>
                            <AlertTriangle className={`w-6 h-6 ${colors.icon}`} />
                        </div>
                        <div>
                            <h3 className="text-xl font-bold text-gray-800">{title}</h3>
                            <p className="text-sm text-gray-500">Action de confirmation</p>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="w-8 h-8 rounded-lg bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors"
                    >
                        <X className="w-4 h-4 text-gray-600" />
                    </button>
                </div>

                {/* Content */}
                <div className="p-6">
                    <p className="text-gray-600 leading-relaxed mb-6">{message}</p>
                    
                    <div className="flex space-x-3">
                        <button
                            onClick={onClose}
                            className="flex-1 px-4 py-3 bg-gray-100 text-gray-700 rounded-xl font-medium hover:bg-gray-200 transition-colors"
                        >
                            {cancelText}
                        </button>
                        <button
                            onClick={onConfirm}
                            className={`flex-1 px-4 py-3 text-white rounded-xl font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 ${colors.button}`}
                        >
                            {confirmText}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ConfirmationPopup;
