'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { jwtDecode } from 'jwt-decode';
import { auth } from './api';
import { useRouter } from 'next/navigation';

interface AuthContextType {
  isAuthenticated: boolean;
  userId: number | null;
  userRole: string | null;
  username: string | null;
  login: (username: string, password: string) => Promise<void>;
  register: (username: string, password: string) => Promise<void>;
  logout: () => void;
  loading: boolean;
  isAdmin: () => boolean;
  isSuperUser: () => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [userId, setUserId] = useState<number | null>(null);
  const [username, setUsername] = useState<string | null>(null);
  const [userRole, setUserRole] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const router = useRouter();

  useEffect(() => {
    // Проверка токена при загрузке
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const decodedToken: any = jwtDecode(token);
        if (decodedToken && decodedToken.id) {
          setIsAuthenticated(true);
          setUserId(decodedToken.id);
          setUsername(decodedToken.username || null);
          setUserRole(decodedToken.role || null);
        } else {
          // Некорректный токен, удаляем
          localStorage.removeItem('token');
          setIsAuthenticated(false);
          setUserId(null);
          setUsername(null);
          setUserRole(null);
        }
      } catch (error) {
        console.error('Invalid token:', error);
        localStorage.removeItem('token');
        setIsAuthenticated(false);
        setUserId(null);
        setUsername(null);
        setUserRole(null);
      }
    }
    setLoading(false);
  }, []);

  const login = async (usernameInput: string, password: string) => {
    try {
      const response = await auth.login(usernameInput, password);
      const token = response.token;
      const decodedToken: any = jwtDecode(token);
      
      setIsAuthenticated(true);
      setUserId(decodedToken.id);
      setUsername(decodedToken.username || usernameInput);
      setUserRole(decodedToken.role || 'user');
      
      router.push('/dashboard');
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    }
  };

  const register = async (username: string, password: string) => {
    try {
      const response = await auth.register(username, password);
      const token = response.token;
      const decodedToken: any = jwtDecode(token);
      
      setIsAuthenticated(true);
      setUserId(decodedToken.id);
      setUsername(decodedToken.username || username);
      setUserRole(decodedToken.role || 'user');
      
      router.push('/dashboard');
    } catch (error) {
      console.error('Registration failed:', error);
      throw error;
    }
  };

  const logout = () => {
    auth.logout();
    setIsAuthenticated(false);
    setUserId(null);
    setUsername(null);
    setUserRole(null);
    router.push('/login');
  };
  
  // Функции проверки ролей
  const isAdmin = () => {
    return userRole === 'admin' || userRole === 'superuser';
  };
  
  const isSuperUser = () => {
    return userRole === 'superuser';
  };

  const value = {
    isAuthenticated,
    userId,
    username,
    userRole,
    login,
    register,
    logout,
    loading,
    isAdmin,
    isSuperUser
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
