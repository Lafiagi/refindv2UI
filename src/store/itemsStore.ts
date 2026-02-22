import { create } from 'zustand';
import api from '../lib/api';

export interface Item {
  id: number;
  title: string;
  description: string;
  category?: { id: number; name: string; slug: string };
  primary_image?: string;
  images?: Array<{ id: number; image: string; is_primary: boolean }>;
  lost_found_location: string;
  latitude?: number;
  longitude?: number;
  address?: string;
  city?: string;
  state?: string;
  country?: string;
  status: string;
  priority: string;
  is_priority: boolean;
  lost_found_date: string;
  created_at: string;
  reward_offered: string;
  tags?: string;
  user: { id: number; username: string; profile_picture?: string };
  views_count: number;
  likes_count: number;
  is_liked?: boolean;
  recovered_at?: string;
  recovered_by?: {
    id: number;
    username: string;
    profile_picture?: string;
  };
  verification_questions?: Array<{ question: string; answer: string }>;

  // Registered Item fields
  serial_number?: string;
  imei?: string;
  purchase_date?: string;
  purchase_location?: string;
  value?: number;

  // Found Item Organization
  organization?: { id: number; name: string; slug: string; logo?: string; org_type: string };
  organization_location?: { id: number; name: string; address: string };
}

export interface RegisteredItem extends Item {
  // Specific interface if needed, but Item covers it mostly
}

export interface Claim {
  id: number;
  lost_item?: Item;
  found_item?: Item;
  lost_item_id?: number;
  found_item_id?: number;
  claimant: { id: number; username: string; profile_picture?: string };
  owner: { id: number; username: string; profile_picture?: string };
  message: string;
  status: 'requested' | 'accepted' | 'rejected' | 'appealed' | 'closed';
  rejection_reason?: string;
  evidence_images?: string[];
  model_number?: string;
  serial_number?: string;
  imei?: string;
  year_purchased?: number;
  purchase_location?: string;
  unique_features?: string;
  appeal_count?: number;
  appeal_message?: string;
  appeal_files?: string;
  appeal_files_list?: Array<{ id: number; file: string; uploaded_at: string }>;
  created_at: string;
  updated_at: string;
  decided_at?: string;
}

interface ItemsState {
  lostItems: Item[];
  foundItems: Item[];
  myLostItems: Item[];
  myFoundItems: Item[];
  registeredItems: Item[];
  categories: Array<{ id: number; name: string; slug: string; icon?: string }>;
  isLoading: boolean;
  claimsLoading: boolean;
  myClaims: Claim[];
  ownerClaims: Claim[];
  filters: {
    category?: number;
    status?: string;
    city?: string;
    search?: string;
  };
  fetchLostItems: (params?: any) => Promise<void>;
  fetchFoundItems: (params?: any) => Promise<void>;
  fetchMyLostItems: () => Promise<void>;
  fetchMyFoundItems: () => Promise<void>;
  fetchRegisteredItems: () => Promise<void>;
  fetchCategories: () => Promise<void>;
  createLostItem: (data: FormData) => Promise<Item>;
  createFoundItem: (data: FormData) => Promise<Item>;
  createRegisteredItem: (data: FormData) => Promise<Item>;
  reportRegisteredItemAsLost: (id: number, data: { lost_date: string }) => Promise<{ lost_item_id: number }>;
  likeItem: (itemId: number, type: 'lost' | 'found') => Promise<void>;
  createClaim: (payload: FormData) => Promise<any>;
  fetchItemClaims: (itemId: number, itemType: 'lost' | 'found') => Promise<Claim[]>;
  fetchMyClaims: () => Promise<void>;
  fetchOwnerClaims: () => Promise<void>;
  respondToClaim: (id: number, action: 'accept' | 'reject', data?: { rejection_reason?: string }) => Promise<void>;
  appealClaim: (id: number, data: FormData | { appeal_message: string; appeal_files?: string }) => Promise<void>;
  setFilters: (filters: Partial<ItemsState['filters']>) => void;
}

