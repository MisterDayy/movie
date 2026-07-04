import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { motion } from "motion/react";
import {
  getDetail,
  DetailResponse,
  getBackdropUrl,
  getPosterUrl
} from "../api/dayyapi";
import { CastList } from "../components/CastList";
import { Skeleton } from "../components/Skeleton";
import {
  ArrowLeft,
  Share2,
  Play,
  Star,
  Clock,
  Calendar,
  DollarSign,
  Tv,
  Film,
  Download,
  Check,
  AlertCircle
} from "lucide-react";

export const Detail: React.FC = () => {
  const { type, id } = useParams<{ type: "movie" | "tv"; id: string }>();
  const navigate = useNavigate();

  const [detail, setDetail] = useState<DetailResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isCopied, setIsCopied] = useState(false);

  useEffect(() => {
    let active = true;
    setIsLoading(true);
    setError(null);

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

    fetchDetail();

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
      <div className="space-y-6 pb-20 px-5 md:px-10 py-6">
        <div className="w-full h-[45vh] rounded-2xl bg-surface animate-shimmer" />
        <div className="flex flex-col md:flex-row gap-8">
          <div className="w-44 h-64 rounded-card bg-surface animate-shimmer flex-shrink-0" />
          <div className="flex-1 space-y-4">
            <Skeleton className="h-8 w-1/3" />
            <Skeleton className="h-4 w-1/4" />
            <Skeleton className="h-4 w-5/6" />
            <Skeleton className="h-20 w-full" />
          </div>
        </div>
      </div>
    );
  }

  if (error || !detail) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] text-center px-5">
        <AlertCircle className="w-12 h-12 text-[#FF3B30] mb-3" />
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
  const originalTitle = isMovie ? detail.title : detail.name;
  const backdropUrl = detail.backdrop_path ? getBackdropUrl(detail.backdrop_path) : "";
  const posterUrl = detail.poster_path ? getPosterUrl(detail.poster_path) : "";

  // Date parsing
  const rawDate = isMovie ? detail.release_date : detail.first_air_date;
  const formattedDate = rawDate
    ? new Date(rawDate).toLocaleDateString("id-ID", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : "Tanggal rilis tidak diketahui";

  // Runtime calculation
  const runtimeText = isMovie
    ? detail.runtime
      ? `${detail.runtime} menit`
      : "-"
    : detail.episode_run_time && detail.episode_run_time.length > 0
    ? `${detail.episode_run_time[0]} menit per episode`
    : "-";

  // Financial info formats
  const budgetText = detail.budget && detail.budget > 0 ? `$${detail.budget.toLocaleString()}` : "-";
  const revenueText = detail.revenue && detail.revenue > 0 ? `$${detail.revenue.toLocaleString()}` : "-";

  return (
    <motion.div
      initial={{ y: "100%", opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{
        y: { type: "tween", duration: 0.4, ease: [0.34, 1.56, 0.64, 1] }, // spring slide-up effect
        opacity: { duration: 0.3 }
      }}
      className="pb-20"
      id={`detail-${type}-${id}`}
    >
      {/* 1. Backdrop Hero (Covers 45% screen height) */}
      <div className="relative w-full h-[45vh] bg-black">
        {backdropUrl ? (
          <img
            src={backdropUrl}
            alt={title}
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover opacity-60"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-surface to-[#0B0F19]" />
        )}

        {/* Backdrop bottom gradient overlay blending into body background */}
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent" />

        {/* Floating buttons: back & share */}
        <div className="absolute top-5 left-5 md:left-10 z-20">
          <button
            onClick={() => navigate(-1)}
            className="p-3 rounded-full bg-black/50 hover:bg-black/70 text-white backdrop-blur-md border border-white/10 hover:scale-105 transition-all cursor-pointer flex items-center justify-center"
            title="Kembali"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
        </div>

        <div className="absolute top-5 right-5 md:right-10 z-20">
          <button
            onClick={handleShare}
            className="p-3 rounded-full bg-black/50 hover:bg-black/70 text-white backdrop-blur-md border border-white/10 hover:scale-105 transition-all cursor-pointer flex items-center justify-center relative"
            title="Bagikan Tautan"
          >
            {isCopied ? <Check className="w-5 h-5 text-green-400 animate-pulse" /> : <Share2 className="w-5 h-5" />}
            {isCopied && (
              <span className="absolute right-full mr-2 bg-emerald-500 text-white text-[10px] font-bold px-2 py-1 rounded-md whitespace-nowrap">
                Tautan disalin!
              </span>
            )}
          </button>
        </div>

        {/* Centered Giant Play Button */}
        <div className="absolute inset-0 flex flex-col items-center justify-center z-10 gap-2 pt-10">
          <Link
            to={`/watch/${type}/${id}`}
            className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-primary/20 hover:bg-primary/30 border-2 border-primary text-white flex items-center justify-center backdrop-blur-md shadow-2xl transition-all transform hover:scale-110 active:scale-90 group/btn"
          >
            <Play className="w-7 h-7 md:w-9 md:h-9 fill-white text-white ml-1.5 transition-transform group-hover/btn:scale-110" />
          </Link>
          <span className="text-xs md:text-sm font-bold tracking-widest text-white uppercase text-center mt-1 drop-shadow-lg">
            Putar Cuplikan & Streaming
          </span>
        </div>
      </div>

      {/* Main Details Panel Layout */}
      <div className="px-5 md:px-10 -mt-16 relative z-30 max-w-7xl mx-auto space-y-10">
        <div className="flex flex-col md:flex-row gap-8 items-start">
          {/* Poster Card Left */}
          <div className="w-40 sm:w-44 md:w-56 aspect-[2/3] rounded-card overflow-hidden bg-surface border border-white/10 shadow-2xl flex-shrink-0 self-center md:self-auto">
            {posterUrl ? (
              <img
                src={posterUrl}
                alt={title}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-[#121824] to-[#1e2638] flex items-center justify-center p-4">
                <Film className="w-12 h-12 text-white/20" />
              </div>
            )}
          </div>

          {/* Info Details Right */}
          <div className="flex-1 space-y-5 text-left w-full">
            <div>
              {detail.tagline && (
                <span className="text-xs font-bold tracking-wider text-primary uppercase bg-primary/10 border border-primary/20 px-3 py-1 rounded-full mb-2.5 inline-block">
                  {detail.tagline}
                </span>
              )}

              <h1 className="text-2.5xl md:text-4xl font-extrabold text-text-primary tracking-tight leading-none">
                {title}
              </h1>

              {title !== originalTitle && (
                <p className="text-sm text-text-secondary mt-1 italic font-medium">
                  Judul asli: {originalTitle}
                </p>
              )}
            </div>

            {/* Quick Badges Row */}
            <div className="flex flex-wrap items-center gap-2.5 text-xs text-text-secondary">
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-surface border border-white/5 font-semibold text-amber-400">
                <Star className="w-3.5 h-3.5 fill-amber-400" />
                <span>{detail.vote_average ? detail.vote_average.toFixed(1) : "0.0"} ({detail.vote_count.toLocaleString()})</span>
              </div>

              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-surface border border-white/5">
                <Clock className="w-3.5 h-3.5 text-primary" />
                <span>{runtimeText}</span>
              </div>

              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-surface border border-white/5 uppercase font-bold text-[10px] tracking-wider bg-white/5">
                {isMovie ? "Movie" : "Series / TV"}
              </div>

              <div className="px-3 py-1.5 rounded-full bg-surface border border-white/5 font-bold text-emerald-400 uppercase text-[10px] tracking-wider">
                {detail.status || "Released"}
              </div>
            </div>

            {/* Actions Bar */}
            <div className="flex items-center gap-3 pt-2" id="detail-action-bar">
              {/* Download Icon Button (Outline) */}
              <button
                onClick={() => {
                  alert("Fitur download film premium hanya tersedia untuk anggota terdaftar.");
                }}
                className="p-3.5 rounded-full border border-white/10 hover:border-primary/50 text-text-secondary hover:text-white hover:bg-white/5 transition-all cursor-pointer flex items-center justify-center shrink-0 active:scale-90"
                title="Unduh Offline"
              >
                <Download className="w-5 h-5" />
              </button>

              {/* Play Now Pill Button */}
              <Link
                to={`/watch/${type}/${id}`}
                className="flex-1 max-w-sm py-3.5 rounded-full bg-primary hover:bg-primary/95 text-white font-extrabold text-sm tracking-wide text-center transition-all shadow-lg shadow-primary/20 active:scale-98 flex items-center justify-center gap-2"
              >
                <Play className="w-4.5 h-4.5 fill-white" />
                <span>Mulai Menonton Sekarang</span>
              </Link>
            </div>

            {/* Indonesian Genres list */}
            <div className="space-y-2">
              <p className="text-xs font-bold text-text-secondary uppercase tracking-widest">Genre</p>
              <div className="flex flex-wrap gap-2">
                {detail.genres && detail.genres.length > 0 ? (
                  detail.genres.map((genre) => (
                    <Link
                      key={genre.id}
                      to={`/browse/discover?genre=${genre.id}`}
                      className="px-3 py-1.5 rounded-full bg-[#248CFF]/10 text-primary hover:bg-primary/20 transition-colors border border-primary/15 text-xs font-semibold cursor-pointer"
                    >
                      {genre.name}
                    </Link>
                  ))
                ) : (
                  <span className="text-xs text-text-secondary">Tidak ada tag genre</span>
                )}
              </div>
            </div>

            {/* Synopsis overview */}
            <div className="space-y-2">
              <h3 className="text-xs font-bold text-text-secondary uppercase tracking-widest">Sinopsis</h3>
              <p className="text-[14px] text-text-secondary leading-relaxed font-normal">
                {detail.overview && detail.overview.trim() !== ""
                  ? detail.overview
                  : "Belum ada sinopsis bahasa Indonesia yang tersedia untuk rincian film/serial ini."}
              </p>
            </div>
          </div>
        </div>

        {/* Cast list section */}
        <div className="space-y-4 pt-4 border-t border-white/5" id="cast-section">
          <h3 className="text-lg font-bold text-text-primary tracking-wide">
            Aktor & Pemeran Utama
          </h3>
          {detail.credits && detail.credits.cast ? (
            <CastList cast={detail.credits.cast} />
          ) : (
            <p className="text-xs text-text-secondary">Informasi daftar pemain belum dimuat.</p>
          )}
        </div>

        {/* Detailed Financial & Production Metadata Grid */}
        <div className="space-y-4 pt-4 border-t border-white/5" id="production-meta-section">
          <h3 className="text-lg font-bold text-text-primary tracking-wide">
            Rincian Produksi & Info Finansial
          </h3>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 bg-surface rounded-2xl border border-white/5 p-5">
            <div className="space-y-1 text-left">
              <div className="flex items-center gap-1.5 text-xs text-text-secondary">
                <Calendar className="w-3.5 h-3.5 text-primary" />
                <span className="font-bold uppercase tracking-wider text-[10px]">Tanggal Rilis</span>
              </div>
              <p className="text-sm font-semibold text-text-primary">{formattedDate}</p>
            </div>

            <div className="space-y-1 text-left">
              <div className="flex items-center gap-1.5 text-xs text-text-secondary">
                <DollarSign className="w-3.5 h-3.5 text-emerald-400" />
                <span className="font-bold uppercase tracking-wider text-[10px]">Anggaran (Budget)</span>
              </div>
              <p className="text-sm font-semibold text-text-primary">{budgetText}</p>
            </div>

            <div className="space-y-1 text-left">
              <div className="flex items-center gap-1.5 text-xs text-text-secondary">
                <DollarSign className="w-3.5 h-3.5 text-emerald-400" />
                <span className="font-bold uppercase tracking-wider text-[10px]">Pendapatan (Revenue)</span>
              </div>
              <p className="text-sm font-semibold text-text-primary">{revenueText}</p>
            </div>

            <div className="space-y-1 text-left">
              <div className="flex items-center gap-1.5 text-xs text-text-secondary">
                {isMovie ? <Film className="w-3.5 h-3.5 text-primary" /> : <Tv className="w-3.5 h-3.5 text-green-400" />}
                <span className="font-bold uppercase tracking-wider text-[10px]">Format Konten</span>
              </div>
              <p className="text-sm font-semibold text-text-primary uppercase">{isMovie ? "Layar Lebar (Film)" : "Serial Televisi"}</p>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};
