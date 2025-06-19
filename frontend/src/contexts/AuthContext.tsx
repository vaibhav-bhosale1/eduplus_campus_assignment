// frontend/src/contexts/AuthContext.tsx
import React, { createContext, useEffect, useContext, useReducer } from 'react';
import type { ReactNode } from 'react';


interface User {
  id: string;
  name: string;
  email: string;
  role: 'SYSTEM_ADMIN' | 'NORMAL_USER' | 'STORE_OWNER';
  token: string; 
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
    
      localStorage.setItem('user', JSON.stringify(action.payload));
      return {
        user: action.payload,
        isAuthenticated: true,
        isAdmin: action.payload.role === 'SYSTEM_ADMIN',
        isNormalUser: action.payload.role === 'NORMAL_USER',
        isStoreOwner: action.payload.role === 'STORE_OWNER',
      };
    case 'LOGOUT':
      localStorage.removeItem('user'); 
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
  const storedUser = localStorage.getItem('user');
  if (storedUser) {
    try {
      const parsedUser = JSON.parse(storedUser);

      const isValid =
        parsedUser &&
        typeof parsedUser.id === 'string' &&
        typeof parsedUser.name === 'string' &&
        typeof parsedUser.email === 'string' &&
        typeof parsedUser.token === 'string' &&
        ['SYSTEM_ADMIN', 'NORMAL_USER', 'STORE_OWNER'].includes(parsedUser.role);

      if (isValid) {
        dispatch({ type: 'LOGIN', payload: parsedUser });
      } else {
        throw new Error('Invalid user object structure');
      }
    } catch (e) {
      console.warn("Clearing invalid user data from localStorage:", e);
      localStorage.removeItem('user');
      dispatch({ type: 'LOGOUT' });
    }
  }
}, []);

  const logout = () => {
    dispatch({ type: 'LOGOUT' });
  };

  const contextValue = {
    state,
    dispatch,
    logout, 
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
 
  const { user, isAuthenticated, isAdmin, isNormalUser, isStoreOwner } = context.state;
  return { user, isAuthenticated, isAdmin, isNormalUser, isStoreOwner, dispatch: context.dispatch, logout: context.logout };
};
