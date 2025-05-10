import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Heart } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useMovies } from '../contexts/MovieContext';
import { getMovieDetails } from '../services/api';
import { Movie } from '../types/movie';
import Header from '../components/Header';
import MovieGrid from '../components/MovieGrid';

const FavoritesPage: React.FC = () => {
  const { isAuthenticated } = useAuth();
  const { favorites } = useMovies();
  const [favoriteMovies, setFavoriteMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    
    const fetchFavoriteMovies = async () => {
      if (favorites.length === 0) return;
      
      setLoading(true);
      
      try {
        const moviePromises = favorites.map(id => getMovieDetails(id));
        const movies = await Promise.all(moviePromises);
        setFavoriteMovies(movies);
      } catch (error) {
        console.error('Error fetching favorite movies:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchFavoriteMovies();
  }, [favorites, isAuthenticated, navigate]);

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white transition-colors">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center mb-8">
          <Heart className="w-6 h-6 mr-2 text-red-500" fill="currentColor" />
          <h1 className="text-3xl font-bold">Your Favorite Movies</h1>
        </div>
        
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-red-500 border-r-transparent"></div>
          </div>
        ) : (
          favorites.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500 dark:text-gray-400 mb-4">
                You haven't added any favorite movies yet.
              </p>
              <button
                onClick={() => navigate('/')}
                className="px-6 py-2 bg-red-600 hover:bg-red-700 text-white rounded-full transition-colors"
              >
                Discover Movies
              </button>
            </div>
          ) : (
            <MovieGrid movies={favoriteMovies} />
          )
        )}
      </main>
    </div>
  );
};

export default FavoritesPage;