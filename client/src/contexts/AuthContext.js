// src/contexts/AuthContext.js
import React, { createContext, useContext, useReducer, useEffect, useCallback } from 'react';
import axios from 'axios';
import {API_URL} from '../config/api';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

const authReducer = (state, action) => {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    case 'SET_USER':
      return { 
        ...state, 
        user: action.payload, 
        isAuthenticated: !!action.payload,
        loading: false 
      };
    case 'SET_TOKENS':
      return { ...state, tokens: action.payload };
    case 'CLEAR_AUTH':
      return { 
        user: null, 
        tokens: null, 
        isAuthenticated: false, 
        loading: false 
      };
    case 'SET_ERROR':
      return { ...state, error: action.payload, loading: false };
    case 'CLEAR_ERROR':
      return { ...state, error: null };
    default:
      return state;
  }
};

const initialState = {
  user: null,
  tokens: null,
  isAuthenticated: false,
  loading: true,
  error: null
};

export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  // Memoize the logout function to prevent recreating it on every render
  const logout = useCallback(async () => {
    try {
      const refreshToken = localStorage.getItem('refreshToken');
      if (refreshToken) {
        await axios.post(`${API_URL}/auth/logout`, { refreshToken });
      }
    } catch (error) {
      console.error('Logout request failed:', error);
    } finally {
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      dispatch({ type: 'CLEAR_AUTH' });
    }
  }, []);

  // Set up axios interceptors with stable references
  useEffect(() => {
    const requestInterceptor = axios.interceptors.request.use(
      (config) => {
        const accessToken = localStorage.getItem('accessToken');
        if (accessToken) {
          config.headers.Authorization = `Bearer ${accessToken}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    const responseInterceptor = axios.interceptors.response.use(
      (response) => response,
      async (error) => {
        const originalRequest = error.config;

        if (error.response?.status === 401 && !originalRequest._retry) {
          originalRequest._retry = true;

          try {
            const refreshToken = localStorage.getItem('refreshToken');
            
            if (refreshToken) {
              const response = await axios.post(`${API_URL}/auth/refresh`, {
                refreshToken
              });

              const { tokens } = response.data;
              
              // Update localStorage directly
              localStorage.setItem('accessToken', tokens.accessToken);
              localStorage.setItem('refreshToken', tokens.refreshToken);

              // Update state
              dispatch({ type: 'SET_TOKENS', payload: tokens });

              // Retry original request with new token
              originalRequest.headers.Authorization = `Bearer ${tokens.accessToken}`;
              return axios(originalRequest);
            } else {
              logout();
            }
          } catch (refreshError) {
            console.error('Token refresh failed:', refreshError);
            logout();
          }
        }

        return Promise.reject(error);
      }
    );

    return () => {
      axios.interceptors.request.eject(requestInterceptor);
      axios.interceptors.response.eject(responseInterceptor);
    };
  }, [logout]); // Only depend on logout which is memoized

  // Initialize auth state on app load
  useEffect(() => {
    initializeAuth();
  }, []);

  const initializeAuth = async () => {
    try {
      const accessToken = localStorage.getItem('accessToken');
      const refreshToken = localStorage.getItem('refreshToken');

      if (accessToken && refreshToken) {
        try {
          const response = await axios.get(`${API_URL}/auth/me`, {
            headers: { Authorization: `Bearer ${accessToken}` }
          });

          dispatch({ type: 'SET_TOKENS', payload: { accessToken, refreshToken } });
          dispatch({ type: 'SET_USER', payload: response.data.user });
        } catch (error) {
          // If access token is invalid, try refresh token
          try {
            const refreshResponse = await axios.post(`${API_URL}/auth/refresh`, {
              refreshToken
            });

            const { tokens } = refreshResponse.data;
            localStorage.setItem('accessToken', tokens.accessToken);
            localStorage.setItem('refreshToken', tokens.refreshToken);

            const userResponse = await axios.get(`${API_URL}/auth/me`, {
              headers: { Authorization: `Bearer ${tokens.accessToken}` }
            });

            dispatch({ type: 'SET_TOKENS', payload: tokens });
            dispatch({ type: 'SET_USER', payload: userResponse.data.user });
          } catch (refreshError) {
            console.error('Token refresh during initialization failed:', refreshError);
            localStorage.removeItem('accessToken');
            localStorage.removeItem('refreshToken');
            dispatch({ type: 'SET_LOADING', payload: false });
          }
        }
      } else {
        dispatch({ type: 'SET_LOADING', payload: false });
      }
    } catch (error) {
      console.error('Auth initialization failed:', error);
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  const login = async (identifier, password, rememberMe = false) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      dispatch({ type: 'CLEAR_ERROR' });

      const response = await axios.post(`${API_URL}/auth/login`, {
        identifier,
        password,
        rememberMe
      });

      const { user, tokens } = response.data;

      localStorage.setItem('accessToken', tokens.accessToken);
      localStorage.setItem('refreshToken', tokens.refreshToken);

      dispatch({ type: 'SET_TOKENS', payload: tokens });
      dispatch({ type: 'SET_USER', payload: user });

      return { success: true, user };
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Login failed';
      dispatch({ type: 'SET_ERROR', payload: errorMessage });
      return { success: false, error: errorMessage };
    }
  };

  const register = async (userData) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      dispatch({ type: 'CLEAR_ERROR' });

      const response = await axios.post(`${API_URL}/auth/register`, userData);
      const { user, tokens } = response.data;

      localStorage.setItem('accessToken', tokens.accessToken);
      localStorage.setItem('refreshToken', tokens.refreshToken);

      dispatch({ type: 'SET_TOKENS', payload: tokens });
      dispatch({ type: 'SET_USER', payload: user });

      return { success: true, user };
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Registration failed';
      dispatch({ type: 'SET_ERROR', payload: errorMessage });
      return { success: false, error: errorMessage };
    }
  };

  const updateProfile = async (profileData) => {
    try {
      const response = await axios.put(`${API_URL}/auth/profile`, profileData);
      dispatch({ type: 'SET_USER', payload: response.data.user });
      return { success: true, user: response.data.user };
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Profile update failed';
      return { success: false, error: errorMessage };
    }
  };

  const checkUsernameAvailability = async (username) => {
    try {
      const response = await axios.get(`${API_URL}/auth/check-username/${username}`);
      return response.data;
    } catch (error) {
      return { available: false, message: 'Unable to check username availability' };
    }
  };

  const clearError = useCallback(() => {
    dispatch({ type: 'CLEAR_ERROR' });
  }, []);

  const value = {
    user: state.user,
    tokens: state.tokens,
    isAuthenticated: state.isAuthenticated,
    loading: state.loading,
    error: state.error,
    login,
    register,
    logout,
    updateProfile,
    checkUsernameAvailability,
    clearError
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};