import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import { User, UserCredentials } from '../types/user';
import { getUser, saveUser, removeUser } from '../utils/storage';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
  login: (credentials: UserCredentials) => Promise<void>;
  register: (credentials: UserCredentials) => Promise<void>;
  logout: () => void;
  clearError: () => void;
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

interface AuthProviderProps {
  children: ReactNode;
}

// Demo users for testing purposes
const DEMO_USERS: User[] = [
  { id: '1', username: 'demo', email: 'demo@example.com' },
  { id: '2', username: 'user', email: 'user@example.com' }
];

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Check if user is stored in localStorage
    const storedUser = getUser();
    if (storedUser) {
      setUser(storedUser);
    }
    setLoading(false);
  }, []);

  const login = async (credentials: UserCredentials): Promise<void> => {
    setLoading(true);
    setError(null);
    
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // In a real app, this would be an API call to your backend
      const foundUser = DEMO_USERS.find(u => u.username === credentials.username);
      
      if (foundUser && credentials.password === 'password') {
        setUser(foundUser);
        saveUser(foundUser);
      } else {
        throw new Error('Invalid username or password');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
    } finally {
      setLoading(false);
    }
  };

  const register = async (credentials: UserCredentials): Promise<void> => {
    setLoading(true);
    setError(null);
    
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Check if username already exists
      const existingUser = DEMO_USERS.find(u => u.username === credentials.username);
      
      if (existingUser) {
        throw new Error('Username already exists');
      }
      
      // In a real app, this would create a new user via API
      const newUser: User = {
        id: `${DEMO_USERS.length + 1}`,
        username: credentials.username,
      };
      
      setUser(newUser);
      saveUser(newUser);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
    } finally {
      setLoading(false);
    }
  };

  const logout = (): void => {
    setUser(null);
    removeUser();
  };

  const clearError = (): void => {
    setError(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        loading,
        error,
        login,
        register,
        logout,
        clearError
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => useContext(AuthContext);