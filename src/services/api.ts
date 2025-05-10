import axios from 'axios';
import { MovieDetails, MovieSearchResponse, MovieVideoResult } from '../types/movie';

const API_KEY = import.meta.env.VITE_TMDB_API_KEY;
const API_URL = import.meta.env.VITE_TMDB_API_URL;

const api = axios.create({
  baseURL: API_URL,
  params: {
    api_key: API_KEY,
  },
});

export const searchMovies = async (query: string, page = 1): Promise<MovieSearchResponse> => {
  try {
    const response = await api.get<MovieSearchResponse>('/search/movie', {
      params: {
        query,
        page,
        include_adult: 'false',
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error searching movies:', error);
    throw error;
  }
};

export const getTrendingMovies = async (page = 1): Promise<MovieSearchResponse> => {
  try {
    const response = await api.get<MovieSearchResponse>('/trending/movie/week', {
      params: { page },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching trending movies:', error);
    throw error;
  }
};

export const getMovieDetails = async (id: number): Promise<MovieDetails> => {
  try {
    const response = await api.get<MovieDetails>(`/movie/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching movie details for ID ${id}:`, error);
    throw error;
  }
};

export const getMovieVideos = async (id: number): Promise<MovieVideoResult> => {
  try {
    const response = await api.get<MovieVideoResult>(`/movie/${id}/videos`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching movie videos for ID ${id}:`, error);
    throw error;
  }
};

export const getGenres = async () => {
  try {
    const response = await api.get('/genre/movie/list');
    return response.data.genres;
  } catch (error) {
    console.error('Error fetching genres:', error);
    throw error;
  }
};

export const discoverMovies = async (
  page = 1,
  genreId?: number,
  year?: number,
  voteAverage?: number
): Promise<MovieSearchResponse> => {
  try {
    // Create a params object with all possible filter parameters
    const params: Record<string, string | number> = {
      page,
      include_adult: 'false',
      sort_by: 'popularity.desc'
    };
    
    // Only add parameters if they're defined
    if (genreId) {
      console.log('Adding genre filter:', genreId);
      params.with_genres = genreId;
    }
    
    if (year) {
      console.log('Adding year filter:', year);
      params.primary_release_year = year;
    }
    
    if (voteAverage) {
      console.log('Adding rating filter:', voteAverage);
      params['vote_average.gte'] = voteAverage;
    }
    
    console.log('Final API params:', params);
    
    const response = await api.get<MovieSearchResponse>('/discover/movie', { params });
    return response.data;
  } catch (error) {
    console.error('Error discovering movies:', error);
    throw error;
  }
};