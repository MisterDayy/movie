import React, { useState, useEffect } from "react";
import { getHomeData, getTrending, HomeResponse, MovieItem } from "../api/dayyapi";
import { BannerCarousel } from "../components/BannerCarousel";
import { MovieCard } from "../components/MovieCard";
import { LandscapeCard } from "../components/LandscapeCard";
import { CardSkeleton, BannerSkeleton } from "../components/Skeleton";
import { TopBar } from "../components/TopBar";
import { AlertCircle, RefreshCw, ChevronRight, HelpCircle } from "lucide-react";
import { Link } from "react-router-dom";

export const Home: React.FC = () => {
  const [homeData, setHomeData] = useState<HomeResponse | null>(null);
  const [trendingItems, setTrendingItems] = useState<MovieItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeFilter, setActiveFilter] = useState<string>("all");

  async function loadData() {
    setIsLoading(true);
    setError(null);
    try {
      let homeRes;
      try {
        homeRes = await getHomeData();
        setHomeData(homeRes);
      } catch (err) {
        throw new Error("Gagal mengambil data Home dari DayyAPI.");
      }

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

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] px-5 py-10 text-center" id="home-error">
        <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center text-primary mb-4">
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

  const sectionEntries = homeData ? Object.entries(homeData.sections) : [];
  const filterLabels: { key: string; label: string }[] = [
    { key: "all", label: "All" },
    { key: "tv", label: "TV Series" },
    ...sectionEntries
      .filter(([, raw]) => (raw as any).results?.length > 0)
      .slice(0, 4)
      .map(([key, raw]) => ({ key, label: (raw as any).label as string })),
  ];

  const scrollToSection = (key: string) => {
    setActiveFilter(key);
    const el = document.getElementById(`section-${key}`);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <div className="space-y-7" id="home-page">
      <TopBar title="Watchly" brand />

      {/* Pill filter row: active = solid white chip, inactive = plain text —
          matches the reference's "All / TV Series / Action / Asian / Drama" tabs */}
      <div className="px-4 md:px-10 -mt-1">
        <div className="flex items-center gap-2.5 overflow-x-auto no-scrollbar pb-1">
          {filterLabels.map((f) => (
            <button
              key={f.key}
              onClick={() => scrollToSection(f.key)}
              className={`flex-shrink-0 px-4 py-1.5 rounded-full text-[13px] font-semibold tracking-wide transition-all cursor-pointer ${
                activeFilter === f.key
                  ? "bg-white text-black"
                  : "text-text-secondary hover:text-white"
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* Hero Promo Banner Carousel */}
      <div className="px-4 md:px-10" id="section-all">
        {isLoading ? <BannerSkeleton /> : <BannerCarousel items={trendingItems} />}
      </div>

      {/* Sections Lists (Horizontal Carousels) */}
      <div className="space-y-9">
        {isLoading ? (
          [1, 2, 3].map((idx) => (
            <div key={idx} className="space-y-3.5 px-4 md:px-10">
              <div className="h-6 w-36 rounded bg-surface animate-shimmer" />
              <div className="flex gap-3 overflow-hidden pb-2">
                {Array.from({ length: 7 }).map((_, i) => (
                  <CardSkeleton key={i} />
                ))}
              </div>
            </div>
          ))
        ) : homeData && homeData.sections ? (
          sectionEntries.map(([key, rawSection], sIdx) => {
            const section = rawSection as { label: string; results: MovieItem[] };
            if (!section.results || section.results.length === 0) return null;

            let browsePath = `/browse/discover`;
            if (key === "action") browsePath = "/browse/discover?genre=28";
            else if (key === "animation") browsePath = "/browse/discover?genre=16";
            else if (key === "comedy") browsePath = "/browse/discover?genre=35";
            else if (key === "horror") browsePath = "/browse/discover?genre=27";
            else if (key === "drama") browsePath = "/browse/discover?genre=18";

            // The first row after the hero renders as a "Featured" landscape
            // rail with tag chips, echoing the reference home screen.
            const isFeaturedRow = sIdx === 0;

            return (
              <section key={key} className="space-y-3.5 px-4 md:px-10 group/section" id={`section-${key}`}>
                <div className="flex items-center justify-between">
                  <h2 className="text-[17px] font-bold text-text-primary tracking-wide">
                    {isFeaturedRow ? "Featured" : section.label}
                  </h2>
                  <Link
                    to={browsePath}
                    className="flex items-center gap-0.5 text-xs text-primary font-bold hover:underline"
                  >
                    <span>Lihat Semua</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </Link>
                </div>

                <div className="flex gap-3 overflow-x-auto pb-4 pt-1 no-scrollbar -mx-4 px-4 md:-mx-10 md:px-10 snap-x snap-mandatory scroll-smooth">
                  {isFeaturedRow
                    ? section.results.slice(0, 8).map((movie, i) => (
                        <div key={movie.id} className="snap-start">
                          <LandscapeCard item={movie} badge={i === 0 ? "New Episodes" : undefined} />
                        </div>
                      ))
                    : section.results.map((movie) => (
                        <div key={movie.id} className="snap-start">
                          <MovieCard item={movie} />
                        </div>
                      ))}
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
