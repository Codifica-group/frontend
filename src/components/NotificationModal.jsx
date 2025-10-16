import React from 'react';
import '../styles/NotificationModal.css';

const NotificationModal = ({ isOpen, type, message, onClose }) => {
    if (!isOpen) return null;

    const getIconClass = () => {
        switch (type) {
            case 'success': return 'notification-icon-success';
            case 'error': return 'notification-icon-error';
            case 'warning': return 'notification-icon-warning';
            case 'info': return 'notification-icon-info';
            default: return 'notification-icon-info';
        }
    };

    const getModalClass = () => {
        return `notification-modal notification-modal-${type}`;
    };

    return (
        <div className="notification-modal-overlay" onClick={onClose}>
            <div className={getModalClass()} onClick={(e) => e.stopPropagation()}>
                <div className="notification-header">
                    <div className={getIconClass()}>
                        {type === 'success' && '✓'}
                        {type === 'error' && '✕'}
                        {type === 'warning' && '⚠'}
                        {type === 'info' && 'ℹ'}
                    </div>
                    <button className="notification-close" onClick={onClose}>×</button>
                </div>
                <div className="notification-content">
                    <p>{message}</p>
                </div>
                <div className="notification-footer">
                    <button onClick={onClose} className="notification-btn">OK</button>
                </div>
            </div>
        </div>
    );
};

export default NotificationModal;