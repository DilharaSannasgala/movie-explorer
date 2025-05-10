import React, { createContext, useState, useContext, useCallback, ReactNode, useEffect } from 'react';
import { Movie, MovieDetails, MovieFilterOptions, Genre } from '../types/movie';
import { searchMovies, getTrendingMovies, getMovieDetails, getGenres, discoverMovies } from '../services/api';
import { getFavorites, addFavorite, removeFavorite, isFavorite, saveLastSearch, getLastSearch } from '../utils/storage';
import { debounce } from '../utils/debounce';

interface MovieContextType {
  movies: Movie[];
  trendingMovies: Movie[];
  selectedMovie: MovieDetails | null;
  loading: boolean;
  error: string | null;
  searchQuery: string;
  totalPages: number;
  currentPage: number;
  favorites: number[];
  genres: Genre[];
  filterOptions: MovieFilterOptions;
  filteredMovies: Movie[];
  setSearchQuery: (query: string) => void;
  searchMoviesHandler: (query: string, page?: number) => Promise<void>;
  loadMoreMovies: () => Promise<void>;
  fetchMovieDetails: (id: number) => Promise<void>;
  fetchTrendingMovies: (page?: number) => Promise<void>;
  toggleFavorite: (movieId: number) => void;
  checkIsFavorite: (movieId: number) => boolean;
  setFilterOptions: (options: MovieFilterOptions) => void;
  applyFilters: (page?: number, options?: MovieFilterOptions) => Promise<void>;
  clearFilters: () => void;
}

const MovieContext = createContext<MovieContextType>({} as MovieContextType);

interface MovieProviderProps {
  children: ReactNode;
}

