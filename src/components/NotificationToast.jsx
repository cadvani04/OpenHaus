import React from 'react';
import { 
  CheckCircleIcon, 
  ExclamationTriangleIcon,
  InformationCircleIcon,
  XMarkIcon 
} from '@heroicons/react/24/outline';

const NotificationToast = ({ notification, onClose }) => {
  const getIcon = (type) => {
    switch (type) {
      case 'success':
        return <CheckCircleIcon className="w-6 h-6 text-green-600" />;
      case 'warning':
        return <ExclamationTriangleIcon className="w-6 h-6 text-yellow-600" />;
      case 'error':
        return <ExclamationTriangleIcon className="w-6 h-6 text-red-600" />;
      default:
        return <InformationCircleIcon className="w-6 h-6 text-blue-600" />;
    }
  };

  const getBackgroundColor = (type) => {
    switch (type) {
      case 'success':
        return 'bg-green-50 border-green-200';
      case 'warning':
        return 'bg-yellow-50 border-yellow-200';
      case 'error':
        return 'bg-red-50 border-red-200';
      default:
        return 'bg-blue-50 border-blue-200';
    }
  };

  const getTextColor = (type) => {
    switch (type) {
      case 'success':
        return 'text-green-800';
      case 'warning':
        return 'text-yellow-800';
      case 'error':
        return 'text-red-800';
      default:
        return 'text-blue-800';
    }
  };

  if (!notification) return null;

  return (
    <div className={`fixed top-4 right-4 z-50 max-w-sm w-full ${getBackgroundColor(notification.type)} border rounded-lg p-4 shadow-lg`}>
      <div className="flex items-start">
        <div className="flex-shrink-0">
          {getIcon(notification.type)}
        </div>
        <div className="ml-3 flex-1">
          <p className={`text-sm font-medium ${getTextColor(notification.type)}`}>
            {notification.title}
          </p>
          <p className={`mt-1 text-sm ${getTextColor(notification.type)} opacity-90`}>
            {notification.message}
          </p>
          {notification.data && (
            <div className="mt-2 text-xs text-gray-600">
              <p>Client: {notification.data.clientName}</p>
              <p>Agreement ID: {notification.data.agreementId}</p>
            </div>
          )}
        </div>
        <div className="ml-4 flex-shrink-0">
          <button
            onClick={onClose}
            className="inline-flex text-gray-400 hover:text-gray-600 focus:outline-none"
          >
            <XMarkIcon className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default NotificationToast; 