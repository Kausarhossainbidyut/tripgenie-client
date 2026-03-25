import { createContext, useContext, useState, useCallback, useEffect, ReactNode } from 'react';
import type { User, AuthState, LoginCredentials, RegisterData } from '../types';
import { STORAGE_KEYS } from '../constants';

export interface AuthContextType extends AuthState {
  login: (credentials: LoginCredentials) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AuthState>({
    user: null,
    isAuthenticated: false,
    isLoading: true,
  });

  useEffect(() => {
    const initAuth = () => {
      const token = localStorage.getItem(STORAGE_KEYS.TOKEN);
      const userData = localStorage.getItem(STORAGE_KEYS.USER);

      if (token && userData) {
        try {
          const user = JSON.parse(userData) as User;
          setState({ user, isAuthenticated: true, isLoading: false });
        } catch {
          localStorage.removeItem(STORAGE_KEYS.TOKEN);
          localStorage.removeItem(STORAGE_KEYS.USER);
          setState({ user: null, isAuthenticated: false, isLoading: false });
        }
      } else {
        setState((prev) => ({ ...prev, isLoading: false }));
      }
    };

    initAuth();
  }, []);

  const login = useCallback(async (credentials: LoginCredentials) => {
    // Mock login - replace with actual API call
    const mockUser: User = {
      id: '1',
      email: credentials.email,
      name: 'John Doe',
    };
    
    localStorage.setItem(STORAGE_KEYS.TOKEN, 'mock-token');
    localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(mockUser));
    
    setState({
      user: mockUser,
      isAuthenticated: true,
      isLoading: false,
    });
  }, []);

  const register = useCallback(async (data: RegisterData) => {
    // Mock register - replace with actual API call
    const mockUser: User = {
      id: '1',
      email: data.email,
      name: data.name,
    };
    
    localStorage.setItem(STORAGE_KEYS.TOKEN, 'mock-token');
    localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(mockUser));
    
    setState({
      user: mockUser,
      isAuthenticated: true,
      isLoading: false,
    });
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem(STORAGE_KEYS.TOKEN);
    localStorage.removeItem(STORAGE_KEYS.USER);
    setState({ user: null, isAuthenticated: false, isLoading: false });
  }, []);

  return (
    <AuthContext.Provider value={{ ...state, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}
