export type Genre =
  | 'Action'
  | 'Comedy'
  | 'Drama'
  | 'Horror'
  | 'SciFi'
  | 'Documentary'
  | 'Animation'
  | 'Thriller'
  | 'Romance'
  | 'Other';

export interface Movie {
  id: number;
  title: string;
  description: string;
  genre: Genre;
  releaseYear: number;
  director: string;
  rating: number;
}

export interface CreateMovieRequest {
  title: string;
  description: string;
  genre: Genre;
  releaseYear: number;
  director: string;
  rating: number;
}

export interface UpdateMovieRequest {
  title: string;
  description: string;
  genre: Genre;
  releaseYear: number;
  director: string;
  rating: number;
}