export const useItemsStore = create<ItemsState>((set, get) => ({
  lostItems: [],
  foundItems: [],
  myLostItems: [],
  myFoundItems: [],
  registeredItems: [],
  categories: [],
  isLoading: false,
  claimsLoading: false,
  myClaims: [],
  ownerClaims: [],
  filters: {},

  fetchLostItems: async (params = {}) => {
    set({ isLoading: true });
    try {
      const response = await api.get('/items/lost-items/', { params });
      set({ lostItems: response.data.results || response.data, isLoading: false });
    } catch (error) {
      set({ isLoading: false });
      throw error;
    }
  },

  fetchFoundItems: async (params = {}) => {
    set({ isLoading: true });
    try {
      const response = await api.get('/items/found-items/', { params });
      set({ foundItems: response.data.results || response.data, isLoading: false });
    } catch (error) {
      set({ isLoading: false });
      throw error;
    }
  },

  fetchMyLostItems: async () => {
    set({ isLoading: true });
    try {
      const response = await api.get('/items/my-lost-items/');
      set({ myLostItems: response.data.results || response.data, isLoading: false });
    } catch (error) {
      set({ isLoading: false });
      throw error;
    }
  },

  fetchMyFoundItems: async () => {
    set({ isLoading: true });
    try {
      const response = await api.get('/items/my-found-items/');
      set({ myFoundItems: response.data.results || response.data, isLoading: false });
    } catch (error) {
      set({ isLoading: false });
      throw error;
    }
  },

  fetchRegisteredItems: async () => {
    set({ isLoading: true });
    try {
      const response = await api.get('/items/registered-items/');
      set({ registeredItems: response.data.results || response.data, isLoading: false });
    } catch (error) {
      set({ isLoading: false });
      throw error;
    }
  },

  fetchCategories: async () => {
    try {
      const response = await api.get('/items/categories/');
      set({ categories: response.data });
    } catch (error) {
      console.error('Failed to fetch categories:', error);
    }
  },

  createLostItem: async (data: FormData) => {
    const response = await api.post('/items/lost-items/', data, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  },

  createFoundItem: async (data: FormData) => {
    const response = await api.post('/items/found-items/', data, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  },

  createRegisteredItem: async (data: FormData) => {
    const response = await api.post('/items/registered-items/', data, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  },

  reportRegisteredItemAsLost: async (id: number, data: { lost_date: string }) => {
    const response = await api.post(`/items/registered-items/${id}/report_lost/`, data);
    return response.data;
  },

  likeItem: async (itemId: number, type: 'lost' | 'found') => {
    try {
      const endpoint = type === 'lost' ? `/items/lost-items/${itemId}/like/` : `/items/found-items/${itemId}/like/`;
      await api.post(endpoint);

      // Update local state
      const state = get();
      if (type === 'lost') {
        set({
          lostItems: state.lostItems.map(item =>
            item.id === itemId
              ? { ...item, is_liked: !item.is_liked, likes_count: item.is_liked ? item.likes_count - 1 : item.likes_count + 1 }
              : item
          ),
        });
      } else {
        set({
          foundItems: state.foundItems.map(item =>
            item.id === itemId
              ? { ...item, is_liked: !item.is_liked, likes_count: item.is_liked ? item.likes_count - 1 : item.likes_count + 1 }
              : item
          ),
        });
      }
    } catch (error) {
      throw error;
    }
  },

  createClaim: async (formData) => {
    const response = await api.post('/items/claims/', formData);
    return response.data;
  },

  fetchItemClaims: async (itemId, itemType) => {
    try {
      const params = itemType === 'lost'
        ? { lost_item_id: itemId }
        : { found_item_id: itemId };
      const response = await api.get('/items/claims/', { params });
      return response.data.results || response.data;
    } catch (error) {
      console.error('Failed to fetch item claims:', error);
      return [];
    }
  },

  fetchMyClaims: async () => {
    set({ claimsLoading: true });
    try {
      const response = await api.get('/items/claims/', { params: { role: 'claimant' } });
      set({ myClaims: response.data.results || response.data, claimsLoading: false });
    } catch (error) {
      set({ claimsLoading: false });
      throw error;
    }
  },

  fetchOwnerClaims: async () => {
    set({ claimsLoading: true });
    try {
      const response = await api.get('/items/claims/', { params: { role: 'owner' } });
      set({ ownerClaims: response.data.results || response.data, claimsLoading: false });
    } catch (error) {
      set({ claimsLoading: false });
      throw error;
    }
  },

  respondToClaim: async (id, action, data) => {
    await api.post(`/items/claims/${id}/${action}/`, data || {});
  },

  appealClaim: async (id, data) => {
    await api.post(`/items/claims/${id}/appeal/`, data);
  },

  setFilters: (filters) => {
    set((state) => ({ filters: { ...state.filters, ...filters } }));
  },
}));

