import React from "react";
import { Link } from "react-router-dom";
import { motion } from "motion/react";
import { Star, Film, Tv } from "lucide-react";
import { MovieItem, getPosterUrl } from "../api/dayyapi";

interface MovieCardProps {
  item: MovieItem;
  mediaType?: "movie" | "tv"; // Overwrite if we know the context
}

// Renders a 5-star rating row from a 0-10 vote average, matching the
// reference design's star-row + numeric score treatment.
const StarRow: React.FC<{ rating: number }> = ({ rating }) => {
  const fiveScale = rating / 2;
  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => {
        const filled = i + 1 <= Math.round(fiveScale);
        return (
          <Star
            key={i}
            className={`w-2.5 h-2.5 ${filled ? "fill-amber-400 text-amber-400" : "fill-white/10 text-white/10"}`}
          />
        );
      })}
    </div>
  );
};

export const MovieCard: React.FC<MovieCardProps> = ({ item, mediaType }) => {
  // Determine actual media type
  const actualType = mediaType || item.media_type || (item.title || item.release_date ? "movie" : "tv");
  const isMovie = actualType === "movie";

  const title = isMovie ? item.title || item.original_title : item.name || item.original_name;
  const posterUrl = item.poster_path ? getPosterUrl(item.poster_path) : null;
  const rating = item.vote_average || 0;

  return (
    <Link to={`/${actualType}/${item.id}`} className="block select-none flex-shrink-0 w-[110px] md:w-[150px]" id={`card-${actualType}-${item.id}`}>
      <motion.div
        whileTap={{ scale: 0.96 }}
        transition={{ duration: 0.15, ease: "easeOut" }}
        className="relative aspect-[2/3] w-full rounded-card overflow-hidden bg-surface cursor-pointer"
      >
        {posterUrl ? (
          <img
            src={posterUrl}
            alt={title || "Poster"}
            loading="lazy"
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover"
            onError={(e) => {
              (e.target as HTMLImageElement).style.display = "none";
            }}
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center p-3 bg-gradient-to-br from-surface to-[#1e2638] text-center">
            {isMovie ? (
              <Film className="w-7 h-7 text-primary/40 mb-2" />
            ) : (
              <Tv className="w-7 h-7 text-green-500/40 mb-2" />
            )}
            <span className="text-[10px] font-semibold text-text-secondary line-clamp-3">
              {title}
            </span>
          </div>
        )}
      </motion.div>

      {/* Title and rating outside the card, matching reference layout */}
      <div className="mt-2">
        <h3 className="text-[13px] font-bold text-text-primary line-clamp-1 leading-tight">
          {title || "Tanpa Judul"}
        </h3>
        <div className="flex items-center gap-1 mt-1">
          <StarRow rating={rating} />
          <span className="text-[11px] font-bold text-amber-400 ml-0.5">
            {rating ? rating.toFixed(1) : "0.0"}
          </span>
        </div>
      </div>
    </Link>
  );
};
