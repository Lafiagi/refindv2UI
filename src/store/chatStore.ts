import { create } from 'zustand';
import api from '../lib/api';

export interface Message {
  id: number;
  conversation: number;
  sender: number;
  sender_username: string;
  sender_avatar?: string;
  content: string;
  timestamp: string;
  status?: 'sent' | 'delivered' | 'read';
  is_read: boolean;
  delivered_at?: string | null;
  read_at?: string | null;
  attachment?: string;
}

export interface Conversation {
  id: number;
  participants: Array<{
    id: number;
    username: string;
    profile_picture?: string;
  }>;
  other_participant?: {
    id: number;
    username: string;
    profile_picture?: string;
  };
  last_message?: Message;
  unread_count: number;
  created_at: string;
  updated_at: string;
  lost_item?: number;
  found_item?: number;
}

interface ChatStore {
  conversations: Conversation[];
  currentConversation: Conversation | null;
  messages: Message[];
  isLoading: boolean;
  error: string | null;
  unreadCount: number;
  
  // Actions
  fetchConversations: () => Promise<void>;
  fetchConversation: (id: number) => Promise<void>;
  fetchMessages: (conversationId: number) => Promise<void>;
  sendMessage: (conversationId: number, content: string) => Promise<void>;
  createConversation: (otherUserId: number, initialMessage?: string, itemId?: number, itemType?: 'lost' | 'found') => Promise<Conversation>;
  markAllRead: (conversationId: number) => Promise<void>;
  addMessage: (message: Message) => void;
  updateMessage: (message: Message) => void;
  fetchUnreadCount: () => Promise<void>;
  clearError: () => void;
}

export const useChatStore = create<ChatStore>((set, get) => ({
  conversations: [],
  currentConversation: null,
  messages: [],
  isLoading: false,
  error: null,
  unreadCount: 0,

  fetchConversations: async () => {
    try {
      set({ isLoading: true, error: null });
      const response = await api.get('/messages/conversations/');
      set({ 
        conversations: response.data.results || response.data,
        isLoading: false 
      });
    } catch (error: any) {
      set({ 
        error: error.response?.data?.message || 'Failed to fetch conversations',
        isLoading: false 
      });
    }
  },

  fetchConversation: async (id: number) => {
    try {
      set({ isLoading: true, error: null });
      const response = await api.get(`/messages/conversations/${id}/`);
      set({ 
        currentConversation: response.data,
        isLoading: false 
      });
    } catch (error: any) {
      set({ 
        error: error.response?.data?.message || 'Failed to fetch conversation',
        isLoading: false 
      });
    }
  },

  fetchMessages: async (conversationId: number) => {
    try {
      set({ isLoading: true, error: null });
      const response = await api.get(`/messages/conversations/${conversationId}/messages/`);
      set({ 
        messages: response.data,
        isLoading: false 
      });
    } catch (error: any) {
      set({ 
        error: error.response?.data?.message || 'Failed to fetch messages',
        isLoading: false 
      });
    }
  },

  sendMessage: async (conversationId: number, content: string) => {
    try {
      const response = await api.post('/messages/messages/', {
        conversation: conversationId,
        content
      });
      
      // Add message optimistically (will be updated/confirmed via WebSocket)
      const currentMessages = get().messages;
      const messageExists = currentMessages.some(m => m.id === response.data.id);
      
      if (!messageExists) {
        set(state => ({
          messages: [...state.messages, response.data]
        }));
      }
    } catch (error: any) {
      set({ 
        error: error.response?.data?.message || 'Failed to send message'
      });
      throw error;
    }
  },

  createConversation: async (otherUserId: number, initialMessage?: string, itemId?: number, itemType?: 'lost' | 'found') => {
    try {
      set({ isLoading: true, error: null });
      const data: any = {
        other_user_id: otherUserId,
        initial_message: initialMessage || ''
      };
      
      if (itemType === 'lost' && itemId) {
        data.lost_item_id = itemId;
      } else if (itemType === 'found' && itemId) {
        data.found_item_id = itemId;
      }
      
      const response = await api.post('/messages/conversations/', data);
      
      set(state => ({ 
        conversations: [response.data, ...state.conversations],
        currentConversation: response.data,
        isLoading: false 
      }));
      
      return response.data;
    } catch (error: any) {
      set({ 
        error: error.response?.data?.message || 'Failed to create conversation',
        isLoading: false 
      });
      throw error;
    }
  },

  markAllRead: async (conversationId: number) => {
    try {
      await api.post(`/messages/conversations/${conversationId}/mark_all_read/`);
      
      // Update unread count locally
      set(state => ({
        conversations: state.conversations.map(conv =>
          conv.id === conversationId ? { ...conv, unread_count: 0 } : conv
        )
      }));
      
      get().fetchUnreadCount();
    } catch (error: any) {
      set({ 
        error: error.response?.data?.message || 'Failed to mark messages as read'
      });
    }
  },

  addMessage: (message: Message) => {
    set(state => {
      // Check if message already exists to avoid duplicates
      const exists = state.messages.some(m => m.id === message.id);
      if (exists) {
        return state;
      }
      return {
        messages: [...state.messages, message]
      };
    });
  },

  updateMessage: (message: Message) => {
    set(state => ({
      messages: state.messages.map(m => m.id === message.id ? message : m)
    }));
  },

  fetchUnreadCount: async () => {
    try {
      const response = await api.get('/messages/unread-count/');
      set({ unreadCount: response.data.unread_count });
    } catch (error: any) {
      // Silent fail for unread count
    }
  },

  clearError: () => set({ error: null })
}));
