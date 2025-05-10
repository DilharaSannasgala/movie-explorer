import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Heart } from 'lucide-react';
import { Movie } from '../types/movie';
import { useMovies } from '../contexts/MovieContext';

interface MovieCardProps {
  movie: Movie;
}

const MovieCard: React.FC<MovieCardProps> = ({ movie }) => {
  const navigate = useNavigate();
  const { toggleFavorite, checkIsFavorite } = useMovies();
  const isFavorite = checkIsFavorite(movie.id);
  const imageBaseUrl = import.meta.env.VITE_TMDB_IMAGE_URL || 'https://image.tmdb.org/t/p';

  const handleCardClick = () => {
    navigate(`/movie/${movie.id}`);
  };

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent card click when clicking favorite button
    toggleFavorite(movie.id);
  };

  // Extract year from release date
  const releaseYear = movie.release_date ? new Date(movie.release_date).getFullYear() : 'N/A';

  return (
    <div 
      className="relative bg-white dark:bg-gray-800 rounded-lg overflow-hidden shadow-lg hover:shadow-xl 
                 transition-transform duration-300 hover:-translate-y-1 cursor-pointer"
      onClick={handleCardClick}
    >
      <div className="aspect-[2/3] bg-gray-200 dark:bg-gray-700">
        {movie.poster_path ? (
          <img 
            src={`${imageBaseUrl}/w500${movie.poster_path}`}
            alt={movie.title}
            className="w-full h-full object-cover"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-500 dark:text-gray-400">
            No Image
          </div>
        )}
      </div>
      
      <button 
        className={`absolute top-2 right-2 p-2 rounded-full ${
          isFavorite 
            ? 'bg-red-500 text-white' 
            : 'bg-black/50 text-white hover:bg-red-500 hover:text-white'
        } transition-colors`}
        onClick={handleFavoriteClick}
        aria-label={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
      >
        <Heart className="w-5 h-5" fill={isFavorite ? 'currentColor' : 'none'} />
      </button>
      
      <div className="p-4">
        <h3 className="text-lg font-medium text-gray-900 dark:text-white line-clamp-1">{movie.title}</h3>
        
        <div className="flex justify-between items-center mt-2">
          <span className="text-sm text-gray-600 dark:text-gray-300">{releaseYear}</span>
          
          <div className="flex items-center">
            <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200">
              {movie.vote_average ? movie.vote_average.toFixed(1) : 'N/A'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MovieCard;