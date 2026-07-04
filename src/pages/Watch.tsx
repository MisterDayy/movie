import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { getDetail, DetailResponse } from "../api/dayyapi";
import { ServerSelector } from "../components/ServerSelector";
import { ArrowLeft, Film, Tv, Star, AlertCircle, Bookmark } from "lucide-react";
import { Skeleton } from "../components/Skeleton";

export const Watch: React.FC = () => {
  const { type, id } = useParams<{ type: "movie" | "tv"; id: string }>();
  const navigate = useNavigate();

  const [detail, setDetail] = useState<DetailResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let active = true;

    async function loadTitle() {
      if (!type || !id) return;
      try {
        const data = await getDetail(type, id);
        if (active) setDetail(data);
      } catch (e) {
        console.warn("Watch page failed to load detail title", e);
      } finally {
        if (active) setIsLoading(false);
      }
    }

    loadTitle();

    return () => {
      active = false;
    };
  }, [type, id]);

  const isMovie = type === "movie";
  const title = detail ? (isMovie ? detail.title : detail.name) : "Memuat Pemutar...";
  const year = detail ? (isMovie ? detail.release_date : detail.first_air_date)?.substring(0, 4) : "";

  return (
    <div className="px-5 md:px-10 py-6 max-w-7xl mx-auto space-y-6 pb-20 text-left" id={`watch-container-${type}-${id}`}>
      {/* Immersive Header Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/5 pb-4">
        <div className="flex items-center gap-3.5">
          {/* Back to detail button */}
          <button
            onClick={() => navigate(`/${type}/${id}`)}
            className="p-2.5 rounded-full bg-surface border border-white/5 hover:bg-white/5 hover:text-white text-text-secondary transition-all cursor-pointer flex items-center justify-center active:scale-90"
            title="Kembali ke Detail"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>

          <div>
            <div className="flex items-center gap-1.5">
              {isMovie ? (
                <Film className="w-4 h-4 text-primary" />
              ) : (
                <Tv className="w-4 h-4 text-emerald-400" />
              )}
              <span className="text-[11px] font-bold text-text-secondary uppercase tracking-widest leading-none">
                Sedang Nonton {isMovie ? "Film" : "Seri TV"}
              </span>
            </div>
            
            {isLoading ? (
              <Skeleton className="h-6 w-48 mt-1" />
            ) : (
              <h1 className="text-xl md:text-2xl font-extrabold text-text-primary tracking-tight leading-tight mt-1">
                {title} {year && <span className="text-text-secondary font-medium text-lg">({year})</span>}
              </h1>
            )}
          </div>
        </div>

        {/* Floating actions right */}
        {!isLoading && detail && (
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1 text-xs text-amber-400 font-bold bg-surface border border-white/5 px-3.5 py-2 rounded-2xl shadow-sm">
              <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
              <span>{detail.vote_average ? detail.vote_average.toFixed(1) : "0.0"}</span>
            </div>
            <button
              onClick={() => alert("Film ditambahkan ke daftar tontonan (bookmark).")}
              className="p-2.5 rounded-2xl bg-surface border border-white/5 text-text-secondary hover:text-white cursor-pointer hover:bg-white/5"
              title="Tambahkan ke Daftar Tontonan"
            >
              <Bookmark className="w-4.5 h-4.5" />
            </button>
          </div>
        )}
      </div>

      {/* Streaming Video Container + Mirror list */}
      {type && id && (
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="lg:col-span-3">
            <ServerSelector type={type} id={id} />
          </div>

          {/* Right sidebar details & suggestions */}
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-surface rounded-2xl border border-white/5 p-5 space-y-4">
              <h3 className="text-xs font-bold text-text-secondary uppercase tracking-widest border-b border-white/5 pb-2.5">
                Rincian Konten
              </h3>

              {isLoading ? (
                <div className="space-y-3">
                  <Skeleton className="h-4 w-2/3" />
                  <Skeleton className="h-16 w-full" />
                </div>
              ) : detail ? (
                <div className="space-y-3">
                  {detail.tagline && (
                    <p className="text-xs font-bold text-primary italic">
                      "{detail.tagline}"
                    </p>
                  )}
                  
                  <p className="text-xs text-text-secondary leading-relaxed line-clamp-4">
                    {detail.overview || "Belum ada sinopsis bahasa Indonesia yang tersedia."}
                  </p>

                  <div className="pt-2 border-t border-white/5 space-y-2 text-[11px] text-text-secondary">
                    <p>
                      <span className="font-bold text-text-primary">Status:</span> {detail.status}
                    </p>
                    {isMovie && detail.runtime && (
                      <p>
                        <span className="font-bold text-text-primary">Durasi:</span> {detail.runtime} menit
                      </p>
                    )}
                    {!isMovie && detail.episode_run_time && (
                      <p>
                        <span className="font-bold text-text-primary">Durasi Episode:</span> {detail.episode_run_time[0]} menit
                      </p>
                    )}
                    <p>
                      <span className="font-bold text-text-primary">Bahasa Asli:</span> {detail.genres?.map(g => g.name).join(", ")}
                    </p>
                  </div>

                  <Link
                    to={`/${type}/${id}`}
                    className="block w-full py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-center text-xs font-bold text-text-primary border border-white/5 transition-colors cursor-pointer"
                  >
                    Selengkapnya di Halaman Detail
                  </Link>
                </div>
              ) : (
                <p className="text-xs text-text-secondary">Informasi rincian gagal dimuat.</p>
              )}
            </div>

            {/* Support box */}
            <div className="bg-[#FF3B30]/5 rounded-2xl border border-[#FF3B30]/10 p-4">
              <div className="flex items-start gap-2.5 text-xs text-text-secondary leading-relaxed">
                <AlertCircle className="w-5 h-5 text-[#FF3B30] shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold text-white mb-1">Masalah Pemutaran?</p>
                  <p className="text-[11px]">
                    Jika video tidak berputar atau tidak ada subtitle bahasa Indonesia, silakan coba ganti server/cermin di panel player, atau muat ulang browser Anda.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
