export interface Movie {
  adult: boolean;
  backdrop_path: string;
  budget: number;
  genres: {
    id: number;
    name: string;
  }[];
  id: string;
  origin_country: string[];
  original_language: string;
  original_title: string;
  overview: string;
  popularity: number;
  poster_path: string;
  production_companies: {
    id: number;
    logo_path: string;
    name: string;
    origin_country: string;
  }[];
  release_date: string;
  revenue: number;
  runtime: number;
  tagline: string;
  title: string;
}
