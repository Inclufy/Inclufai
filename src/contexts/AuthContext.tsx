import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import * as SecureStore from 'expo-secure-store';
import api from '../services/api';

interface User {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
  role: string;
  organization?: string;
  subscription_tier?: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<{ requires2FA?: boolean }>;
  verify2FA: (code: string) => Promise<void>;
  logout: () => Promise<void>;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStoredAuth();
  }, []);

  async function loadStoredAuth() {
    try {
      const storedToken = await SecureStore.getItemAsync('auth_token');
      if (storedToken) {
        setToken(storedToken);
        const res = await api.get('/users/me/');
        setUser(res.data);
      }
    } catch (error: any) {
      // Only clear token on 401 (invalid token), not on server errors
      if (error.response?.status === 401) {
        await SecureStore.deleteItemAsync('auth_token');
        setToken(null);
      }
      // On 5xx/network errors, keep token and retry on next app open
    } finally {
      setLoading(false);
    }
  }

  // Stores email/password temporarily for 2FA verification
  const [tempCredentials, setTempCredentials] = useState<{ email: string; password: string } | null>(null);

  async function login(email: string, password: string) {
    const res = await api.post('/auth/login-2fa/', { email, password });
    if (res.data.requires_2fa) {
      setTempCredentials({ email, password });
      return { requires2FA: true };
    }
    await SecureStore.setItemAsync('auth_token', res.data.access);
    await SecureStore.setItemAsync('refresh_token', res.data.refresh);
    setToken(res.data.access);
    setUser(res.data.user);
    return {};
  }

  async function verify2FA(code: string) {
    if (!tempCredentials) throw new Error('No pending 2FA login');
    const res = await api.post('/auth/login-2fa/', {
      email: tempCredentials.email,
      password: tempCredentials.password,
      totp_code: code,
    });
    await SecureStore.setItemAsync('auth_token', res.data.access);
    await SecureStore.setItemAsync('refresh_token', res.data.refresh);
    setToken(res.data.access);
    setUser(res.data.user);
    setTempCredentials(null);
  }

  async function logout() {
    try {
      await api.post('/auth/logout/');
    } catch {
      // ignore
    }
    await SecureStore.deleteItemAsync('auth_token');
    await SecureStore.deleteItemAsync('refresh_token');
    setToken(null);
    setUser(null);
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        login,
        verify2FA,
        logout,
        isAuthenticated: !!token && !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
}
