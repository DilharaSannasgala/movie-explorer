import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';

interface LoginFormProps {
  isRegister?: boolean;
}

const LoginForm: React.FC<LoginFormProps> = ({ isRegister = false }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const { login, register, loading, error, clearError } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();
    
    if (!username || !password) {
      return;
    }
    
    try {
      if (isRegister) {
        await register({ username, password });
      } else {
        await login({ username, password });
      }
    } catch (err) {
      console.error('Authentication error:', err);
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-lg max-w-md w-full">
      <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white text-center">
        {isRegister ? 'Create an Account' : 'Welcome Back'}
      </h2>
      
      {error && (
        <div className="mb-4 p-3 bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200 rounded-md text-sm">
          {error}
        </div>
      )}
      
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="username" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Username
          </label>
          <input
            id="username"
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md
                      bg-white dark:bg-gray-800 text-gray-900 dark:text-white
                      focus:outline-none focus:ring-2 focus:ring-red-500"
            placeholder="Enter your username"
            required
          />
        </div>
        
        <div className="mb-6">
          <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Password
          </label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md
                      bg-white dark:bg-gray-800 text-gray-900 dark:text-white
                      focus:outline-none focus:ring-2 focus:ring-red-500"
            placeholder="Enter your password"
            required
          />
          <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
            {isRegister ? 'Create a secure password' : 'For demo, use password: "password"'}
          </p>
        </div>
        
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded-md
                    transition-colors focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2
                    disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? (
            <span className="flex items-center justify-center">
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Processing...
            </span>
          ) : (
            isRegister ? 'Sign Up' : 'Log In'
          )}
        </button>
      </form>
    </div>
  );
};

export default LoginForm;