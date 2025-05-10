import React, { useState, useEffect, useRef } from 'react';
import { Search, X, Clock } from 'lucide-react';
import { useMovies } from '../contexts/MovieContext';
import { getLastSearch } from '../utils/storage';

const SearchBar: React.FC = () => {
  const { searchQuery, setSearchQuery, filterOptions } = useMovies();
  const [localQuery, setLocalQuery] = useState(searchQuery);
  const [showHistory, setShowHistory] = useState(false);
  const lastSearch = getLastSearch();
  const timeoutRef = useRef<NodeJS.Timeout>();
  
  // Determine if filters are active
  const hasActiveFilters = Object.values(filterOptions).some(value => value !== undefined);

  // Sync local state with context
  useEffect(() => {
    setLocalQuery(searchQuery);
  }, [searchQuery]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setLocalQuery(value);
    setSearchQuery(value);
  };

  const handleClear = () => {
    setLocalQuery('');
    setSearchQuery('');
  };

  const handleInputFocus = () => {
    if (lastSearch) {
      setShowHistory(true);
    }
  };

  const handleInputBlur = () => {
    // Clear any existing timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    // Set new timeout
    timeoutRef.current = setTimeout(() => {
      setShowHistory(false);
    }, 200);
  };

  const handleLastSearchClick = (e: React.MouseEvent) => {
    e.preventDefault();
    setLocalQuery(lastSearch);
    setSearchQuery(lastSearch);
    setShowHistory(false);
  };

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return (
    <div className="relative w-full max-w-2xl mx-auto">
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search className="h-5 w-5 text-gray-400" />
        </div>
        
        <input
          type="text"
          value={localQuery}
          onChange={handleInputChange}
          onFocus={handleInputFocus}
          onBlur={handleInputBlur}
          placeholder={hasActiveFilters ? "Search within filtered movies..." : "Search for movies..."}
          className="block w-full pl-10 pr-10 py-3 border border-gray-300 dark:border-gray-600 rounded-full
                     bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500
                     focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent
                     transition-colors"
        />
        
        {localQuery && (
          <button
            onClick={handleClear}
            className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
            aria-label="Clear search"
          >
            <X className="h-5 w-5" />
          </button>
        )}
      </div>

      {/* Last Search History Dropdown */}
      {showHistory && lastSearch && !localQuery && (
        <div 
          className="absolute w-full mt-1 py-2 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 z-50"
          onMouseDown={(e) => e.preventDefault()} // Prevent blur from hiding dropdown
        >
          <button
            onClick={handleLastSearchClick}
            className="w-full px-4 py-2 flex items-center gap-2 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors text-left"
          >
            <Clock className="h-4 w-4 text-gray-400" />
            <span className="text-gray-700 dark:text-gray-300">{lastSearch}</span>
          </button>
        </div>
      )}
    </div>
  );
};

export default SearchBar;