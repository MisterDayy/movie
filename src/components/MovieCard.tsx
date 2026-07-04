import React from "react";
import { Link } from "react-router-dom";
import { motion } from "motion/react";
import { Star, Film, Tv } from "lucide-react";
import { MovieItem, getPosterUrl } from "../api/dayyapi";

interface MovieCardProps {
  item: MovieItem;
  mediaType?: "movie" | "tv";
  // Use inside CSS grids (Browse/Search results) so the card fills its
  // grid cell. Leave false for horizontal-scroll rails (Home, Detail),
  // which need a fixed rail width instead.
  fullWidth?: boolean;
}

export const MovieCard: React.FC<MovieCardProps> = ({ item, mediaType, fullWidth }) => {
  const actualType = mediaType || item.media_type || (item.title || item.release_date ? "movie" : "tv");
  const isMovie = actualType === "movie";

  const title = isMovie ? item.title || item.original_title : item.name || item.original_name;
  const posterUrl = item.poster_path ? getPosterUrl(item.poster_path) : null;
  const rating = item.vote_average || 0;

  return (
    <Link
      to={`/${actualType}/${item.id}`}
      className={`block select-none ${fullWidth ? "w-full" : "flex-shrink-0 w-[112px] md:w-[150px]"}`}
      id={`card-${actualType}-${item.id}`}
    >
      <motion.div
        whileTap={{ scale: 0.96 }}
        transition={{ duration: 0.15, ease: "easeOut" }}
        className="relative aspect-[2/3] w-full rounded-card overflow-hidden bg-surface cursor-pointer ring-1 ring-white/5"
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
          <div className="w-full h-full flex flex-col items-center justify-center p-3 bg-gradient-to-br from-surface to-[#0A0A0A] text-center">
            {isMovie ? (
              <Film className="w-7 h-7 text-primary/40 mb-2" />
            ) : (
              <Tv className="w-7 h-7 text-primary/40 mb-2" />
            )}
            <span className="text-[10px] font-semibold text-text-secondary line-clamp-3">
              {title}
            </span>
          </div>
        )}

        {/* Rating badge, top-left over the poster — matches the reference's
            on-poster rating chip rather than a separate row of stars */}
        {rating > 0 && (
          <div className="absolute top-1.5 left-1.5 flex items-center gap-0.5 bg-black/70 backdrop-blur-sm rounded-md px-1.5 py-0.5">
            <Star className="w-2.5 h-2.5 fill-amber-400 text-amber-400" />
            <span className="text-[10px] font-bold text-white">{rating.toFixed(1)}</span>
          </div>
        )}
      </motion.div>

      <div className="mt-2">
        <h3 className="text-[13px] font-semibold text-text-primary line-clamp-1 leading-tight">
          {title || "Tanpa Judul"}
        </h3>
      </div>
    </Link>
  );
};
