import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getPopular, getTrending, MovieItem, getPosterUrl } from "../api/dayyapi";
import { useGenres } from "../components/GenreProvider";
import { TopBar } from "../components/TopBar";
import { Crown, Star, AlertCircle, RefreshCw, Loader2 } from "lucide-react";

const TABS = [
  { key: "popular", label: "Terpopuler" },
  { key: "trending", label: "Trending" },
];

export const Ranking: React.FC = () => {
  const [activeTab, setActiveTab] = useState<"popular" | "trending">("popular");
  const [items, setItems] = useState<MovieItem[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { genresMap } = useGenres();

  async function load(targetPage: number, replace: boolean) {
    if (replace) {
      setIsLoading(true);
      setError(null);
    } else {
      setIsLoadingMore(true);
    }
    try {
      const res =
        activeTab === "popular" ? await getPopular(targetPage) : await getTrending(targetPage);
      setItems((prev) => (replace ? res.results : [...prev, ...res.results]));
      setPage(res.page);
      setTotalPages(Math.min(res.total_pages, 500));
    } catch (err: any) {
      if (replace) setError(err?.message || "Gagal memuat daftar ranking.");
    } finally {
      setIsLoading(false);
      setIsLoadingMore(false);
    }
  }

  useEffect(() => {
    load(1, true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTab]);

  const rankAccent = (rank: number) => {
    if (rank === 0) return "text-amber-400 fill-amber-400";
    if (rank === 1) return "text-slate-300 fill-slate-300";
    if (rank === 2) return "text-orange-400 fill-orange-400";
    return "";
  };

  return (
    <div className="space-y-5" id="ranking-page">
      <TopBar title="Ranking" />

      {/* Tabs */}
      <div className="px-5 md:px-10 flex items-center gap-2">
        {TABS.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key as "popular" | "trending")}
            className={`px-4 py-2 rounded-full text-xs font-bold tracking-wide transition-all cursor-pointer ${
              activeTab === tab.key
                ? "bg-primary text-white shadow-lg shadow-primary/20"
                : "bg-surface text-text-secondary border border-white/5 hover:text-white"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {error ? (
        <div className="flex flex-col items-center justify-center min-h-[40vh] px-5 text-center">
          <AlertCircle className="w-8 h-8 text-[#FF3B30] mb-3" />
          <p className="text-sm text-text-secondary">{error}</p>
          <button
            onClick={() => load(1, true)}
            className="mt-4 flex items-center gap-2 px-5 py-2 rounded-full bg-primary text-white text-xs font-semibold"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            Muat Ulang
          </button>
        </div>
      ) : (
        <div className="px-5 md:px-10 space-y-2.5">
          {isLoading
            ? Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="flex items-center gap-3 bg-surface rounded-2xl p-3 animate-shimmer h-24" />
              ))
            : items.map((item, index) => {
                const isMovie = item.media_type ? item.media_type === "movie" : !!(item.title || item.release_date);
                const title = isMovie ? item.title || item.original_title : item.name || item.original_name;
                const date = isMovie ? item.release_date : item.first_air_date;
                const year = date ? date.substring(0, 4) : "-";
                const genreName =
                  item.genre_ids && item.genre_ids.length > 0 && genresMap[item.genre_ids[0]]
                    ? genresMap[item.genre_ids[0]]
                    : "Film";
                const posterUrl = item.poster_path ? getPosterUrl(item.poster_path) : null;

                return (
                  <Link
                    key={`${item.id}-${index}`}
                    to={`/${isMovie ? "movie" : "tv"}/${item.id}`}
                    className="flex items-center gap-3 bg-surface border border-white/5 rounded-2xl p-2.5 hover:bg-white/5 transition-colors"
                  >
                    {/* Rank marker */}
                    <div className="w-6 flex-shrink-0 flex justify-center">
                      {index < 3 ? (
                        <Crown className={`w-5 h-5 ${rankAccent(index)}`} />
                      ) : (
                        <span className="text-sm font-bold text-text-secondary">{index + 1}</span>
                      )}
                    </div>

                    {/* Poster */}
                    <div className="w-16 h-20 flex-shrink-0 rounded-xl overflow-hidden bg-background">
                      {posterUrl ? (
                        <img
                          src={posterUrl}
                          alt={title}
                          loading="lazy"
                          referrerPolicy="no-referrer"
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-[9px] text-text-secondary text-center px-1">
                          {title}
                        </div>
                      )}
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <h3 className="text-sm font-bold text-text-primary truncate">{title}</h3>
                      <div className="flex items-center gap-1 mt-1">
                        <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                        <span className="text-sm font-bold text-amber-400">
                          {item.vote_average ? item.vote_average.toFixed(1) : "0.0"}
                        </span>
                      </div>
                      <p className="text-[11px] text-text-secondary mt-0.5 truncate">
                        {genreName} · {year}
                      </p>
                    </div>
                  </Link>
                );
              })}

          {!isLoading && page < totalPages && (
            <button
              onClick={() => load(page + 1, false)}
              disabled={isLoadingMore}
              className="w-full flex items-center justify-center gap-2 py-3 rounded-full bg-surface border border-white/5 text-xs font-semibold text-text-secondary hover:text-white transition-colors mt-2 cursor-pointer"
            >
              {isLoadingMore ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <span>Muat Lebih Banyak</span>
              )}
            </button>
          )}
        </div>
      )}
    </div>
  );
};
