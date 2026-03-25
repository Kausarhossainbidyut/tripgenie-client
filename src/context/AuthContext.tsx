import { createContext, useContext, useState, useCallback, useEffect, ReactNode } from 'react';
import type { User, AuthState, LoginCredentials, RegisterData } from '../types';
import { STORAGE_KEYS } from '../constants';
import { authService } from '../services/auth.service';

export interface AuthContextType extends AuthState {
  login: (credentials: LoginCredentials) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => void;
  updateUser: (userData: Partial<User>) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AuthState>({
    user: null,
    isAuthenticated: false,
    isLoading: true,
  });

  useEffect(() => {
    const initAuth = async () => {
      const token = localStorage.getItem(STORAGE_KEYS.TOKEN);
      const userData = localStorage.getItem(STORAGE_KEYS.USER);

      if (token && userData) {
        try {
          const user = JSON.parse(userData) as User;
          setState({ user, isAuthenticated: true, isLoading: false });
        } catch {
          // Invalid user data, clear storage
          localStorage.removeItem(STORAGE_KEYS.TOKEN);
          localStorage.removeItem(STORAGE_KEYS.REFRESH_TOKEN);
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
    try {
      const response = await authService.login(credentials);
      
      if (response.success) {
        const { user, accessToken, refreshToken } = response.data;
        
        // Store tokens and user data
        localStorage.setItem(STORAGE_KEYS.TOKEN, accessToken);
        localStorage.setItem(STORAGE_KEYS.REFRESH_TOKEN, refreshToken);
        localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
        
        setState({
          user,
          isAuthenticated: true,
          isLoading: false,
        });
      } else {
        throw new Error(response.message || 'Login failed');
      }
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Invalid credentials');
    }
  }, []);

  const register = useCallback(async (data: RegisterData) => {
    try {
      const response = await authService.register(data);
      
      if (response.success) {
        // Registration successful - user should login separately
        // Optionally auto-login after registration
        /*
        const loginResponse = await authService.login({
          email: data.email,
          password: data.password
        });
        
        if (loginResponse.success) {
          const { user, accessToken, refreshToken } = loginResponse.data;
          localStorage.setItem(STORAGE_KEYS.TOKEN, accessToken);
          localStorage.setItem(STORAGE_KEYS.REFRESH_TOKEN, refreshToken);
          localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
          setState({ user, isAuthenticated: true, isLoading: false });
        }
        */
      } else {
        throw new Error(response.message || 'Registration failed');
      }
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Registration failed');
    }
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem(STORAGE_KEYS.TOKEN);
    localStorage.removeItem(STORAGE_KEYS.REFRESH_TOKEN);
    localStorage.removeItem(STORAGE_KEYS.USER);
    setState({ user: null, isAuthenticated: false, isLoading: false });
  }, []);

  const updateUser = useCallback(async (userData: Partial<User>) => {
    try {
      const currentUser = state.user;
      if (!currentUser?._id) throw new Error('User not found');

      // Note: You'll need to import userService when you use this
      // const response = await userService.updateUser(currentUser._id, userData);
      // if (response.success) {
      //   const updatedUser = { ...currentUser, ...response.data };
      //   localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(updatedUser));
      //   setState(prev => ({ ...prev, user: updatedUser }));
      // }
      
      // For now, optimistic update
      const updatedUser = { ...currentUser, ...userData };
      localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(updatedUser));
      setState(prev => ({ ...prev, user: updatedUser }));
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to update user');
    }
  }, [state.user]);

  return (
    <AuthContext.Provider value={{ ...state, login, register, logout, updateUser }}>
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
