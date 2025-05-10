import React, { useState, useRef, useEffect } from 'react';
import { Filter, X, ChevronDown, ChevronUp } from 'lucide-react';
import { useMovies } from '../contexts/MovieContext';
import { MovieFilterOptions } from '../types/movie';

const FilterPanel: React.FC = () => {
  const { genres, setFilterOptions, applyFilters, filterOptions, clearFilters } = useMovies();
  const [isExpanded, setIsExpanded] = useState(false);
  const [localFilters, setLocalFilters] = useState<MovieFilterOptions>(filterOptions);
  const overlayRef = useRef<HTMLDivElement>(null);
  
  // Determine if any filters are currently active
  const hasActiveFilters = Object.values(filterOptions).some(value => value !== undefined);

  // Effect to handle animation and click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (overlayRef.current && !overlayRef.current.contains(event.target as Node)) {
        setIsExpanded(false);
      }
    };

    if (isExpanded) {
      document.addEventListener('mousedown', handleClickOutside);
      // Prevent scrolling when overlay is open
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.body.style.overflow = 'auto';
    };
  }, [isExpanded]);

  const handleGenreChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value ? parseInt(e.target.value) : undefined;
    setLocalFilters(prev => ({ ...prev, genre: value }));
  };

  const handleYearChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value ? parseInt(e.target.value) : undefined;
    setLocalFilters(prev => ({ ...prev, year: value }));
  };

  const handleRatingChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value ? parseInt(e.target.value) : undefined;
    setLocalFilters(prev => ({ ...prev, rating: value }));
  };

  const handleApplyFilters = () => {
    setFilterOptions(localFilters);
    applyFilters(1, localFilters);
    setIsExpanded(false);
  };

  const handleClearFilters = () => {
    setLocalFilters({});
    clearFilters();
    setIsExpanded(false);
  };

  // Generate years for dropdown (current year to 1900)
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: currentYear - 1899 }, (_, i) => currentYear - i);

  return (
    <div className="relative z-10">
      {/* Filter Button */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="flex items-center justify-center px-4 py-2 bg-white dark:bg-gray-800 rounded-full shadow hover:shadow-md transition-all duration-200"
      >
        <Filter className="h-5 w-5 mr-2 text-red-500" />
        <span className="font-medium">Filters</span>
        {hasActiveFilters && (
          <span className="ml-2 px-2 py-0.5 text-xs font-medium bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200 rounded-full">
            Active
          </span>
        )}
        {isExpanded ? (
          <ChevronUp className="h-5 w-5 ml-2 text-gray-400" />
        ) : (
          <ChevronDown className="h-5 w-5 ml-2 text-gray-400" />
        )}
      </button>

      {/* Overlay Background */}
      {isExpanded && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 transition-opacity z-20"
          style={{ animation: 'fadeIn 0.2s ease-out' }}
        />
      )}
      
      {/* Filter Panel Overlay */}
      <div 
        ref={overlayRef}
        className={`fixed left-0 right-0 top-[4rem] mx-auto p-4 bg-white dark:bg-gray-800 rounded-lg shadow-lg z-30 transform transition-all duration-300 max-w-4xl w-full max-h-[calc(100vh-5rem)] overflow-y-auto ${
          isExpanded 
            ? 'translate-y-0 opacity-100' 
            : '-translate-y-full opacity-0 pointer-events-none'
        }`}
      >
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium">Filter Movies</h3>
          <button 
            onClick={() => setIsExpanded(false)}
            className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full"
            title="Close Filter Panel"
          >
            <X className="h-6 w-6 text-gray-500" />
          </button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          {/* Genre Filter */}
          <div>
            <label htmlFor="genre-filter" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Genre
            </label>
            <select
              id="genre-filter"
              value={localFilters.genre || ''}
              onChange={handleGenreChange}
              className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-red-500 focus:border-transparent"
            >
              <option value="">All Genres</option>
              {genres.map(genre => (
                <option key={genre.id} value={genre.id}>{genre.name}</option>
              ))}
            </select>
          </div>
          
          {/* Year Filter */}
          <div>
            <label htmlFor="year-filter" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Year
            </label>
            <select
              id="year-filter"
              value={localFilters.year || ''}
              onChange={handleYearChange}
              className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-red-500 focus:border-transparent"
            >
              <option value="">All Years</option>
              {years.map(year => (
                <option key={year} value={year}>{year}</option>
              ))}
            </select>
          </div>
          
          {/* Rating Filter */}
          <div>
            <label htmlFor="rating-filter" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Minimum Rating
            </label>
            <select
              id="rating-filter"
              value={localFilters.rating || ''}
              onChange={handleRatingChange}
              className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-red-500 focus:border-transparent"
            >
              <option value="">Any Rating</option>
              {[9, 8, 7, 6, 5, 4, 3, 2, 1].map(rating => (
                <option key={rating} value={rating}>{rating}+ Stars</option>
              ))}
            </select>
          </div>
        </div>
        
        <div className="flex flex-col sm:flex-row justify-end space-y-2 sm:space-y-0 sm:space-x-2">
          <button
            onClick={handleClearFilters}
            className="py-2 px-4 border border-gray-300 dark:border-gray-600 rounded-md text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors order-2 sm:order-1"
          >
            <span className="flex items-center justify-center">
              <X className="h-4 w-4 mr-1" />
              Clear Filters
            </span>
          </button>
          <button
            onClick={handleApplyFilters}
            className="py-2 px-4 bg-red-600 hover:bg-red-700 text-white rounded-md transition-colors order-1 sm:order-2"
          >
            Apply Filters
          </button>
        </div>
      </div>
      
      {/* CSS Animation */}
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
      `}</style>
    </div>
  );
};

export default FilterPanel;