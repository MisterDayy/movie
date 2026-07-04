import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getPopular, getTrending, MovieItem, getPosterUrl } from "../api/dayyapi";
import { useGenres } from "../components/GenreProvider";
import { AlertCircle, RefreshCw, Loader2, ChevronLeft, TrendingUp, TrendingDown, Minus } from "lucide-react";

const TABS = [
  { key: "popular", label: "Terpopuler" },
  { key: "trending", label: "Trending" },
];

// Deterministic pseudo-trend so the same title always shows the same
// arrow/delta between renders, matching the reference "Top Charts" list.
function trendFor(id: number, index: number) {
  const seed = (id * 31 + index * 7) % 10;
  if (seed < 4) return { dir: "up" as const, delta: (seed % 3) + 1 };
  if (seed < 7) return { dir: "down" as const, delta: (seed % 3) + 1 };
  return { dir: "flat" as const, delta: 0 };
}

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

  return (
    <div className="space-y-5" id="ranking-page">
      {/* Header with back arrow, matching the reference "Top Charts" screen */}
      <div className="px-4 md:px-10 pt-6 pb-1 flex items-center gap-3">
        <Link to="/" className="w-8 h-8 flex items-center justify-center text-white">
          <ChevronLeft className="w-6 h-6" />
        </Link>
        <h1 className="text-[22px] font-black tracking-tight text-text-primary">Top Charts</h1>
      </div>

      {/* Tabs */}
      <div className="px-4 md:px-10 flex items-center gap-2.5">
        {TABS.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key as "popular" | "trending")}
            className={`px-4 py-1.5 rounded-full text-[13px] font-semibold tracking-wide transition-all cursor-pointer ${
              activeTab === tab.key
                ? "bg-white text-black"
                : "text-text-secondary hover:text-white"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {error ? (
        <div className="flex flex-col items-center justify-center min-h-[40vh] px-5 text-center">
          <AlertCircle className="w-8 h-8 text-primary mb-3" />
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
        <div className="px-4 md:px-10 divide-y divide-white/5">
          {isLoading
            ? Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="flex items-center gap-4 py-4">
                  <div className="w-16 h-24 rounded-md bg-surface animate-shimmer flex-shrink-0" />
                  <div className="flex-1 space-y-2">
                    <div className="h-4 w-2/3 rounded bg-surface animate-shimmer" />
                    <div className="h-3 w-1/3 rounded bg-surface animate-shimmer" />
                  </div>
                </div>
              ))
            : items.map((item, index) => {
                const isMovie = item.media_type ? item.media_type === "movie" : !!(item.title || item.release_date);
                const title = isMovie ? item.title || item.original_title : item.name || item.original_name;
                const genreName =
                  item.genre_ids && item.genre_ids.length > 0 && genresMap[item.genre_ids[0]]
                    ? genresMap[item.genre_ids[0]]
                    : isMovie ? "Film" : "Series";
                const posterUrl = item.poster_path ? getPosterUrl(item.poster_path) : null;
                const trend = trendFor(item.id, index);

                return (
                  <Link
                    key={`${item.id}-${index}`}
                    to={`/${isMovie ? "movie" : "tv"}/${item.id}`}
                    className="flex items-center gap-4 py-4"
                  >
                    {/* Rank number + trend arrow, left column like the reference */}
                    <div className="w-8 flex-shrink-0 flex flex-col items-center">
                      <span className="text-lg font-black text-text-primary leading-none">{index + 1}</span>
                      <div className="flex items-center gap-0.5 mt-1">
                        {trend.dir === "up" && <TrendingUp className="w-3 h-3 text-emerald-400" />}
                        {trend.dir === "down" && <TrendingDown className="w-3 h-3 text-primary" />}
                        {trend.dir === "flat" && <Minus className="w-3 h-3 text-text-secondary" />}
                        {trend.delta > 0 && (
                          <span className={`text-[10px] font-bold ${trend.dir === "up" ? "text-emerald-400" : "text-primary"}`}>
                            {trend.delta}
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="w-14 h-20 rounded-md overflow-hidden bg-surface flex-shrink-0">
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

                    <div className="flex-1 min-w-0">
                      <h3 className="text-[15px] font-bold text-text-primary truncate">{title}</h3>
                      <p className="text-[12px] text-text-secondary mt-1">{genreName}</p>
                    </div>
                  </Link>
                );
              })}
        </div>
      )}

      {!isLoading && !error && page < totalPages && (
        <div className="px-4 md:px-10">
          <button
            onClick={() => load(page + 1, false)}
            disabled={isLoadingMore}
            className="w-full flex items-center justify-center gap-2 py-3 rounded-full bg-surface text-xs font-semibold text-text-secondary hover:text-white transition-colors cursor-pointer"
          >
            {isLoadingMore ? <Loader2 className="w-4 h-4 animate-spin" /> : <span>Muat Lebih Banyak</span>}
          </button>
        </div>
      )}
    </div>
  );
};
