export interface Movie {
  id: number;
  title: string;
  poster_path: string;
  backdrop_path: string;
  release_date: string;
  vote_average: number;
  overview: string;
  genre_ids?: number[];
  genres?: Genre[];
}

export interface MovieDetails extends Movie {
  adult: boolean;
  belongs_to_collection: null | object;
  budget: number;
  genres: Genre[];
  homepage: string;
  imdb_id: string;
  origin_country: string[];
  original_language: string;
  original_title: string;
  popularity: number;
  production_companies: ProductionCompany[];
  production_countries: ProductionCountry[];
  revenue: number;
  runtime: number;
  spoken_languages: SpokenLanguage[];
  status: string;
  tagline: string;
  video: boolean;
  vote_count: number;
}

export interface Genre {
  id: number;
  name: string;
}

export interface ProductionCompany {
  id: number;
  logo_path: string | null;
  name: string;
  origin_country: string;
}

export interface ProductionCountry {
  iso_3166_1: string;
  name: string;
}

export interface SpokenLanguage {
  english_name: string;
  iso_639_1: string;
  name: string;
}

export interface MovieVideoResult {
  id: number;
  results: MovieVideo[];
}

export interface MovieVideo {
  iso_639_1: string;
  iso_3166_1: string;
  name: string;
  key: string;
  site: string;
  size: number;
  type: string;
  official: boolean;
  published_at: string;
  id: string;
}

export interface MovieSearchResponse {
  page: number;
  results: Movie[];
  total_pages: number;
  total_results: number;
}

export interface MovieFilterOptions {
  genre?: number;
  year?: number;
  rating?: number;
}