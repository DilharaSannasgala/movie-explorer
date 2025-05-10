import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Heart, Calendar, Clock, Star, ArrowLeft } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useMovies } from '../contexts/MovieContext';
import { getMovieVideos } from '../services/api';
import { MovieVideo } from '../types/movie';
import Header from '../components/Header';
import YouTubeEmbed from '../components/YouTubeEmbed';

const MovieDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const movieId = parseInt(id || '0');
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const { selectedMovie, fetchMovieDetails, loading, toggleFavorite, checkIsFavorite } = useMovies();
  const [videos, setVideos] = useState<MovieVideo[]>([]);
  // Removed unused loadingVideos state
  
  const isFavorite = movieId ? checkIsFavorite(movieId) : false;
  const imageBaseUrl = import.meta.env.VITE_TMDB_IMAGE_URL || 'https://image.tmdb.org/t/p';
  
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    
    if (movieId) {
      fetchMovieDetails(movieId);
      
      // Fetch videos
      const fetchVideos = async () => {
        // Removed setLoadingVideos as it is unused
        try {
          const videoData = await getMovieVideos(movieId);
          setVideos(videoData.results);
        } catch (error) {
          console.error('Error fetching videos:', error);
        }
        // Removed setLoadingVideos as it is unused
      };
      
      fetchVideos();
    }
  }, [movieId, isAuthenticated, navigate]);
  
  if (!isAuthenticated) {
    return null;
  }
  
  const handleGoBack = () => {
    navigate(-1);
  };
  
  const getTrailer = () => {
    // Try to find an official trailer first
    const officialTrailer = videos.find(
      video => video.type === 'Trailer' && video.official && video.site === 'YouTube'
    );
    
    // If no official trailer, get any trailer
    const anyTrailer = videos.find(
      video => video.type === 'Trailer' && video.site === 'YouTube'
    );
    
    // If no trailer, get any video
    const anyVideo = videos.find(video => video.site === 'YouTube');
    
    return officialTrailer || anyTrailer || anyVideo;
  };
  
  const trailer = getTrailer();
  
  if (loading || !selectedMovie) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white transition-colors">
        <Header />
        <div className="h-screen flex justify-center items-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-red-500 border-r-transparent"></div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white transition-colors">
      <Header />
      
      {/* Backdrop Image */}
      <div className="relative w-full h-[50vh]">
        {selectedMovie.backdrop_path ? (
          <div className="absolute inset-0">
            <img 
              src={`${imageBaseUrl}/original${selectedMovie.backdrop_path}`}
              alt={selectedMovie.title}
              className="w-full h-full object-cover object-center"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-gray-900 to-transparent"></div>
          </div>
        ) : (
          <div className="absolute inset-0 bg-gray-800"></div>
        )}
        
        <div className="absolute bottom-0 left-0 right-0 p-6">
          <div className="container mx-auto flex items-end">
            <button 
              onClick={handleGoBack}
              className="bg-black/50 hover:bg-black/70 text-white p-2 rounded-full mr-4 transition-colors"
              aria-label="Go back"
            >
              <ArrowLeft className="h-6 w-6" />
            </button>
            <h1 className="text-4xl font-bold text-white">{selectedMovie.title}</h1>
          </div>
        </div>
      </div>
      
      <main className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row md:gap-8">
          {/* Movie Poster */}
          <div className="w-full md:w-1/3 lg:w-1/4 mb-6 md:mb-0">
            <div className="relative">
              <div className="bg-gray-200 dark:bg-gray-700 rounded-lg overflow-hidden shadow-lg">
                {selectedMovie.poster_path ? (
                  <img 
                    src={`${imageBaseUrl}/w500${selectedMovie.poster_path}`}
                    alt={selectedMovie.title}
                    className="w-full"
                  />
                ) : (
                  <div className="aspect-[2/3] flex items-center justify-center">
                    <span className="text-gray-500 dark:text-gray-400">No Image</span>
                  </div>
                )}
              </div>
              
              <button 
                onClick={() => toggleFavorite(selectedMovie.id)}
                className={`absolute top-4 right-4 p-3 rounded-full ${
                  isFavorite 
                    ? 'bg-red-500 text-white' 
                    : 'bg-black/50 text-white hover:bg-red-500'
                } transition-colors`}
                aria-label={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
              >
                <Heart className="w-6 h-6" fill={isFavorite ? 'currentColor' : 'none'} />
              </button>
            </div>
          </div>
          
          {/* Movie Details */}
          <div className="w-full md:w-2/3 lg:w-3/4">
            <div className="flex flex-wrap gap-4 mb-6">
              {selectedMovie.release_date && (
                <div className="flex items-center bg-gray-200 dark:bg-gray-800 px-3 py-1 rounded-full">
                  <Calendar className="w-4 h-4 mr-2 text-gray-600 dark:text-gray-400" />
                  <span className="text-sm">
                    {new Date(selectedMovie.release_date).toLocaleDateString('en-US', { 
                      month: 'long', 
                      day: 'numeric', 
                      year: 'numeric' 
                    })}
                  </span>
                </div>
              )}
              
              {selectedMovie.runtime && (
                <div className="flex items-center bg-gray-200 dark:bg-gray-800 px-3 py-1 rounded-full">
                  <Clock className="w-4 h-4 mr-2 text-gray-600 dark:text-gray-400" />
                  <span className="text-sm">
                    {Math.floor(selectedMovie.runtime / 60)}h {selectedMovie.runtime % 60}m
                  </span>
                </div>
              )}
              
              {selectedMovie.vote_average && (
                <div className="flex items-center bg-yellow-100 dark:bg-yellow-900 px-3 py-1 rounded-full">
                  <Star className="w-4 h-4 mr-2 text-yellow-600 dark:text-yellow-400" fill="currentColor" />
                  <span className="text-sm text-yellow-800 dark:text-yellow-200">
                    {selectedMovie.vote_average.toFixed(1)} ({selectedMovie.vote_count} votes)
                  </span>
                </div>
              )}
            </div>
            
            <div className="mb-6">
              <h3 className="text-xl font-bold mb-2">Overview</h3>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">{selectedMovie.overview}</p>
            </div>
            
            {selectedMovie.tagline && (
              <div className="mb-6">
                <p className="italic text-gray-600 dark:text-gray-400">"{selectedMovie.tagline}"</p>
              </div>
            )}
            
            <div className="grid md:grid-cols-2 gap-6 mb-8">
              {selectedMovie.genres && selectedMovie.genres.length > 0 && (
                <div>
                  <h3 className="text-lg font-medium mb-2">Genres</h3>
                  <div className="flex flex-wrap gap-2">
                    {selectedMovie.genres.map(genre => (
                      <span 
                        key={genre.id}
                        className="bg-gray-200 dark:bg-gray-800 px-3 py-1 rounded-full text-sm"
                      >
                        {genre.name}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              
              {selectedMovie.production_companies && selectedMovie.production_companies.length > 0 && (
                <div>
                  <h3 className="text-lg font-medium mb-2">Production Companies</h3>
                  <div className="flex flex-wrap gap-2">
                    {selectedMovie.production_companies.map(company => (
                      <span 
                        key={company.id}
                        className="bg-gray-200 dark:bg-gray-800 px-3 py-1 rounded-full text-sm"
                      >
                        {company.name}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
            
            {/* Trailer Section */}
            {trailer && (
              <div className="mt-8">
                <h3 className="text-xl font-bold mb-4">Trailer</h3>
                <YouTubeEmbed videoId={trailer.key} />
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default MovieDetailsPage;