import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Film } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import LoginForm from '../components/LoginForm';

const LoginPage: React.FC = () => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/');
    }
  }, [isAuthenticated, navigate]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 dark:bg-gray-900 p-4">
      <div className="mb-8 text-center">
        <div className="flex items-center justify-center mb-2">
          <Film className="h-10 w-10 text-red-600 dark:text-red-500" />
        </div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">MovieExplorer</h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2">Discover your favorite films</p>
      </div>
      
      <LoginForm />
      
      <p className="mt-6 text-gray-600 dark:text-gray-400 text-sm">
        Don't have an account? 
        <Link to="/register" className="text-red-600 dark:text-red-500 ml-1 hover:underline">
          Sign up
        </Link>
      </p>
      
      <div className="mt-10 text-sm text-gray-500 dark:text-gray-500 text-center max-w-md">
        <p>
          This is a demo app. For testing, you can use:
          <br />
          Username: <span className="font-mono bg-gray-200 dark:bg-gray-800 px-2 py-0.5 rounded">demo</span> 
          Password: <span className="font-mono bg-gray-200 dark:bg-gray-800 px-2 py-0.5 rounded">password</span>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;