export const MovieProvider: React.FC<MovieProviderProps> = ({ children }) => {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [trendingMovies, setTrendingMovies] = useState<Movie[]>([]);
  const [selectedMovie, setSelectedMovie] = useState<MovieDetails | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState(getLastSearch() || '');
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [favorites, setFavorites] = useState<number[]>(getFavorites());
  const [genres, setGenres] = useState<Genre[]>([]);
  const [filterOptions, setFilterOptions] = useState<MovieFilterOptions>({});
  const [filteredMovies, setFilteredMovies] = useState<Movie[]>([]);
  const [unfilteredSearchResults, setUnfilteredSearchResults] = useState<Movie[]>([]);

  // Load genres when component mounts
  useEffect(() => {
    const loadGenres = async () => {
      try {
        const genreData = await getGenres();
        setGenres(genreData);
      } catch (err) {
        console.error('Failed to load genres:', err);
      }
    };
    loadGenres();
  }, []);

  // Load initial trending movies
  useEffect(() => {
    fetchTrendingMovies();
    // If there's a last search, perform search
    if (searchQuery) {
      searchMoviesHandler(searchQuery);
    }
  }, []);

  // Effect to handle searching within filtered results
  useEffect(() => {
    // If we have both active filters and a search query
    if (Object.keys(filterOptions).length > 0 && searchQuery.trim()) {
      // Filter the filtered movies by the search query
      const filteredBySearch = filteredMovies.filter(movie => 
        movie.title.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setMovies(filteredBySearch);
    } 
    // If we have filtered movies but no search query
    else if (Object.keys(filterOptions).length > 0 && !searchQuery.trim()) {
      // Show all filtered movies
      setMovies(filteredMovies);
    }
    // If we have a search query but no active filters, the searchMoviesHandler will handle it
  }, [searchQuery, filteredMovies]);

  const searchMoviesHandler = async (query: string, page = 1) => {
    // Check if we have active filters
    const hasActiveFilters = Object.keys(filterOptions).length > 0;
    
    if (!query.trim()) {
      if (hasActiveFilters) {
        // If we have active filters but no search query, show all filtered movies
        setMovies(filteredMovies);
      } else {
        // If no filters and no query, clear results
        setMovies([]);
        setTotalPages(1);
        setCurrentPage(1);
      }
      saveLastSearch('');
      return;
    }
    
    // If we have active filters, search within the filtered movies
    if (hasActiveFilters) {
      // Filter the existing filtered movies by search query
      const results = filteredMovies.filter(movie => 
        movie.title.toLowerCase().includes(query.toLowerCase())
      );
      setMovies(results);
      saveLastSearch(query);
      return;
    }
    
    // Otherwise, perform a normal API search
    setLoading(true);
    setError(null);
    
    try {
      const response = await searchMovies(query, page);
      
      if (page === 1) {
        setMovies(response.results);
        setUnfilteredSearchResults(response.results);
      } else {
        const newMovies = [...movies, ...response.results];
        setMovies(newMovies);
        setUnfilteredSearchResults(newMovies);
      }
      
      setTotalPages(response.total_pages);
      setCurrentPage(page);
      saveLastSearch(query);
    } catch (err) {
      setError('Failed to search movies. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Create debounced search function
  const debouncedSearch = useCallback(
    debounce((query: string) => {
      searchMoviesHandler(query);
    }, 500),
    [filterOptions, filteredMovies] // Dependency on filterOptions and filteredMovies
  );

  // Update search query and trigger debounced search
  const handleSearchQuery = (query: string) => {
    setSearchQuery(query);
    debouncedSearch(query);
  };

  const loadMoreMovies = async () => {
    if (currentPage < totalPages && !loading) {
      const nextPage = currentPage + 1;
      
      const hasActiveFilters = Object.keys(filterOptions).length > 0;
      
      if (searchQuery && !hasActiveFilters) {
        // Only load more from API if we're not filtering locally
        await searchMoviesHandler(searchQuery, nextPage);
      } else if (hasActiveFilters) {
        // If we have filters, load more filtered movies
        await applyFilters(nextPage);
      }
    }
  };

  const fetchMovieDetails = async (id: number) => {
    setLoading(true);
    setError(null);
    
    try {
      const details = await getMovieDetails(id);
      setSelectedMovie(details);
    } catch (err) {
      setError('Failed to load movie details. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchTrendingMovies = async (page = 1) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await getTrendingMovies(page);
      setTrendingMovies(response.results);
    } catch (err) {
      setError('Failed to load trending movies. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const toggleFavorite = (movieId: number) => {
    if (isFavorite(movieId)) {
      removeFavorite(movieId);
      setFavorites(prev => prev.filter(id => id !== movieId));
    } else {
      addFavorite(movieId);
      setFavorites(prev => [...prev, movieId]);
    }
  };

  const checkIsFavorite = (movieId: number) => {
    return favorites.includes(movieId);
  };

  const applyFilters = async (page = 1, options?: MovieFilterOptions) => {
    setLoading(true);
    setError(null);
    
    // Use provided options or fall back to the ones stored in state
    const filtersToApply = options || filterOptions;
    
    try {
      // Add debugging to see what's being sent to API
      console.log('Applying filters with options:', filtersToApply);
      console.log('Genre:', filtersToApply.genre);
      console.log('Year:', filtersToApply.year);
      console.log('Rating:', filtersToApply.rating);
      
      const response = await discoverMovies(
        page,
        filtersToApply.genre,
        filtersToApply.year,
        filtersToApply.rating
      );
      
      console.log('API response:', response);
      
      const newFilteredMovies = page === 1 
        ? response.results 
        : [...filteredMovies, ...response.results];
      
      setFilteredMovies(newFilteredMovies);
      
      // If there's an active search query, filter these results by search
      if (searchQuery.trim()) {
        const filteredBySearch = newFilteredMovies.filter(movie => 
          movie.title.toLowerCase().includes(searchQuery.toLowerCase())
        );
        setMovies(filteredBySearch);
      } else {
        setMovies(newFilteredMovies);
      }
      
      setTotalPages(response.total_pages);
      setCurrentPage(page);
    } catch (err) {
      setError('Failed to apply filters. Please try again.');
      console.error('Filter error:', err);
    } finally {
      setLoading(false);
    }
  };

  const clearFilters = () => {
    setFilterOptions({});
    setFilteredMovies([]);
    
    // If we had a search query, restore the original search results
    if (searchQuery.trim()) {
      setMovies(unfilteredSearchResults);
    } else {
      setMovies([]);
    }
    
    setTotalPages(1);
    setCurrentPage(1);
  };

  return (
    <MovieContext.Provider
      value={{
        movies,
        trendingMovies,
        selectedMovie,
        loading,
        error,
        searchQuery,
        totalPages,
        currentPage,
        favorites,
        genres,
        filterOptions,
        filteredMovies,
        setSearchQuery: handleSearchQuery,
        searchMoviesHandler,
        loadMoreMovies,
        fetchMovieDetails,
        fetchTrendingMovies,
        toggleFavorite,
        checkIsFavorite,
        setFilterOptions,
        applyFilters,
        clearFilters
      }}
    >
      {children}
    </MovieContext.Provider>
  );
};

export const useMovies = (): MovieContextType => useContext(MovieContext);