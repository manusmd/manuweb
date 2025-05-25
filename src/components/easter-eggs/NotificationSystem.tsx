'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, X } from 'lucide-react';
import { Notification } from '../../types/easter-eggs';

interface NotificationSystemProps {
  notifications: Notification[];
  onRemoveNotification: (id: string) => void;
}

export function NotificationSystem({ notifications, onRemoveNotification }: NotificationSystemProps) {
  return (
    <div className="fixed top-20 right-4 z-50 space-y-3 max-w-sm">
      <AnimatePresence>
        {notifications.map((notification, index) => (
          <motion.div
            key={notification.id}
            initial={{ opacity: 0, scale: 0.8, x: 100 }}
            animate={{ opacity: 1, scale: 1, x: 0 }}
            exit={{ opacity: 0, scale: 0.8, x: 100 }}
            className="bg-gradient-to-r from-purple-600 to-blue-600 text-white p-4 rounded-lg shadow-lg"
            style={{
              marginTop: index > 0 ? '12px' : '0',
            }}
          >
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-lg">{notification.icon}</span>
                <span className="font-semibold">{notification.title}</span>
              </div>
              {notification.type === 'persistent' && (
                <button
                  onClick={() => {
                    if (notification.onClose) {
                      notification.onClose();
                    }
                    onRemoveNotification(notification.id);
                  }}
                  className="text-white/70 hover:text-white transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
            <p className="text-sm opacity-90">{notification.message}</p>
            <div className="flex items-center gap-1 mt-2 text-xs opacity-75">
              <Sparkles className="w-3 h-3" />
              <span>
                {notification.type === 'persistent' ? 'Active' : 'Easter egg discovered'}
              </span>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
} 