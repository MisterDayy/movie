import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "motion/react";
import { Check, Film } from "lucide-react";
import { getPopular, getPosterUrl, MovieItem } from "../api/dayyapi";

export const Onboarding: React.FC = () => {
  const navigate = useNavigate();
  const [movies, setMovies] = useState<MovieItem[]>([]);
  const [selected, setSelected] = useState<Set<number>>(new Set());
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const res = await getPopular(1);
        const top4 = (res.results || []).slice(0, 4);
        setMovies(top4);
        // Semua terpilih secara default, meniru tampilan referensi
        setSelected(new Set(top4.map((m) => m.id)));
      } catch (e) {
        setMovies([]);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const toggle = (id: number) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const handleContinue = () => {
    // TODO: sambungkan ke alur pendaftaran/akun sesungguhnya
    navigate("/");
  };

  return (
    <div
      className="min-h-screen w-full flex flex-col justify-center px-6 py-10"
      style={{
        background:
          "radial-gradient(120% 90% at 50% 0%, #3a0d0d 0%, #1a0505 45%, #0A0A0A 100%)",
      }}
    >
      <div className="w-full max-w-sm mx-auto">
        {/* Heading */}
        <h1 className="text-[26px] leading-tight font-extrabold text-white mb-2">
          Pilihan bagus! pilih film
          <br />
          yang mungkin ingin kamu tonton
        </h1>
        <p className="text-sm text-text-secondary mb-6">
          Masukkan email untuk melanjutkan ke akunmu
        </p>

        {/* Grid 2x2 poster */}
        <div className="grid grid-cols-2 gap-4 mb-8">
          {loading &&
            Array.from({ length: 4 }).map((_, i) => (
              <div
                key={i}
                className="aspect-[3/4] rounded-2xl bg-surface animate-shimmer"
              />
            ))}

          {!loading &&
            movies.map((movie) => {
              const isSelected = selected.has(movie.id);
              const title = movie.title || movie.original_title || movie.name;
              const posterUrl = movie.poster_path
                ? getPosterUrl(movie.poster_path)
                : null;

              return (
                <motion.button
                  key={movie.id}
                  type="button"
                  whileTap={{ scale: 0.96 }}
                  onClick={() => toggle(movie.id)}
                  className="relative aspect-[3/4] rounded-2xl overflow-hidden bg-surface ring-1 ring-white/10 text-left"
                >
                  {posterUrl ? (
                    <img
                      src={posterUrl}
                      alt={title || "Poster"}
                      loading="lazy"
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center p-3 bg-gradient-to-br from-surface to-[#0A0A0A]">
                      <Film className="w-7 h-7 text-primary/40 mb-2" />
                      <span className="text-[10px] font-semibold text-text-secondary text-center line-clamp-3">
                        {title}
                      </span>
                    </div>
                  )}

                  {/* Gradient overlay bawah + judul */}
                  <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/85 to-transparent" />
                  <span className="absolute bottom-2 left-2 right-2 text-[13px] font-bold text-white drop-shadow line-clamp-2">
                    {title}
                  </span>

                  {/* Badge centang */}
                  <span
                    className={`absolute top-2 right-2 w-6 h-6 rounded-full flex items-center justify-center transition-colors ${
                      isSelected
                        ? "bg-white"
                        : "bg-black/40 ring-1 ring-white/50"
                    }`}
                  >
                    {isSelected && <Check className="w-4 h-4 text-black" strokeWidth={3} />}
                  </span>
                </motion.button>
              );
            })}
        </div>

        {/* Input email */}
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Alamat email"
          className="w-full mb-4 px-4 py-3.5 rounded-full bg-white/10 text-white placeholder:text-text-secondary text-sm outline-none ring-1 ring-white/10 focus:ring-primary/60 transition-all"
        />

        {/* Tombol lanjut */}
        <button
          type="button"
          onClick={handleContinue}
          className="w-full py-3.5 rounded-full bg-white text-black font-bold text-sm hover:bg-white/90 active:scale-[0.98] transition-all"
        >
          Lanjutkan
        </button>
      </div>
    </div>
  );
};
