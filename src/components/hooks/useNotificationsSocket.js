import { useEffect } from 'react';
import socket from "../../utils/socket";

export default function useNotificationsSocket({ userId, onNotification }) {
  useEffect(() => {
    if (!userId) return;

    const handleConnect = () => {
      console.log('🔌 Socket.IO connected');
    };

    const handleDisconnect = () => {
      console.log('❌ Socket.IO disconnected');
    };

    const handleNewNotification = (data) => {
      console.log('📥 Received Socket.IO message:', data);
      if (data?.notification?.receiver_user_id === userId && typeof onNotification === 'function') {
        onNotification(data.notification);
      }
    };

    const handleError = (err) => {
      console.error('🚨 Socket.IO connection error:', err.message);
    };

    socket.on('connect', handleConnect);
    socket.on('disconnect', handleDisconnect);
    socket.on('NEW_NOTIFICATION', handleNewNotification);
    socket.on('connect_error', handleError);

    return () => {
      socket.off('connect', handleConnect);
      socket.off('disconnect', handleDisconnect);
      socket.off('NEW_NOTIFICATION', handleNewNotification);
      socket.off('connect_error', handleError);
    };
  }, [userId, onNotification]);
}