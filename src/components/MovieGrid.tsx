import React from 'react';
import MovieCard from './MovieCard';
import { Movie } from '../types/movie';
import { useMovies } from '../contexts/MovieContext';

interface MovieGridProps {
  movies: Movie[];
  title?: string;
  showLoadMore?: boolean;
}

const MovieGrid: React.FC<MovieGridProps> = ({ 
  movies, 
  title,
  showLoadMore = false
}) => {
  const { loading, loadMoreMovies, currentPage, totalPages } = useMovies();
  
  if (!movies.length && !loading) {
    return (
      <div className="py-8 text-center">
        <p className="text-gray-600 dark:text-gray-400">No movies found</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-6">
      {title && (
        <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">{title}</h2>
      )}
      
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6">
        {movies.map(movie => (
          <MovieCard key={movie.id} movie={movie} />
        ))}
      </div>
      
      {loading && (
        <div className="py-8 text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-red-500 border-r-transparent"></div>
        </div>
      )}
      
      {showLoadMore && currentPage < totalPages && !loading && (
        <div className="mt-8 text-center">
          <button
            onClick={() => loadMoreMovies()}
            className="px-6 py-2 bg-red-600 hover:bg-red-700 text-white rounded-full transition-colors
                       shadow hover:shadow-md font-medium"
          >
            Load More
          </button>
        </div>
      )}
    </div>
  );
};

export default MovieGrid;