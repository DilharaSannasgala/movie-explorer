import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Film } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import Header from '../components/Header';

const ProfilePage: React.FC = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, navigate]);

  if (!isAuthenticated || !user) {
    return null;
  }

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white transition-colors">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden">
            <div className="bg-gradient-to-r from-red-500 to-purple-600 h-32"></div>
            
            <div className="px-6 py-8 relative">
              <div className="absolute -top-12 left-6 bg-white dark:bg-gray-700 rounded-full p-2 shadow-lg">
                <div className="bg-gray-200 dark:bg-gray-600 rounded-full h-20 w-20 flex items-center justify-center">
                  <User className="h-10 w-10 text-gray-500 dark:text-gray-400" />
                </div>
              </div>
              
              <div className="mt-12">
                <h1 className="text-2xl font-bold">{user.username}</h1>
                {user.email && <p className="text-gray-600 dark:text-gray-400 mt-1">{user.email}</p>}
              </div>
              
              <div className="mt-8 border-t border-gray-200 dark:border-gray-700 pt-6">
                <h2 className="text-xl font-semibold mb-4">Account Information</h2>
                
                <div className="bg-gray-100 dark:bg-gray-700 p-4 rounded-lg mb-4">
                  <div className="flex items-center mb-2">
                    <Film className="h-5 w-5 text-red-500 mr-2" />
                    <span className="font-medium">Account Type:</span>
                  </div>
                  <p className="ml-7 text-gray-600 dark:text-gray-400">Demo User</p>
                </div>
                
                <p className="text-gray-600 dark:text-gray-400 text-sm mb-6">
                  This is a demo account with limited features. In a production environment, 
                  you would be able to manage your profile, subscription, and preferences.
                </p>
                
                <button
                  onClick={handleLogout}
                  className="w-full bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded-md transition-colors"
                >
                  Log Out
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ProfilePage;