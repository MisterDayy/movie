import React, { useState, useEffect, useRef } from "react";
import { searchMovies, MovieItem } from "../api/dayyapi";
import { MovieCard } from "../components/MovieCard";
import { GridSkeleton } from "../components/Skeleton";
import { Search as SearchIcon, X, Film, Sparkles, HelpCircle } from "lucide-react";

export const Search: React.FC = () => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<MovieItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const inputRef = useRef<HTMLInputElement>(null);

  // Debounce effect
  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);

    const timer = setTimeout(async () => {
      try {
        const res = await searchMovies(query);
        setResults(res.results || []);
      } catch (err: any) {
        console.error("Search error:", err);
        setError("Gagal mencari hasil pencarian dari server.");
      } finally {
        setIsLoading(false);
      }
    }, 450); // 450ms debounce delay as per transition spec

    return () => clearTimeout(timer);
  }, [query]);

  // Focus input on load
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const clearSearch = () => {
    setQuery("");
    setResults([]);
    inputRef.current?.focus();
  };

  const trendingQueries = ["Squid Game", "Spider-Man", "Naruto", "One Piece", "Avengers", "Kimi no Na wa"];

  return (
    <div className="px-5 md:px-10 py-6 space-y-8 pb-20" id="search-page">
      {/* Search Header */}
      <div>
        <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-text-primary">
          Pencarian Pintar
        </h1>
        <p className="text-sm text-text-secondary mt-1">
          Cari film favorit, seri televisi, anime, dan banyak lagi secara instan.
        </p>
      </div>

      {/* Input Field Container */}
      <div className="relative max-w-2xl w-full" id="search-bar-container">
        <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none text-text-secondary">
          <SearchIcon className="w-5 h-5" />
        </div>

        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Ketik judul film, seri drama, atau aktor..."
          className="w-full pl-12 pr-12 py-3.5 bg-surface border border-white/5 rounded-2xl text-text-primary text-sm font-medium placeholder-text-secondary focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50 transition-all shadow-lg"
        />

        {query && (
          <button
            onClick={clearSearch}
            className="absolute inset-y-0 right-4 flex items-center text-text-secondary hover:text-white cursor-pointer"
            aria-label="Hapus pencarian"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Recommended Tags (if empty query) */}
      {!query && (
        <div className="space-y-4 pt-4 animate-fade-in" id="recommended-queries">
          <div className="flex items-center gap-2 text-xs font-bold text-text-secondary uppercase tracking-widest">
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span>Pencarian Populer Hari Ini</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {trendingQueries.map((term, index) => (
              <button
                key={index}
                onClick={() => setQuery(term)}
                className="px-4 py-2 rounded-xl bg-surface hover:bg-white/5 border border-white/5 text-xs text-text-secondary hover:text-white transition-colors cursor-pointer font-medium"
              >
                {term}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Search Results Display */}
      {isLoading ? (
        <div className="space-y-4">
          <p className="text-xs text-text-secondary animate-pulse flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-primary block animate-ping" />
            Mencari hasil pencarian untuk "{query}"...
          </p>
          <GridSkeleton count={12} />
        </div>
      ) : error ? (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <X className="w-12 h-12 text-[#FF3B30] mb-2" />
          <p className="text-text-primary font-bold">Terjadi Kesalahan</p>
          <p className="text-text-secondary text-xs mt-1">{error}</p>
        </div>
      ) : query && results.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center bg-surface border border-white/5 rounded-2xl p-8 max-w-md mx-auto">
          <HelpCircle className="w-12 h-12 text-text-secondary/30 mb-3" />
          <p className="text-text-primary font-bold text-base">Tidak Ada Hasil Cocok</p>
          <p className="text-text-secondary text-xs mt-1.5 leading-relaxed">
            Tidak dapat menemukan film atau seri televisi yang cocok dengan pencarian kata kunci "{query}". Silakan periksa kembali ejaan Anda.
          </p>
        </div>
      ) : (
        query && (
          <div className="space-y-6">
            <div className="flex items-center justify-between border-b border-white/5 pb-3">
              <span className="text-xs font-bold text-text-secondary uppercase tracking-widest">
                Ditemukan <span className="text-text-primary">{results.length}</span> Hasil Cocok
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-x-3 gap-y-6">
              {results.map((item) => (
                <div key={item.id} className="animate-fade-in">
                  <MovieCard item={item} />
                </div>
              ))}
            </div>
          </div>
        )
      )}
    </div>
  );
};
