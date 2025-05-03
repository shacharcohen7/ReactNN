// src/hooks/useNotificationsSocket.js
import { useEffect, useRef } from 'react';
import { io } from 'socket.io-client';

export default function useNotificationsSocket({ userId, onNotification }) {
  const socketRef = useRef(null);

  useEffect(() => {
    if (!userId) return;

    const isSecure = window.location.protocol === 'https:';
    const baseURL = isSecure
      ? 'https://negevnerds.cs.bgu.ac.il'
      : 'http://localhost:5001';

    // socketRef.current = io(baseURL, {
    //   transports: ['websocket'],
    //   withCredentials: true,
    // });
    const token = localStorage.getItem('access_token');

    socketRef.current = io(baseURL, {
        transports: ['websocket', 'polling'],
        withCredentials: true,
        query: {
          token: localStorage.getItem("access_token")
        }
      });
      

    socketRef.current.on('connect', () => {
      console.log('🔌 Socket.IO connected');
    });

    socketRef.current.on('disconnect', () => {
      console.log('❌ Socket.IO disconnected');
    });

    socketRef.current.on('NEW_NOTIFICATION', (data) => {
      console.log('📥 Received Socket.IO message:', data);
      if (data?.notification?.receiver_user_id === userId && typeof onNotification === 'function') {
        onNotification(data.notification);
      }
    });

    socketRef.current.on('connect_error', (err) => {
      console.error('🚨 Socket.IO connection error:', err.message);
    });

    return () => {
      socketRef.current.disconnect();
    };
  }, [userId, onNotification]);
}
