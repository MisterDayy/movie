import React, { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "motion/react";
import { MovieItem, getBackdropUrl } from "../api/dayyapi";

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

  const handleDotClick = (index: number) => setCurrentIndex(index);

  return (
    <div className="relative w-full" id="promo-banner-carousel">
      <Link
        to={`/${isMovie ? "movie" : "tv"}/${currentItem.id}`}
        className="relative block w-full aspect-[3/4] sm:aspect-[16/9] rounded-promo overflow-hidden"
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
            {/* Full-bleed backdrop — the film's own imagery is the hero, no
                overlay chrome on top of it, matching the reference poster look */}
            <motion.img
              src={backdropUrl}
              alt=""
              referrerPolicy="no-referrer"
              initial={{ scale: 1 }}
              animate={{ scale: 1.06 }}
              transition={{ duration: 6, ease: "linear" }}
              className="absolute inset-0 w-full h-full object-cover"
            />

            {/* Bottom-up gradient just enough for the title to read clearly */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/10 to-transparent" />

            {/* Title only, bottom-left — the poster itself is the visual */}
            <div className="absolute bottom-0 left-0 right-0 px-5 py-5 md:px-8 md:py-6">
              <h2 className="text-xl md:text-3xl font-black tracking-tight text-white uppercase leading-tight line-clamp-2 drop-shadow-lg">
                {title}
              </h2>
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
                  backgroundColor: isActive ? "#2F80FF" : "rgba(139, 147, 176, 0.35)",
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
