import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { motion } from "motion/react";
import {
  getDetail,
  getTrending,
  DetailResponse,
  MovieItem,
  getBackdropUrl,
} from "../api/dayyapi";
import { CastList } from "../components/CastList";
import { MovieCard } from "../components/MovieCard";
import { Skeleton } from "../components/Skeleton";
import {
  ArrowLeft,
  Share2,
  Play,
  Download,
  Check,
  AlertCircle,
  ChevronRight,
} from "lucide-react";

export const Detail: React.FC = () => {
  const { type, id } = useParams<{ type: "movie" | "tv"; id: string }>();
  const navigate = useNavigate();

  const [detail, setDetail] = useState<DetailResponse | null>(null);
  const [popular, setPopular] = useState<MovieItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isCopied, setIsCopied] = useState(false);
  const [expanded, setExpanded] = useState(false);

  useEffect(() => {
    let active = true;
    setIsLoading(true);
    setError(null);
    setExpanded(false);

    async function fetchDetail() {
      if (!type || !id) return;
      try {
        const data = await getDetail(type, id);
        if (active) setDetail(data);
      } catch (err: any) {
        console.error("Detail error:", err);
        if (active) setError("Gagal memuat detail konten dari server.");
      } finally {
        if (active) setIsLoading(false);
      }
    }

    async function fetchPopular() {
      try {
        const res = await getTrending(1);
        if (active) setPopular(res.results || []);
      } catch (err) {
        console.warn("Gagal memuat rekomendasi populer", err);
      }
    }

    fetchDetail();
    fetchPopular();

    return () => {
      active = false;
    };
  }, [type, id]);

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  if (isLoading) {
    return (
      <div className="space-y-6 pb-20">
        <div className="w-full h-[52vh] bg-surface animate-shimmer" />
        <div className="px-5 space-y-4">
          <Skeleton className="h-8 w-2/3" />
          <Skeleton className="h-4 w-1/3" />
          <Skeleton className="h-20 w-full" />
        </div>
      </div>
    );
  }

  if (error || !detail) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] text-center px-5">
        <AlertCircle className="w-12 h-12 text-primary mb-3" />
        <p className="text-text-primary font-bold text-lg">Konten Tidak Ditemukan</p>
        <p className="text-text-secondary text-sm max-w-md mt-1">
          {error || "Maaf, rincian film atau serial ini tidak dapat ditemukan."}
        </p>
        <Link
          to="/"
          className="mt-6 px-6 py-2.5 bg-primary text-white rounded-full text-xs font-semibold cursor-pointer"
        >
          Kembali ke Beranda
        </Link>
      </div>
    );
  }

  const isMovie = type === "movie";
  const title = isMovie ? detail.title : detail.name;
  const backdropUrl = detail.backdrop_path ? getBackdropUrl(detail.backdrop_path) : "";

  const rawDate = isMovie ? detail.release_date : detail.first_air_date;
  const year = rawDate ? rawDate.substring(0, 4) : "-";

  const runtimeText = isMovie
    ? detail.runtime
      ? `${Math.floor(detail.runtime / 60)}h ${detail.runtime % 60}m`
      : "-"
    : detail.episode_run_time && detail.episode_run_time.length > 0
    ? `${detail.episode_run_time[0]}m / ep`
    : "-";

  const director = detail.credits?.crew?.find((c) => c.job === "Director")?.name;
  const castNames = detail.credits?.cast?.slice(0, 4).map((c) => c.name).join(", ");
  const productionNames = detail.production_companies?.slice(0, 2).map((p) => p.name).join(", ");

  const overview =
    detail.overview && detail.overview.trim() !== ""
      ? detail.overview
      : "Belum ada sinopsis bahasa Indonesia yang tersedia untuk rincian film/serial ini.";
  const isLongOverview = overview.length > 160;

  return (
    <motion.div
      initial={{ y: "6%", opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{
        y: { type: "tween", duration: 0.35, ease: [0.34, 1.56, 0.64, 1] },
        opacity: { duration: 0.3 },
      }}
      className="pb-20"
      id={`detail-${type}-${id}`}
    >
      {/* Full-bleed hero backdrop with title + badges, matching the reference
          detail screen layout (Oppenheimer / Stranger Things screens) */}
      <div className="relative w-full h-[52vh] bg-black">
        {backdropUrl ? (
          <img
            src={backdropUrl}
            alt={title}
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-surface to-[#0A0A0A]" />
        )}

        <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0A] via-[#0A0A0A]/30 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-transparent" />

        <div className="absolute top-5 left-4 md:left-10 z-20 flex items-center justify-between right-4 md:right-10">
          <button
            onClick={() => navigate(-1)}
            className="p-2.5 rounded-full bg-black/50 hover:bg-black/70 text-white backdrop-blur-md border border-white/10 transition-all cursor-pointer flex items-center justify-center"
            title="Kembali"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <button
            onClick={handleShare}
            className="p-2.5 rounded-full bg-black/50 hover:bg-black/70 text-white backdrop-blur-md border border-white/10 transition-all cursor-pointer flex items-center justify-center relative"
            title="Bagikan Tautan"
          >
            {isCopied ? <Check className="w-5 h-5 text-emerald-400" /> : <Share2 className="w-5 h-5" />}
          </button>
        </div>

        {/* Title block bottom-left, uppercase red wordmark like the reference */}
        <div className="absolute bottom-0 left-0 right-0 px-5 md:px-10 pb-5">
          <h1 className="text-3xl md:text-5xl font-black tracking-tight text-primary uppercase leading-[0.95] drop-shadow-[0_2px_14px_rgba(0,0,0,0.85)]">
            {title}
          </h1>

          <div className="flex items-center gap-2 mt-3 text-[11px] font-semibold text-white/90">
            <span className="px-2 py-0.5 rounded bg-white/10 border border-white/15">17+</span>
            <span>{year}</span>
            {runtimeText !== "-" && (
              <>
                <span className="text-white/30">•</span>
                <span>{runtimeText}</span>
              </>
            )}
          </div>

          {detail.tagline && (
            <p className="text-[13px] text-white/70 mt-3 max-w-md leading-snug">
              {detail.tagline}
            </p>
          )}
        </div>
      </div>

      <div className="px-5 md:px-10 pt-5 max-w-4xl mx-auto space-y-7">
        {/* Synopsis with Read More, matching the reference's collapsible
            description under the hero title */}
        <div>
          <p className={`text-[13px] text-white/70 leading-relaxed ${!expanded && isLongOverview ? "line-clamp-3" : ""}`}>
            {overview}
          </p>
          {isLongOverview && (
            <button
              onClick={() => setExpanded((v) => !v)}
              className="text-[13px] font-bold text-white mt-1 cursor-pointer"
            >
              {expanded ? "Show Less" : "Read More"}
            </button>
          )}
        </div>

        {/* Action buttons: solid Watch pill + outlined Download, exactly the
            pairing shown in the reference detail screen */}
        <div className="flex flex-col sm:flex-row gap-3" id="detail-action-bar">
          <Link
            to={`/watch/${type}/${id}`}
            className="flex-1 py-3.5 rounded-md bg-white hover:bg-white/90 text-black font-bold text-sm text-center transition-all active:scale-98 flex items-center justify-center gap-2"
          >
            <Play className="w-4 h-4 fill-black" />
            <span>Watch {isMovie ? "Now" : "S1 E1"}</span>
          </Link>

          <button
            onClick={() => {
              alert("Fitur download film premium hanya tersedia untuk anggota terdaftar.");
            }}
            className="flex-1 py-3.5 rounded-md border border-white/25 hover:border-white/50 text-white font-bold text-sm transition-all cursor-pointer flex items-center justify-center gap-2 active:scale-98"
          >
            <Download className="w-4 h-4" />
            <span>Download</span>
          </button>
        </div>

        {/* Popular Movies row */}
        {popular.length > 0 && (
          <section className="space-y-3.5 pt-2" id="detail-popular-section">
            <div className="flex items-center justify-between">
              <h3 className="text-[17px] font-bold text-text-primary tracking-wide">Popular Movies</h3>
              <Link to="/browse/trending" className="flex items-center gap-0.5 text-xs text-primary font-bold">
                <span>Lihat Semua</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>
            <div className="flex gap-3 overflow-x-auto pb-2 no-scrollbar">
              {popular.slice(0, 10).map((m) => (
                <MovieCard key={m.id} item={m} />
              ))}
            </div>
          </section>
        )}

        {/* Structured info table: Genres, Director, Cast, Production House —
            mirrors the reference's metadata list styling exactly */}
        <section className="divide-y divide-white/10 border-t border-white/10" id="detail-info-table">
          <div className="grid grid-cols-3 gap-4 py-4">
            <span className="text-[13px] text-text-secondary col-span-1">Genres</span>
            <span className="text-[13px] text-white text-right col-span-2 leading-relaxed">
              {detail.genres && detail.genres.length > 0
                ? detail.genres.map((g) => g.name).join(", ")
                : "-"}
            </span>
          </div>

          {director && (
            <div className="grid grid-cols-3 gap-4 py-4">
              <span className="text-[13px] text-text-secondary col-span-1">Director</span>
              <span className="text-[13px] text-white text-right col-span-2">{director}</span>
            </div>
          )}

          {castNames && (
            <div className="grid grid-cols-3 gap-4 py-4">
              <span className="text-[13px] text-text-secondary col-span-1">Cast</span>
              <span className="text-[13px] text-white text-right col-span-2 leading-relaxed">{castNames}</span>
            </div>
          )}

          {productionNames && (
            <div className="grid grid-cols-3 gap-4 py-4">
              <span className="text-[13px] text-text-secondary col-span-1">Production House</span>
              <span className="text-[13px] text-white text-right col-span-2 leading-relaxed">{productionNames}</span>
            </div>
          )}
        </section>

        {/* Cast avatars section */}
        <div className="space-y-4 pt-2" id="cast-section">
          <h3 className="text-[17px] font-bold text-text-primary tracking-wide">
            Aktor & Pemeran Utama
          </h3>
          {detail.credits && detail.credits.cast ? (
            <CastList cast={detail.credits.cast} />
          ) : (
            <p className="text-xs text-text-secondary">Informasi daftar pemain belum dimuat.</p>
          )}
        </div>
      </div>
    </motion.div>
  );
};
