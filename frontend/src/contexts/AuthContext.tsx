// frontend/src/contexts/AuthContext.tsx
import React, { createContext, useState, useEffect, useContext, useReducer } from 'react';
import type { ReactNode } from 'react';
import api from '../services/api'; // Import api to use its interceptor

interface User {
  id: string;
  name: string;
  email: string;
  role: 'SYSTEM_ADMIN' | 'NORMAL_USER' | 'STORE_OWNER';
  token: string; // Ensure the token is part of the User interface
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  isNormalUser: boolean;
  isStoreOwner: boolean;
}

type AuthAction = { type: 'LOGIN'; payload: User } | { type: 'LOGOUT' };

const authReducer = (state: AuthState, action: AuthAction): AuthState => {
  switch (action.type) {
    case 'LOGIN':
      // Store the entire user object including token
      localStorage.setItem('user', JSON.stringify(action.payload));
      return {
        user: action.payload,
        isAuthenticated: true,
        isAdmin: action.payload.role === 'SYSTEM_ADMIN',
        isNormalUser: action.payload.role === 'NORMAL_USER',
        isStoreOwner: action.payload.role === 'STORE_OWNER',
      };
    case 'LOGOUT':
      localStorage.removeItem('user'); // Clear user from localStorage
      return {
        user: null,
        isAuthenticated: false,
        isAdmin: false,
        isNormalUser: false,
        isStoreOwner: false,
      };
    default:
      return state;
  }
};

const AuthContext = createContext<{ state: AuthState; dispatch: React.Dispatch<AuthAction>; logout: () => void } | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, {
    user: null,
    isAuthenticated: false,
    isAdmin: false,
    isNormalUser: false,
    isStoreOwner: false,
  });

  useEffect(() => {
    // On component mount, check if user data exists in localStorage
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        const user = JSON.parse(storedUser) as User;
        dispatch({ type: 'LOGIN', payload: user }); // Re-hydrate state from localStorage
      } catch (e) {
        console.error("Failed to parse user from localStorage on app start:", e);
        dispatch({ type: 'LOGOUT' }); // Clear corrupted data
      }
    }
  }, []); // Run only once on mount

  // Define the logout function
  const logout = () => {
    dispatch({ type: 'LOGOUT' });
  };

  // Pass state, dispatch, AND logout down to consumers
  const contextValue = {
    state,
    dispatch,
    logout, // <-- LOGOUT FUNCTION INCLUDED HERE
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  // Destructure state for easier access, and return dispatch AND logout
  const { user, isAuthenticated, isAdmin, isNormalUser, isStoreOwner } = context.state;
  return { user, isAuthenticated, isAdmin, isNormalUser, isStoreOwner, dispatch: context.dispatch, logout: context.logout };
};
