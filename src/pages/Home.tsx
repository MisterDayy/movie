import React, { useState, useEffect } from "react";
import { getHomeData, getTrending, HomeResponse, MovieItem } from "../api/dayyapi";
import { BannerCarousel } from "../components/BannerCarousel";
import { MovieCard } from "../components/MovieCard";
import { CardSkeleton, BannerSkeleton } from "../components/Skeleton";
import { AlertCircle, RefreshCw, Sparkles, ChevronRight, HelpCircle } from "lucide-react";
import { Link } from "react-router-dom";

export const Home: React.FC = () => {
  const [homeData, setHomeData] = useState<HomeResponse | null>(null);
  const [trendingItems, setTrendingItems] = useState<MovieItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  async function loadData() {
    setIsLoading(true);
    setError(null);
    try {
      // Fetch home data first
      let homeRes;
      try {
        homeRes = await getHomeData();
        setHomeData(homeRes);
      } catch (err) {
        throw new Error("Gagal mengambil data Home dari DayyAPI.");
      }

      // Fetch trending data, handle fail gracefully
      try {
        const trendingRes = await getTrending(1);
        if (trendingRes && trendingRes.results) {
          setTrendingItems(trendingRes.results);
        } else {
          throw new Error("No results");
        }
      } catch (trendingErr) {
        console.warn("Gagal mengambil trending, menggunakan fallback dari beranda:", trendingErr);
        const sections = homeRes.sections;
        const firstSectionKey = Object.keys(sections)[0];
        if (firstSectionKey && sections[firstSectionKey]?.results) {
          setTrendingItems(sections[firstSectionKey].results);
        }
      }
    } catch (err: any) {
      console.error(err);
      setError(err?.message || "Terjadi kesalahan saat memuat data dari server.");
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    loadData();
  }, []);

  // Get current hour to determine greeting
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 11) return "Selamat pagi,";
    if (hour < 15) return "Selamat siang,";
    if (hour < 19) return "Selamat sore,";
    return "Selamat malam,";
  };

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] px-5 py-10 text-center" id="home-error">
        <div className="w-16 h-16 rounded-full bg-red-500/10 flex items-center justify-center text-[#FF3B30] mb-4">
          <AlertCircle className="w-8 h-8" />
        </div>
        <h2 className="text-lg font-bold text-text-primary">Gagal Memuat Beranda</h2>
        <p className="text-sm text-text-secondary mt-2 max-w-md">
          {error} Silakan periksa koneksi internet Anda atau coba muat kembali halaman ini.
        </p>
        <button
          onClick={loadData}
          className="mt-6 flex items-center gap-2 px-6 py-2.5 rounded-full bg-primary hover:bg-primary/90 text-white font-semibold text-xs transition-all cursor-pointer shadow-lg shadow-primary/20"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Muat Ulang Halaman</span>
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-16" id="home-page">
      {/* Dynamic Personal Greeting Panel */}
      <div className="px-5 md:px-10 pt-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-[13px] font-normal text-text-secondary">
            {getGreeting()}
          </span>
          <h1 className="text-[22px] font-bold tracking-tight text-text-primary mt-0.5 flex items-center gap-1.5">
            Sobat Nonton <span className="animate-bounce">👋</span>
          </h1>
        </div>
        <div className="flex items-center gap-2 bg-surface border border-white/5 rounded-2xl px-4 py-2 text-xs text-text-secondary self-start sm:self-auto shadow-md">
          <Sparkles className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
          <span>Banyak film & serial terbaru hari ini!</span>
        </div>
      </div>

      {/* Hero Promo Banner Carousel */}
      <div className="px-5 md:px-10">
        {isLoading ? (
          <BannerSkeleton />
        ) : (
          <BannerCarousel items={trendingItems} />
        )}
      </div>

      {/* Sections Lists (Horizontal Carousels) */}
      <div className="space-y-10">
        {isLoading ? (
          // Render generic layout Skeletons
          [1, 2, 3].map((idx) => (
            <div key={idx} className="space-y-4 px-5 md:px-10">
              <div className="flex items-center justify-between">
                <div className="h-6 w-36 rounded bg-surface animate-shimmer" />
                <div className="h-4 w-16 rounded bg-surface animate-shimmer" />
              </div>
              <div className="flex gap-3 overflow-hidden pb-2">
                {Array.from({ length: 7 }).map((_, i) => (
                  <CardSkeleton key={i} />
                ))}
              </div>
            </div>
          ))
        ) : homeData && homeData.sections ? (
          Object.entries(homeData.sections).map(([key, rawSection]) => {
            const section = rawSection as { label: string; results: MovieItem[] };
            if (!section.results || section.results.length === 0) return null;

            // Simple map key to browse route paths for 'See All' links if applicable
            let browsePath = `/browse/discover`;
            if (key === "action") browsePath = "/browse/discover?genre=28";
            else if (key === "animation") browsePath = "/browse/discover?genre=16";
            else if (key === "comedy") browsePath = "/browse/discover?genre=35";
            else if (key === "horror") browsePath = "/browse/discover?genre=27";
            else if (key === "drama") browsePath = "/browse/discover?genre=18";

            return (
              <section
                key={key}
                className="space-y-4 px-5 md:px-10 group/section"
                id={`section-${key}`}
              >
                {/* Section Header */}
                <div className="flex items-center justify-between">
                  <h2 className="text-[18px] font-semibold text-text-primary tracking-wide relative">
                    {section.label}
                    <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary group-hover/section:w-8 transition-all duration-300" />
                  </h2>

                  <Link
                    to={browsePath}
                    className="flex items-center gap-0.5 text-xs text-primary font-bold hover:underline"
                  >
                    <span>Lihat Semua</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </Link>
                </div>

                {/* Horizontal Scroller Container */}
                <div className="relative">
                  <div className="flex gap-3 overflow-x-auto pb-4 pt-1 no-scrollbar -mx-5 px-5 md:-mx-10 md:px-10 snap-x snap-mandatory scroll-smooth">
                    {section.results.map((movie) => (
                      <div key={movie.id} className="snap-start">
                        <MovieCard item={movie} />
                      </div>
                    ))}
                  </div>
                </div>
              </section>
            );
          })
        ) : (
          <div className="text-center py-10 text-text-secondary">
            <HelpCircle className="w-10 h-10 mx-auto opacity-30 mb-2" />
            <span>Tidak ada data kategori yang ditemukan.</span>
          </div>
        )}
      </div>
    </div>
  );
};
