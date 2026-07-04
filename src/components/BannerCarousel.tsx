import React, { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "motion/react";
import { MovieItem, getBackdropUrl } from "../api/dayyapi";

interface BannerCarouselProps {
  items: MovieItem[];
}

export const BannerCarousel: React.FC<BannerCarouselProps> = ({ items }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

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
  const date = isMovie ? currentItem.release_date : currentItem.first_air_date;
  const year = date ? date.substring(0, 4) : null;
  const rating = currentItem.vote_average ? currentItem.vote_average.toFixed(1) : null;

  const handleDotClick = (index: number) => setCurrentIndex(index);

  return (
    <div className="relative w-full" id="promo-banner-carousel">
      <Link
        to={`/${isMovie ? "movie" : "tv"}/${currentItem.id}`}
        className="relative block w-full h-[280px] sm:h-[340px] md:h-[420px] rounded-promo overflow-hidden"
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={currentItem.id}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="absolute inset-0 w-full h-full"
          >
            <motion.img
              src={backdropUrl}
              alt=""
              referrerPolicy="no-referrer"
              initial={{ scale: 1 }}
              animate={{ scale: 1.06 }}
              transition={{ duration: 6, ease: "linear" }}
              className="absolute inset-0 w-full h-full object-cover object-top"
            />

            {/* Heavy bottom-up black gradient — matches the reference detail
                hero where the title block sits on a near-solid dark base */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0A] via-[#0A0A0A]/40 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-transparent to-transparent" />

            <div className="absolute bottom-0 left-0 right-0 px-5 py-6 md:px-8 md:py-8">
              <h2 className="text-3xl md:text-5xl font-black tracking-tight text-primary uppercase leading-[0.95] drop-shadow-[0_2px_12px_rgba(0,0,0,0.8)]" style={{ letterSpacing: "0.02em" }}>
                {title}
              </h2>

              <div className="flex items-center gap-2 mt-3 text-[11px] font-semibold text-white/90">
                {year && (
                  <>
                    <span className="px-2 py-0.5 rounded bg-white/10 border border-white/15">17+</span>
                    <span>{year}</span>
                  </>
                )}
                {rating && (
                  <>
                    <span className="text-white/30">•</span>
                    <span className="text-amber-400">★ {rating}</span>
                  </>
                )}
                <span className="text-white/30">•</span>
                <span className="uppercase">{isMovie ? "Movie" : "Series"}</span>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </Link>

      {/* Pagination Dots */}
      <div className="flex items-center justify-center gap-2 mt-3">
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
                  width: isActive ? 20 : 6,
                  backgroundColor: isActive ? "#E50914" : "rgba(163, 163, 163, 0.35)",
                }}
                transition={{ duration: 0.3, ease: [0.25, 1, 0.5, 1] }}
                className="h-1.5 rounded-full"
              />
            </button>
          );
        })}
      </div>
    </div>
  );
};
