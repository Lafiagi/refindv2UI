import { create } from 'zustand';
import api from '../lib/api';

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'item_match' | 'claim_update' | 'system' | 'message';
  is_read: boolean;
  created_at: string;
  related_item_id?: string;
  related_claim_id?: string;
  action_url?: string;
}

interface NotificationStore {
  notifications: Notification[];
  unreadCount: number;
  isLoading: boolean;
  error: string | null;
  
  // Actions
  fetchNotifications: () => Promise<void>;
  markAsRead: (notificationId: string) => Promise<void>;
  markAllAsRead: () => Promise<void>;
  deleteNotification: (notificationId: string) => Promise<void>;
  clearError: () => void;
}

export const useNotificationStore = create<NotificationStore>((set) => ({
  notifications: [],
  unreadCount: 0,
  isLoading: false,
  error: null,

  fetchNotifications: async () => {
    try {
      set({ isLoading: true, error: null });
      const response = await api.get('/notifications/');
      const notifications = response.data.results || response.data;
      const unreadCount = notifications.filter((n: Notification) => !n.is_read).length;
      
      set({ 
        notifications,
        unreadCount,
        isLoading: false 
      });
    } catch (error: any) {
      set({ 
        error: error.response?.data?.message || 'Failed to fetch notifications',
        isLoading: false 
      });
    }
  },

  markAsRead: async (notificationId: string) => {
    try {
      await api.patch(`/notifications/${notificationId}/mark-read/`);
      
      set(state => {
        const updatedNotifications = state.notifications.map(notification =>
          notification.id === notificationId 
            ? { ...notification, is_read: true }
            : notification
        );
        const unreadCount = updatedNotifications.filter(n => !n.is_read).length;
        
        return {
          notifications: updatedNotifications,
          unreadCount
        };
      });
    } catch (error: any) {
      set({ 
        error: error.response?.data?.message || 'Failed to mark notification as read'
      });
    }
  },

  markAllAsRead: async () => {
    try {
      await api.post('/notifications/mark-all-read/');
      
      set(state => ({
        notifications: state.notifications.map(notification => ({
          ...notification,
          is_read: true
        })),
        unreadCount: 0
      }));
    } catch (error: any) {
      set({ 
        error: error.response?.data?.message || 'Failed to mark all notifications as read'
      });
    }
  },

  deleteNotification: async (notificationId: string) => {
    try {
      await api.delete(`/notifications/${notificationId}/`);
      
      set(state => {
        const updatedNotifications = state.notifications.filter(
          notification => notification.id !== notificationId
        );
        const unreadCount = updatedNotifications.filter(n => !n.is_read).length;
        
        return {
          notifications: updatedNotifications,
          unreadCount
        };
      });
    } catch (error: any) {
      set({ 
        error: error.response?.data?.message || 'Failed to delete notification'
      });
    }
  },

  clearError: () => set({ error: null })
}));