import React, { useState, useEffect } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import {
  getTrending,
  getPopular,
  getNowPlaying,
  getUpcoming,
  getDiscover,
  MovieItem
} from "../api/dayyapi";
import { MovieCard } from "../components/MovieCard";
import { GridSkeleton } from "../components/Skeleton";
import { useGenres } from "../components/GenreProvider";
import { ChevronLeft, ChevronRight, Filter, Film, RefreshCw, AlertCircle } from "lucide-react";

export const Browse: React.FC = () => {
  const { category } = useParams<{ category: string }>();
  const [searchParams, setSearchParams] = useSearchParams();
  
  // States
  const [items, setItems] = useState<MovieItem[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedGenreId, setSelectedGenreId] = useState<number | null>(null);

  const { genresMap } = useGenres();

  // Map category to Indonesian titles & fetching methods
  const getCategoryMeta = () => {
    switch (category) {
      case "trending":
        return { title: "Trending Hari Ini", desc: "Film dan serial televisi paling hangat yang sedang naik daun." };
      case "popular":
        return { title: "Paling Populer", desc: "Konten yang paling sering dicari dan ditonton saat ini." };
      case "now-playing":
        return { title: "Sedang Diputar", desc: "Film-film terhangat yang saat ini sedang tayang di bioskop." };
      case "upcoming":
        return { title: "Akan Segera Tayang", desc: "Daftar rilis film paling ditunggu-tunggu dalam waktu dekat." };
      case "discover":
      default:
        return { title: "Eksplorasi Konten", desc: "Temukan film dan acara TV pilihan terbaik dari katalog TMDB." };
    }
  };

  const meta = getCategoryMeta();

  // Reset page when category changes
  useEffect(() => {
    setPage(1);
    setSelectedGenreId(null);
  }, [category]);

  // Fetch data
  useEffect(() => {
    let active = true;
    setIsLoading(true);
    setError(null);

    async function fetchData() {
      try {
        let res;
        switch (category) {
          case "trending":
            res = await getTrending(page);
            break;
          case "popular":
            res = await getPopular(page);
            break;
          case "now-playing":
            res = await getNowPlaying(page);
            break;
          case "upcoming":
            res = await getUpcoming(page);
            break;
          case "discover":
          default:
            // Support passing genreId to Discover endpoint
            const genreQuery = searchParams.get("genre");
            const genreIdParam = genreQuery ? parseInt(genreQuery) : undefined;
            res = await getDiscover(page, genreIdParam);
            break;
        }

        if (!active) return;

        if (res && res.results) {
          setItems(res.results);
          setPage(res.page);
          // Clamp total pages to maximum of 500 pages due to TMDB api limit constraints
          setTotalPages(Math.min(res.total_pages, 500));
        } else {
          throw new Error("Gagal memperoleh daftar konten.");
        }
      } catch (err: any) {
        console.error(err);
        if (active) {
          setError(err?.message || "Terjadi kesalahan saat menghubungi server.");
        }
      } finally {
        if (active) setIsLoading(false);
      }
    }

    fetchData();

    return () => {
      active = false;
    };
  }, [category, page, searchParams]);

  // Filter items client side if a genre chip is selected
  const filteredItems = selectedGenreId
    ? items.filter((item) => item.genre_ids?.includes(selectedGenreId))
    : items;

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setPage(newPage);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  // Switch genre chip
  const handleGenreSelect = (genreId: number | null) => {
    setSelectedGenreId(genreId);
    if (category === "discover") {
      if (genreId) {
        setSearchParams({ genre: genreId.toString() });
        setPage(1);
      } else {
        setSearchParams({});
        setPage(1);
      }
    }
  };

  return (
    <div className="px-5 md:px-10 py-6 space-y-8 pb-20" id="browse-page">
      {/* Category Header */}
      <div>
        <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-text-primary">
          {meta.title}
        </h1>
        <p className="text-sm text-text-secondary mt-1 max-w-2xl leading-relaxed">
          {meta.desc}
        </p>
      </div>

      {/* Genre Filter — plain-text pill tabs, active = solid white chip,
          matching the reference's top filter row style */}
      <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar -mx-1 px-1">
        <button
          onClick={() => handleGenreSelect(null)}
          className={`px-4 py-1.5 rounded-full text-[13px] font-semibold transition-all cursor-pointer flex-shrink-0 ${
            selectedGenreId === null
              ? "bg-white text-black"
              : "text-text-secondary hover:text-white"
          }`}
        >
          Semua
        </button>
        {Object.entries(genresMap).map(([idStr, name]) => {
          const id = parseInt(idStr);
          const isSelected = selectedGenreId === id;
          return (
            <button
              key={id}
              onClick={() => handleGenreSelect(id)}
              className={`px-4 py-1.5 rounded-full text-[13px] font-semibold transition-all cursor-pointer flex-shrink-0 ${
                isSelected
                  ? "bg-white text-black"
                  : "text-text-secondary hover:text-white"
              }`}
            >
              {name}
            </button>
          );
        })}
      </div>

      {/* Content Grid */}
      {isLoading ? (
        <GridSkeleton count={12} />
      ) : error ? (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <AlertCircle className="w-12 h-12 text-[#FF3B30] mb-3" />
          <p className="text-text-primary font-bold text-base">Gagal memuat konten</p>
          <p className="text-text-secondary text-xs max-w-md mt-1">{error}</p>
          <button
            onClick={() => setPage(page)}
            className="mt-4 px-5 py-2 rounded-full bg-primary text-white text-xs font-semibold flex items-center gap-1.5"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Coba Lagi</span>
          </button>
        </div>
      ) : filteredItems.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center bg-surface rounded-2xl border border-white/5 p-8">
          <Film className="w-12 h-12 text-text-secondary/20 mb-3" />
          <p className="text-text-primary font-bold text-base">Tidak Ada Konten</p>
          <p className="text-text-secondary text-xs max-w-sm mt-1">
            Tidak ditemukan konten dengan kriteria penyaringan genre tersebut di halaman ini ({page}). Silakan ganti genre atau pindah halaman.
          </p>
          {selectedGenreId && (
            <button
              onClick={() => handleGenreSelect(null)}
              className="mt-4 px-4 py-2 rounded-full bg-white/10 text-xs font-semibold hover:bg-white/15 cursor-pointer"
            >
              Hapus Penyaringan Genre
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-x-3 gap-y-6">
          {filteredItems.map((item) => (
            <div key={item.id} className="animate-fade-in">
              <MovieCard item={item} mediaType={category === "trending" ? undefined : (category === "discover" ? "movie" : undefined)} fullWidth />
            </div>
          ))}
        </div>
      )}

      {/* Pagination Controls */}
      {!isLoading && !error && totalPages > 1 && (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-8 border-t border-white/5">
          <span className="text-xs font-medium text-text-secondary">
            Halaman <span className="text-text-primary font-bold">{page}</span> dari <span className="text-text-primary font-bold">{totalPages}</span>
          </span>

          <div className="flex items-center gap-2">
            <button
              onClick={() => handlePageChange(page - 1)}
              disabled={page === 1}
              className={`p-2.5 rounded-full border border-white/5 flex items-center justify-center cursor-pointer select-none transition-all ${
                page === 1
                  ? "bg-white/2 text-white/20 cursor-not-allowed"
                  : "bg-surface text-text-primary hover:bg-white/5 active:scale-95"
              }`}
              title="Halaman Sebelumnya"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            {/* Quick numeric buttons for desktop context */}
            <div className="hidden sm:flex items-center gap-1.5">
              {Array.from({ length: Math.min(5, totalPages) }).map((_, index) => {
                // Determine layout window
                let pageNumber = page;
                if (page <= 3) {
                  pageNumber = index + 1;
                } else if (page >= totalPages - 2) {
                  pageNumber = totalPages - 4 + index;
                } else {
                  pageNumber = page - 2 + index;
                }

                if (pageNumber < 1 || pageNumber > totalPages) return null;

                const isCurrent = page === pageNumber;
                return (
                  <button
                    key={pageNumber}
                    onClick={() => handlePageChange(pageNumber)}
                    className={`w-9 h-9 rounded-full text-xs font-bold transition-all cursor-pointer ${
                      isCurrent
                        ? "bg-primary text-white shadow-md shadow-primary/20"
                        : "bg-surface text-text-secondary hover:bg-white/5"
                    }`}
                  >
                    {pageNumber}
                  </button>
                );
              })}
            </div>

            <button
              onClick={() => handlePageChange(page + 1)}
              disabled={page === totalPages}
              className={`p-2.5 rounded-full border border-white/5 flex items-center justify-center cursor-pointer select-none transition-all ${
                page === totalPages
                  ? "bg-white/2 text-white/20 cursor-not-allowed"
                  : "bg-surface text-text-primary hover:bg-white/5 active:scale-95"
              }`}
              title="Halaman Selanjutnya"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
