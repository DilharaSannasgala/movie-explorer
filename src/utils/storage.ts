import { User } from '../types/user';

// Local storage keys
const FAVORITES_KEY = 'movie-explorer-favorites';
const LAST_SEARCH_KEY = 'movie-explorer-last-search';
const USER_KEY = 'movie-explorer-user';
const THEME_KEY = 'movie-explorer-theme';

// Favorites functions
export const getFavorites = (): number[] => {
  const favoritesJson = localStorage.getItem(FAVORITES_KEY);
  return favoritesJson ? JSON.parse(favoritesJson) : [];
};

export const addFavorite = (movieId: number): void => {
  const favorites = getFavorites();
  if (!favorites.includes(movieId)) {
    favorites.push(movieId);
    localStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites));
  }
};

export const removeFavorite = (movieId: number): void => {
  const favorites = getFavorites();
  const updatedFavorites = favorites.filter(id => id !== movieId);
  localStorage.setItem(FAVORITES_KEY, JSON.stringify(updatedFavorites));
};

export const isFavorite = (movieId: number): boolean => {
  const favorites = getFavorites();
  return favorites.includes(movieId);
};

// Last search functions
export const getLastSearch = (): string => {
  return localStorage.getItem(LAST_SEARCH_KEY) || '';
};

export const saveLastSearch = (query: string): void => {
  localStorage.setItem(LAST_SEARCH_KEY, query);
};

// User functions
export const saveUser = (user: User): void => {
  localStorage.setItem(USER_KEY, JSON.stringify(user));
};

export const getUser = (): User | null => {
  const userJson = localStorage.getItem(USER_KEY);
  return userJson ? JSON.parse(userJson) as User : null;
};

export const removeUser = (): void => {
  localStorage.removeItem(USER_KEY);
};

// Theme functions
export const getTheme = (): 'light' | 'dark' => {
  return (localStorage.getItem(THEME_KEY) as 'light' | 'dark') || 'dark';
};

export const saveTheme = (theme: 'light' | 'dark'): void => {
  localStorage.setItem(THEME_KEY, theme);
};