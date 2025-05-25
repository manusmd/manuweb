'use client';

import { useState, useCallback, useEffect } from 'react';
import { Notification } from '../types/easter-eggs';

export function useNotifications() {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  const removeNotification = useCallback((id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  }, []);

  const addNotification = useCallback(
    (notification: Omit<Notification, 'id'>) => {
      const id = `notification-${Date.now()}-${Math.random()}`;
      const newNotification: Notification = { ...notification, id };

      setNotifications(prev => [...prev, newNotification]);

      // Auto-remove temporary notifications
      if (notification.type === 'temporary') {
        setTimeout(() => {
          removeNotification(id);
        }, notification.duration || 4000);
      }
    },
    [removeNotification]
  );

  // Helper function to show easter egg discovery notifications
  // Components should pass already translated title and message
  const showEasterEggDiscovery = useCallback(
    (title: string, message: string, icon: string) => {
      addNotification({
        title,
        message,
        icon,
        type: 'temporary',
        duration: 4000,
      });
    },
    [addNotification]
  );

  // Listen for custom easter egg discovery events
  useEffect(() => {
    const handleEasterEggDiscovered = (event: CustomEvent) => {
      const { title, message, icon, persistent, onClose } = event.detail;
      addNotification({
        title,
        message,
        icon,
        type: persistent ? 'persistent' : 'temporary',
        duration: persistent ? undefined : 4000,
        onClose,
      });
    };

    window.addEventListener('easterEggDiscovered', handleEasterEggDiscovered as EventListener);
    return () =>
      window.removeEventListener('easterEggDiscovered', handleEasterEggDiscovered as EventListener);
  }, [addNotification]);

  return {
    notifications,
    addNotification,
    removeNotification,
    showEasterEggDiscovery,
    setNotifications,
  };
}
