import React, { useState, useEffect } from "react";
import { getHomeData, getTrending, HomeResponse, MovieItem } from "../api/dayyapi";
import { BannerCarousel } from "../components/BannerCarousel";
import { MovieCard } from "../components/MovieCard";
import { CardSkeleton, BannerSkeleton } from "../components/Skeleton";
import { TopBar } from "../components/TopBar";
import { AlertCircle, RefreshCw, ChevronRight, HelpCircle, Clapperboard, Users, Flame } from "lucide-react";
import { Link } from "react-router-dom";

export const Home: React.FC = () => {
  const [homeData, setHomeData] = useState<HomeResponse | null>(null);
  const [trendingItems, setTrendingItems] = useState<MovieItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeSection, setActiveSection] = useState<string>("recommend");

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

  const scrollToSection = (key: string) => {
    setActiveSection(key);
    const el = document.getElementById(`section-${key}`);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
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

  const sectionEntries = homeData ? Object.entries(homeData.sections) : [];

  return (
    <div className="space-y-8" id="home-page">
      {/* Title + Search, matching reference top bar */}
      <TopBar title="Movie" />

      {/* Category pill tabs */}
      <div className="px-5 md:px-10 -mt-2">
        <div className="flex items-center gap-1 overflow-x-auto no-scrollbar pb-1">
          <button
            onClick={() => scrollToSection("recommend")}
            className={`flex-shrink-0 px-4 py-2 rounded-full text-[13px] font-bold tracking-wide transition-all cursor-pointer ${
              activeSection === "recommend"
                ? "bg-primary text-white"
                : "text-text-secondary hover:text-white"
            }`}
          >
            Recommend
          </button>
          {sectionEntries.map(([key, raw]) => {
            const section = raw as { label: string; results: MovieItem[] };
            if (!section.results || section.results.length === 0) return null;
            return (
              <button
                key={key}
                onClick={() => scrollToSection(key)}
                className={`flex-shrink-0 px-4 py-2 rounded-full text-[13px] font-bold tracking-wide transition-all cursor-pointer ${
                  activeSection === key
                    ? "bg-primary text-white"
                    : "text-text-secondary hover:text-white"
                }`}
              >
                {section.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Hero Promo Banner Carousel */}
      <div className="px-5 md:px-10" id="section-recommend">
        {isLoading ? <BannerSkeleton /> : <BannerCarousel items={trendingItems} />}
      </div>

      {/* Promo gradient quick-access buttons — scrollable so a 3rd option peeks, like the reference */}
      <div className="px-5 md:px-10 flex items-center gap-3 overflow-x-auto no-scrollbar">
        <Link
          to="/browse/now-playing"
          className="flex-shrink-0 flex items-center gap-2 px-5 py-3 rounded-2xl bg-gradient-to-r from-[#FF6B6B] to-[#FF3D9A] text-white font-bold text-xs active:scale-95 transition-transform"
        >
          <Clapperboard className="w-4 h-4" />
          <span># Special theater</span>
        </Link>
        <Link
          to="/browse/upcoming"
          className="flex-shrink-0 flex items-center gap-2 px-5 py-3 rounded-2xl bg-gradient-to-r from-[#2F80FF] to-[#3ec1ff] text-white font-bold text-xs active:scale-95 transition-transform"
        >
          <Users className="w-4 h-4" />
          <span># Group buy</span>
        </Link>
        <Link
          to="/browse/trending"
          className="flex-shrink-0 flex items-center gap-2 px-5 py-3 rounded-2xl bg-gradient-to-r from-[#FFB347] to-[#FF8A00] text-white font-bold text-xs active:scale-95 transition-transform"
        >
          <Flame className="w-4 h-4" />
          <span># Hot ranking</span>
        </Link>
      </div>

      {/* Sections Lists (Horizontal Carousels) */}
      <div className="space-y-10">
        {isLoading ? (
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
          sectionEntries.map(([key, rawSection]) => {
            const section = rawSection as { label: string; results: MovieItem[] };
            if (!section.results || section.results.length === 0) return null;

            let browsePath = `/browse/discover`;
            if (key === "action") browsePath = "/browse/discover?genre=28";
            else if (key === "animation") browsePath = "/browse/discover?genre=16";
            else if (key === "comedy") browsePath = "/browse/discover?genre=35";
            else if (key === "horror") browsePath = "/browse/discover?genre=27";
            else if (key === "drama") browsePath = "/browse/discover?genre=18";

            return (
              <section key={key} className="space-y-4 px-5 md:px-10 group/section" id={`section-${key}`}>
                <div className="flex items-center justify-between">
                  <h2 className="text-[18px] font-bold text-text-primary tracking-wide relative">
                    {section.label}
                  </h2>
                  <Link
                    to={browsePath}
                    className="flex items-center gap-0.5 text-xs text-primary font-bold hover:underline"
                  >
                    <span>More</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </Link>
                </div>

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
