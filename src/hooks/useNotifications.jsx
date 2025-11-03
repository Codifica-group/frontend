import { useState } from "react";

export const useNotifications = () => {
    const [notificationModal, setNotificationModal] = useState({
        isOpen: false,
        type: 'info',
        message: ''
    });

    const [alertSucesso, setAlertSucesso] = useState({
        isOpen: false,
        mensagem: ''
    });

    const showNotification = (type, message) => {
        if (type === 'success') {
            setAlertSucesso({
                isOpen: true,
                mensagem: message
            });
        } else {
            setNotificationModal({
                isOpen: true,
                type,
                message
            });
        }
    };

    const closeNotification = () => {
        setNotificationModal({ isOpen: false, type: 'info', message: '' });
    };

    const closeAlertSucesso = () => {
        setAlertSucesso({ isOpen: false, mensagem: '' });
    };

    return {
        notificationModal,
        alertSucesso,
        showNotification,
        closeNotification,
        closeAlertSucesso
    };
};