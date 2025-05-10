import React, { useState } from 'react';
import { Film, User, Heart, LogOut, Menu, X, Sun, Moon } from 'lucide-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import ThemeToggle from './ThemeToggle';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';

const Header: React.FC = () => {
  const { isAuthenticated, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const location = useLocation();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 bg-white dark:bg-gray-900 shadow-md transition-colors duration-200">
      <div className="container mx-auto px-4 py-3">
        <div className="flex justify-between items-center">
          <Link 
            to="/" 
            className="flex items-center gap-2 text-red-600 dark:text-red-500 font-bold text-xl"
          >
            <Film className="h-6 w-6" />
            <span>MovieExplorer</span>
          </Link>
          
          <div className="flex items-center gap-4">
            {isAuthenticated && (
              <>
                {/* Desktop navigation */}
                <div className="hidden md:flex items-center gap-4">
                  <Link 
                    to="/favorites" 
                    className={`p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors ${
                      location.pathname === '/favorites' ? 'bg-gray-200 dark:bg-gray-700' : ''
                    }`}
                    aria-label="Favorite movies"
                  >
                    <Heart className="w-5 h-5 text-gray-700 dark:text-gray-300" />
                  </Link>
                  
                  <Link 
                    to="/profile" 
                    className={`p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors ${
                      location.pathname === '/profile' ? 'bg-gray-200 dark:bg-gray-700' : ''
                    }`}
                    aria-label="User profile"
                  >
                    <User className="w-5 h-5 text-gray-700 dark:text-gray-300" />
                  </Link>
                  
                  <button
                    onClick={handleLogout}
                    className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                    aria-label="Logout"
                  >
                    <LogOut className="w-5 h-5 text-gray-700 dark:text-gray-300" />
                  </button>

                  <ThemeToggle />
                </div>
                
                {/* Mobile menu button */}
                <button
                  onClick={toggleMenu}
                  className="md:hidden p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                  aria-label="Toggle menu"
                >
                  {isMenuOpen ? (
                    <X className="w-5 h-5 text-gray-700 dark:text-gray-300" />
                  ) : (
                    <Menu className="w-5 h-5 text-gray-700 dark:text-gray-300" />
                  )}
                </button>
              </>
            )}
            
            {/* Theme toggle for non-authenticated state */}
            {!isAuthenticated && <ThemeToggle />}
          </div>
        </div>
        
        {/* Mobile menu dropdown */}
        {isAuthenticated && isMenuOpen && (
          <div className="md:hidden absolute left-0 right-0 top-full bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700 shadow-lg animate-fadeIn">
            <nav className="container mx-auto py-2">
              <Link 
                to="/favorites" 
                className={`flex items-center gap-3 px-4 py-3 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors ${
                  location.pathname === '/favorites' ? 'bg-gray-100 dark:bg-gray-800' : ''
                }`}
                onClick={closeMenu}
              >
                <Heart className="w-5 h-5 text-gray-700 dark:text-gray-300" />
                <span className="text-gray-900 dark:text-white">Favorites</span>
              </Link>
              
              <Link 
                to="/profile" 
                className={`flex items-center gap-3 px-4 py-3 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors ${
                  location.pathname === '/profile' ? 'bg-gray-100 dark:bg-gray-800' : ''
                }`}
                onClick={closeMenu}
              >
                <User className="w-5 h-5 text-gray-700 dark:text-gray-300" />
                <span className="text-gray-900 dark:text-white">Profile</span>
              </Link>

              <button
                onClick={() => {
                  toggleTheme();
                  closeMenu();
                }}
                className="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors text-left"
              >
                {theme === 'dark' ? (
                  <>
                    <Sun className="w-5 h-5 text-yellow-500" />
                    <span className="text-gray-900 dark:text-white">Light Mode</span>
                  </>
                ) : (
                  <>
                    <Moon className="w-5 h-5 text-gray-700 dark:text-gray-300" />
                    <span className="text-gray-900 dark:text-white">Dark Mode</span>
                  </>
                )}
              </button>
              
              <button
                onClick={() => {
                  closeMenu();
                  handleLogout();
                }}
                className="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors text-left"
              >
                <LogOut className="w-5 h-5 text-gray-700 dark:text-gray-300" />
                <span className="text-gray-900 dark:text-white">Logout</span>
              </button>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;