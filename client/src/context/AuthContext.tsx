import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, api } from '../services/api';

interface AuthContextType {
  user: User | null;
  token: string | null;
  loading: boolean;
  login: (data: any) => Promise<void>;
  register: (data: any) => Promise<void>;
  demoLogin: (role: 'student' | 'admin') => Promise<void>;
  logout: () => void;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(localStorage.getItem('pg_token'));
  const [loading, setLoading] = useState<boolean>(true);

  const refreshUser = async () => {
    const savedToken = localStorage.getItem('pg_token');
    if (!savedToken) {
      setUser(null);
      setLoading(false);
      return;
    }
    try {
      const res = await api.getMe();
      if (res.user) {
        setUser(res.user);
      } else {
        localStorage.removeItem('pg_token');
        setUser(null);
        setToken(null);
      }
    } catch (err) {
      console.error('Failed to load current user:', err);
      localStorage.removeItem('pg_token');
      setUser(null);
      setToken(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshUser();
  }, []);

  const login = async (data: any) => {
    const res = await api.login(data);
    if (res.token && res.user) {
      localStorage.setItem('pg_token', res.token);
      setToken(res.token);
      setUser(res.user);
    } else {
      throw new Error(res.error || 'Login failed');
    }
  };

  const register = async (data: any) => {
    const res = await api.register(data);
    if (res.token && res.user) {
      localStorage.setItem('pg_token', res.token);
      setToken(res.token);
      setUser(res.user);
    } else {
      throw new Error(res.error || 'Registration failed');
    }
  };

  const demoLogin = async (role: 'student' | 'admin') => {
    const res = await api.demoLogin(role);
    if (res.token && res.user) {
      localStorage.setItem('pg_token', res.token);
      setToken(res.token);
      setUser(res.user);
    } else {
      throw new Error(res.error || 'Demo login failed');
    }
  };

  const logout = () => {
    localStorage.removeItem('pg_token');
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, login, register, demoLogin, logout, refreshUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
