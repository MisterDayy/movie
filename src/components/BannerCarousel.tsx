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
  const [direction, setDirection] = useState(0); // -1 for left, 1 for right

  const slides = items.slice(0, 5); // Limit to top 5 featured items

  const handleNext = useCallback(() => {
    setDirection(1);
    setCurrentIndex((prev) => (prev + 1) % slides.length);
  }, [slides.length]);

  const handlePrev = useCallback(() => {
    setDirection(-1);
    setCurrentIndex((prev) => (prev - 1 + slides.length) % slides.length);
  }, [slides.length]);

  // Autoplay functionality
  useEffect(() => {
    if (slides.length <= 1) return;
    const interval = setInterval(handleNext, 5000);
    return () => clearInterval(interval);
  }, [handleNext, slides.length]);

  if (slides.length === 0) return null;

  const currentItem = slides[currentIndex];
  const isMovie = currentItem.media_type !== "tv";
  const title = isMovie ? currentItem.title || currentItem.original_title : currentItem.name || currentItem.original_name;
  const backdropUrl = currentItem.backdrop_path ? getBackdropUrl(currentItem.backdrop_path) : "";
  const posterUrl = currentItem.poster_path ? getPosterUrl(currentItem.poster_path) : "";
  const overview = currentItem.overview || "Belum ada deskripsi sinopsis untuk film ini.";
  const voteAverage = currentItem.vote_average ? currentItem.vote_average.toFixed(1) : "0.0";

  // Sliding animation variants using standard cubic-bezier
  const slideVariants = {
    enter: (dir: number) => ({
      x: dir > 0 ? "100%" : "-100%",
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
    },
    exit: (dir: number) => ({
      x: dir < 0 ? "100%" : "-100%",
      opacity: 0,
    }),
  };

  const handleDotClick = (index: number) => {
    setDirection(index > currentIndex ? 1 : -1);
    setCurrentIndex(index);
  };

  return (
    <div className="relative w-full" id="promo-banner-carousel">
      {/* Banner Window */}
      <div className="relative w-full aspect-[2/1] min-h-[260px] md:min-h-[420px] rounded-promo overflow-hidden bg-surface border border-white/5 shadow-2xl">
        <AnimatePresence initial={false} custom={direction}>
          <motion.div
            key={currentIndex}
            custom={direction}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{
              x: { type: "tween", duration: 0.45, ease: [0.16, 1, 0.3, 1] },
              opacity: { duration: 0.35 },
            }}
            className="absolute inset-0 w-full h-full flex flex-col md:flex-row"
          >
            {/* Backdrop background for visual depth */}
            {backdropUrl && (
              <div className="absolute inset-0 -z-10 block">
                <img
                  src={backdropUrl}
                  alt=""
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover opacity-15 blur-sm"
                />
              </div>
            )}

            {/* Left Column: Promotion Info */}
            <div className="flex-1 p-5 md:p-10 flex flex-col justify-center z-10 bg-gradient-to-r from-surface via-surface/90 to-transparent">
              <div className="flex items-center gap-2 mb-2 md:mb-3">
                <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-primary/20 text-primary border border-primary/20 backdrop-blur-md">
                  REKOMENDASI
                </span>
                <span className="text-white/40 text-xs">•</span>
                <div className="flex items-center gap-1 text-xs text-amber-400 font-semibold bg-black/40 px-2 py-0.5 rounded-full">
                  <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                  <span>{voteAverage}</span>
                </div>
              </div>

              <h2 className="text-xl md:text-3.5xl font-bold tracking-tight text-text-primary leading-tight line-clamp-2 mb-2 md:mb-4">
                {title}
              </h2>

              <p className="hidden md:line-clamp-3 text-sm leading-relaxed text-text-secondary mb-6 max-w-xl">
                {overview}
              </p>

              {/* Action Buttons */}
              <div className="flex items-center gap-3">
                <Link
                  to={`/${isMovie ? "movie" : "tv"}/${currentItem.id}`}
                  className="inline-flex items-center gap-2 px-5 md:px-7 py-2.5 md:py-3 rounded-full bg-primary hover:bg-primary/95 text-white font-semibold text-sm transition-all shadow-lg hover:shadow-primary/20 cursor-pointer"
                >
                  <Play className="w-4 h-4 fill-white" />
                  <span>Nonton Sekarang</span>
                </Link>

                <Link
                  to={`/${isMovie ? "movie" : "tv"}/${currentItem.id}`}
                  className="inline-flex items-center gap-2 px-4 py-2.5 md:py-3 rounded-full bg-white/10 hover:bg-white/15 text-text-primary text-sm font-semibold transition-all cursor-pointer border border-white/5"
                >
                  <Info className="w-4 h-4" />
                  <span className="hidden sm:inline">Detail</span>
                </Link>
              </div>
            </div>

            {/* Right Column: Poster Image with customized overlay */}
            <div className="hidden md:block relative w-1/3 h-full overflow-hidden">
              <div className="absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-surface to-transparent z-10" />
              {posterUrl ? (
                <img
                  src={posterUrl}
                  alt={title}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover object-center transform scale-102 hover:scale-105 transition-transform duration-700"
                />
              ) : (
                <div className="w-full h-full bg-[#1e2638] flex items-center justify-center">
                  <Play className="w-16 h-16 text-primary/30" />
                </div>
              )}
            </div>
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
