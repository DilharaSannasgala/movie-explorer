import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useMovies } from '../contexts/MovieContext';
import Header from '../components/Header';
import MovieGrid from '../components/MovieGrid';
import SearchBar from '../components/SearchBar';
import FilterPanel from '../components/FilterPanel';

const HomePage: React.FC = () => {
  const { isAuthenticated } = useAuth();
  const {
    trendingMovies,
    movies,
    searchQuery,
    fetchTrendingMovies,
    loading,
    filterOptions,
    genres
  } = useMovies();
  const navigate = useNavigate();
  
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    } else {
      fetchTrendingMovies();
    }
  }, [isAuthenticated, navigate]);
  
  if (!isAuthenticated) {
    return null;
  }
  
  // Determine if filters are active by checking if any filter has a defined value
  const hasActiveFilters = Object.values(filterOptions).some(value => value !== undefined);
  
  // Determine what to display based on search query or active filters
  const shouldShowSearchResults = searchQuery.trim().length > 0;
  const shouldShowFilteredResults = hasActiveFilters;
  
  // Helper to get genre name from genre ID
  const getGenreName = (genreId: number): string => {
    const genre = genres.find(g => g.id === genreId);
    return genre ? genre.name : `Genre: ${genreId}`;
  };
  
  // Create a title for filtered results
  const getFilterTitle = () => {
    const parts = [];
    
    if (filterOptions.genre !== undefined) {
      parts.push(`Genre: ${getGenreName(filterOptions.genre)}`);
    }
    
    if (filterOptions.year !== undefined) {
      parts.push(`Year: ${filterOptions.year}`);
    }
    
    if (filterOptions.rating !== undefined) {
      parts.push(`Rating: ${filterOptions.rating}+`);
    }
    
    return `Filtered Movies (${parts.join(', ')})`;
  };
  
  // Get appropriate title for the movie grid
  const getMovieGridTitle = () => {
    if (shouldShowSearchResults && shouldShowFilteredResults) {
      return `Results for "${searchQuery}" in ${getFilterTitle()}`;
    } else if (shouldShowSearchResults) {
      return `Results for "${searchQuery}"`;
    } else if (shouldShowFilteredResults) {
      return getFilterTitle();
    }
    return "Trending This Week";
  };
  
  // Determine which movies to display
  const getMoviesToDisplay = () => {
    if (shouldShowSearchResults || shouldShowFilteredResults) {
      return movies;
    }
    return trendingMovies;
  };
  
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white transition-colors">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        <div className="flex flex-col items-center justify-center mb-8">
          <h1 className="text-3xl font-bold mb-6 text-center">Discover Your Next Favorite Movie</h1>
          <div className="w-full max-w-2xl mb-6">
            <SearchBar />
          </div>
          <div className="flex justify-center mb-6">
            <FilterPanel />
          </div>
        </div>
        
        {loading && !movies.length && !trendingMovies.length ? (
          <div className="flex justify-center items-center h-64">
            <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-red-500 border-r-transparent"></div>
          </div>
        ) : (
          <MovieGrid 
            movies={getMoviesToDisplay()}
            title={getMovieGridTitle()}
            showLoadMore={shouldShowSearchResults || shouldShowFilteredResults}
          />
        )}
      </main>
    </div>
  );
};

export default HomePage;