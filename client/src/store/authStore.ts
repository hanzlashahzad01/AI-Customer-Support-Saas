import { create } from 'zustand';
import api from '../services/api';

interface User {
    id: string;
    name: string;
    email: string;
    role: string;
    companyId?: string;
}

interface AuthState {
    user: User | null;
    token: string | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    login: (credentials: any) => Promise<void>;
    register: (data: any) => Promise<void>;
    logout: () => void;
    checkAuth: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
    user: null,
    token: localStorage.getItem('token'),
    isAuthenticated: !!localStorage.getItem('token'),
    isLoading: false,

    login: async (credentials) => {
        set({ isLoading: true });
        try {
            console.log('🔄 AuthStore: Sending login request...');
            const res = await api.post('/auth/login', credentials);
            console.log('✅ AuthStore: Login response received', res.data);

            const { token, user } = res.data;

            if (!token) {
                throw new Error('No token received from server');
            }

            if (!user) {
                throw new Error('No user data received from server');
            }

            localStorage.setItem('token', token);
            set({ user, token, isAuthenticated: true, isLoading: false });
            console.log('✅ AuthStore: Login successful, user authenticated');
        } catch (error: any) {
            console.error('❌ AuthStore: Login failed', {
                message: error.message,
                status: error.response?.status,
                data: error.response?.data
            });
            set({ isLoading: false });
            throw error;
        }
    },

    register: async (data: any) => {
        set({ isLoading: true });
        try {
            console.log('🔄 AuthStore: Sending registration request...');
            const res = await api.post('/auth/register', data);
            console.log('✅ AuthStore: Registration response received', res.data);

            const { token, user } = res.data;

            if (!token) {
                throw new Error('No token received from server');
            }

            if (!user) {
                throw new Error('No user data received from server');
            }

            localStorage.setItem('token', token);
            set({ user, token, isAuthenticated: true, isLoading: false });
            console.log('✅ AuthStore: Registration successful, user authenticated');
        } catch (error: any) {
            console.error('❌ AuthStore: Registration failed', {
                message: error.message,
                status: error.response?.status,
                data: error.response?.data
            });
            set({ isLoading: false });
            throw error;
        }
    },

    logout: () => {
        console.log('🚪 AuthStore: Logging out user');
        localStorage.removeItem('token');
        set({ user: null, token: null, isAuthenticated: false });
    },

    checkAuth: async () => {
        const token = localStorage.getItem('token');
        if (!token) {
            console.log('⚠️ AuthStore: No token found, user not authenticated');
            set({ isAuthenticated: false, isLoading: false });
            return;
        }

        set({ isLoading: true });
        try {
            console.log('🔄 AuthStore: Checking authentication...');
            const res = await api.get('/auth/me');
            console.log('✅ AuthStore: Auth check successful', res.data);
            set({ user: res.data, isAuthenticated: true, isLoading: false });
        } catch (error: any) {
            console.error('❌ AuthStore: Auth check failed', {
                message: error.message,
                status: error.response?.status,
                data: error.response?.data
            });
            localStorage.removeItem('token');
            set({ user: null, token: null, isAuthenticated: false, isLoading: false });
        }
    }
}));
