export const BASE_URL = "https://dayyapi.vercel.app";

export interface MovieItem {
  adult: boolean;
  backdrop_path: string | null;
  genre_ids: number[];
  id: number;
  media_type?: "movie" | "tv"; // only in trending & search
  original_language: string;
  original_title?: string;    // movie
  original_name?: string;     // tv
  overview: string;           // can be empty ""
  popularity: number;
  poster_path: string | null;
  release_date?: string;      // movie
  first_air_date?: string;    // tv
  softcore: boolean;
  title?: string;             // movie
  name?: string;              // tv
  video: boolean;
  vote_average: number;
  vote_count: number;
}

export interface HomeResponse {
  sections: {
    [key: string]: {
      label: string;
      results: MovieItem[];
    };
  };
}

export interface TrendingResponse {
  page: number;
  results: MovieItem[];
  total_pages: number;
  total_results: number;
}

export interface PopularResponse {
  page: number;
  results: MovieItem[];
  total_pages: number;
  total_results: number;
}

export interface NowPlayingResponse {
  dates: { maximum: string; minimum: string };
  page: number;
  results: MovieItem[];
  total_pages: number;
  total_results: number;
}

export interface UpcomingResponse {
  dates: { maximum: string; minimum: string };
  page: number;
  results: MovieItem[];
  total_pages: number;
  total_results: number;
}

export interface DiscoverResponse {
  page: number;
  results: MovieItem[];
  total_pages: number;
  total_results: number;
}

export interface SearchResponse {
  query: string;
  results: MovieItem[];
}

export interface GenresResponse {
  genres: { id: number; name: string }[];
}

export interface CastMember {
  id: number;
  name: string;
  character: string;
  profile_path: string | null;
  known_for_department: string;
}

export interface DetailResponse {
  id: number;
  title?: string;             // movie
  name?: string;              // tv
  overview: string;
  backdrop_path: string | null;
  poster_path: string | null;
  release_date?: string;      // movie
  first_air_date?: string;    // tv
  runtime?: number;           // movie
  episode_run_time?: number[]; // tv
  genres: { id: number; name: string }[];
  vote_average: number;
  vote_count: number;
  tagline: string | null;
  status: string;
  budget?: number;
  revenue?: number;
  belongs_to_collection?: any;
  credits?: {
    cast: CastMember[];
    crew?: { id: number; name: string; job: string; department?: string }[];
  };
  production_companies?: { id: number; name: string }[];
}

export interface ServerItem {
  name: string;
  url: string;
}

export interface ServersResponse {
  id: number;
  type: string;
  servers: ServerItem[];
}

export interface StatusResponse {
  online: boolean;
  upstream: string;
}

// Prefix builders for TMDB images
export function getPosterUrl(path: string | null): string {
  if (!path) return "/placeholder-poster.png"; // Fallback handled in UI too
  return `https://image.tmdb.org/t/p/w500${path}`;
}

export function getBackdropUrl(path: string | null): string {
  if (!path) return "";
  return `https://image.tmdb.org/t/p/original${path}`;
}

export function getProfileUrl(path: string | null): string {
  if (!path) return "/placeholder-profile.png";
  return `https://image.tmdb.org/t/p/w185${path}`;
}

// Standard fetch wrapper with try/catch
async function apiFetch<T>(path: string, options?: RequestInit): Promise<T> {
  const url = `${BASE_URL}${path}`;
  const response = await fetch(url, options);
  if (!response.ok) {
    throw new Error(`API fetch error: ${response.status} ${response.statusText}`);
  }
  return response.json() as Promise<T>;
}

// API methods
export async function getHomeData(): Promise<HomeResponse> {
  return apiFetch<HomeResponse>("/api/home");
}

export async function getTrending(page: number = 1): Promise<TrendingResponse> {
  return apiFetch<TrendingResponse>(`/api/trending?page=${page}`);
}

export async function getPopular(page: number = 1): Promise<PopularResponse> {
  return apiFetch<PopularResponse>(`/api/popular?page=${page}`);
}

export async function getNowPlaying(page: number = 1): Promise<NowPlayingResponse> {
  return apiFetch<NowPlayingResponse>(`/api/now-playing?page=${page}`);
}

export async function getUpcoming(page: number = 1): Promise<UpcomingResponse> {
  return apiFetch<UpcomingResponse>(`/api/upcoming?page=${page}`);
}

export async function getDiscover(page: number = 1, genreId?: number): Promise<DiscoverResponse> {
  let path = `/api/discover?page=${page}`;
  if (genreId) {
    path += `&with_genres=${genreId}`;
  }
  return apiFetch<DiscoverResponse>(path);
}

export async function searchMovies(query: string): Promise<SearchResponse> {
  return apiFetch<SearchResponse>(`/api/search?q=${encodeURIComponent(query)}`);
}

export async function getGenres(): Promise<GenresResponse> {
  return apiFetch<GenresResponse>("/api/genres");
}

export async function getDetail(type: "movie" | "tv", id: string | number): Promise<DetailResponse> {
  return apiFetch<DetailResponse>(`/api/detail/${type}/${id}`);
}

export async function getServers(type: "movie" | "tv", id: string | number): Promise<ServersResponse> {
  return apiFetch<ServersResponse>(`/api/servers/${type}/${id}`);
}

export async function getApiStatus(): Promise<StatusResponse> {
  return apiFetch<StatusResponse>("/api/status");
}
