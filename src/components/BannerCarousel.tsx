import React, { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "motion/react";
import { Play, Star, Info } from "lucide-react";
import { MovieItem, getBackdropUrl, getPosterUrl } from "../api/dayyapi";

interface BannerCarouselProps {
  items: MovieItem[];
}

export const BannerCarousel: React.FC<BannerCarouselProps> = ({ items }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  // Only feature items that actually have a backdrop image — an empty hero
  // is worse than a shorter carousel.
  const slides = items.filter((it) => it.backdrop_path).slice(0, 6);

  const handleNext = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % slides.length);
  }, [slides.length]);

  useEffect(() => {
    if (slides.length <= 1) return;
    const interval = setInterval(handleNext, 6000);
    return () => clearInterval(interval);
  }, [handleNext, slides.length]);

  if (slides.length === 0) return null;

  const currentItem = slides[currentIndex];
  const isMovie = currentItem.media_type !== "tv";
  const title = isMovie
    ? currentItem.title || currentItem.original_title
    : currentItem.name || currentItem.original_name;
  const backdropUrl = getBackdropUrl(currentItem.backdrop_path);
  const posterUrl = currentItem.poster_path ? getPosterUrl(currentItem.poster_path) : "";
  const overview = currentItem.overview || "Belum ada sinopsis untuk judul ini.";
  const voteAverage = currentItem.vote_average ? currentItem.vote_average.toFixed(1) : null;

  const handleDotClick = (index: number) => setCurrentIndex(index);

  return (
    <div className="relative w-full" id="promo-banner-carousel">
      <div className="relative w-full aspect-[3/4] sm:aspect-[16/10] md:aspect-[21/9] min-h-[420px] md:min-h-[460px] rounded-promo overflow-hidden shadow-2xl">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentItem.id}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="absolute inset-0 w-full h-full"
          >
            {/* Full-bleed backdrop — the film's own imagery is the hero */}
            <motion.img
              src={backdropUrl}
              alt=""
              referrerPolicy="no-referrer"
              initial={{ scale: 1 }}
              animate={{ scale: 1.08 }}
              transition={{ duration: 6, ease: "linear" }}
              className="absolute inset-0 w-full h-full object-cover"
            />

            {/* Gradient overlays: bottom-up for text legibility, plus a left
                wash on wide screens so the text column always reads clearly
                regardless of image content. */}
            <div className="absolute inset-0 bg-gradient-to-t from-background via-background/55 to-transparent" />
            <div className="absolute inset-0 hidden md:block bg-gradient-to-r from-background via-background/40 to-transparent" />

            {/* Content */}
            <div className="relative h-full w-full flex flex-col justify-end md:justify-center px-5 py-8 md:px-12 md:py-0">
              <div className="max-w-xl">
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-[10px] font-bold tracking-widest px-2.5 py-1 rounded-full bg-primary/20 text-primary border border-primary/30 backdrop-blur-md uppercase">
                    Rekomendasi
                  </span>
                  {voteAverage && (
                    <div className="flex items-center gap-1 text-xs text-amber-400 font-semibold bg-black/50 backdrop-blur-md px-2 py-0.5 rounded-full">
                      <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                      <span>{voteAverage}</span>
                    </div>
                  )}
                </div>

                <h2 className="text-2xl md:text-4xl font-bold tracking-tight text-text-primary leading-tight line-clamp-2 mb-3 drop-shadow-lg">
                  {title}
                </h2>

                <p className="hidden sm:line-clamp-2 md:line-clamp-3 text-sm leading-relaxed text-text-secondary mb-6 max-w-lg drop-shadow">
                  {overview}
                </p>

                <div className="flex items-center gap-3">
                  <Link
                    to={`/watch/${isMovie ? "movie" : "tv"}/${currentItem.id}`}
                    className="inline-flex items-center gap-2 px-5 md:px-7 py-2.5 md:py-3 rounded-full bg-primary hover:bg-primary/90 active:scale-95 text-white font-semibold text-sm transition-all shadow-lg shadow-primary/30"
                  >
                    <Play className="w-4 h-4 fill-white" />
                    <span>Nonton Sekarang</span>
                  </Link>

                  <Link
                    to={`/${isMovie ? "movie" : "tv"}/${currentItem.id}`}
                    className="inline-flex items-center gap-2 px-4 py-2.5 md:py-3 rounded-full bg-white/10 hover:bg-white/20 active:scale-95 text-text-primary text-sm font-semibold transition-all border border-white/10 backdrop-blur-md"
                  >
                    <Info className="w-4 h-4" />
                    <span className="hidden sm:inline">Detail</span>
                  </Link>
                </div>
              </div>
            </div>

            {/* Small poster chip, bottom-right, visible from tablet up —
                a secondary visual anchor without hiding the hero on mobile. */}
            {posterUrl && (
              <div className="hidden lg:block absolute bottom-8 right-10 w-28 aspect-[2/3] rounded-card overflow-hidden ring-2 ring-white/10 shadow-2xl">
                <img src={posterUrl} alt="" referrerPolicy="no-referrer" className="w-full h-full object-cover" />
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Pagination Dots */}
      <div className="flex items-center justify-center gap-2 mt-4">
        {slides.map((_, index) => {
          const isActive = index === currentIndex;
          return (
            <button
              key={index}
              onClick={() => handleDotClick(index)}
              className="focus:outline-none cursor-pointer"
              aria-label={`Slide ${index + 1}`}
            >
              <motion.div
                initial={false}
                animate={{
                  width: isActive ? 24 : 8,
                  backgroundColor: isActive ? "#248CFF" : "rgba(138, 153, 173, 0.3)",
                }}
                transition={{ duration: 0.3, ease: [0.25, 1, 0.5, 1] }}
                className="h-2 rounded-full"
              />
            </button>
          );
        })}
      </div>
    </div>
  );
};
