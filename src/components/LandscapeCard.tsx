import React from "react";
import { Link } from "react-router-dom";
import { motion } from "motion/react";
import { Star, Play } from "lucide-react";
import { MovieItem, getBackdropUrl } from "../api/dayyapi";

interface LandscapeCardProps {
  item: MovieItem;
  mediaType?: "movie" | "tv";
}

export const LandscapeCard: React.FC<LandscapeCardProps> = ({ item, mediaType }) => {
  const actualType = mediaType || item.media_type || (item.title || item.release_date ? "movie" : "tv");
  const isMovie = actualType === "movie";

  const title = isMovie ? item.title || item.original_title : item.name || item.original_name;
  const backdropUrl = item.backdrop_path ? getBackdropUrl(item.backdrop_path) : null;
  const date = isMovie ? item.release_date : item.first_air_date;
  const year = date ? date.substring(0, 4) : "-";

  return (
    <Link to={`/${actualType}/${item.id}`} className="block select-none flex-shrink-0 w-[240px] md:w-[320px]" id={`landscape-${actualType}-${item.id}`}>
      <motion.div
        whileTap={{ scale: 0.96 }}
        transition={{ duration: 0.15, ease: "easeOut" }}
        className="group relative aspect-[16/9] w-full rounded-card overflow-hidden bg-surface shadow-md cursor-pointer border border-white/5"
      >
        {/* Backdrop Image */}
        {backdropUrl ? (
          <img
            src={backdropUrl}
            alt={title || "Backdrop"}
            loading="lazy"
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
            onError={(e) => {
              (e.target as HTMLImageElement).style.display = "none";
            }}
          />
        ) : (
          /* Gradient fallback */
          <div className="w-full h-full bg-gradient-to-br from-[#121824] to-[#1e2638] flex items-center justify-center p-4">
            <span className="text-xs font-semibold text-text-secondary text-center line-clamp-2">
              {title}
            </span>
          </div>
        )}

        {/* Play hover button overlay */}
        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
          <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center shadow-lg transform scale-90 group-hover:scale-100 transition-transform duration-300">
            <Play className="w-6 h-6 fill-white text-white ml-1" />
          </div>
        </div>

        {/* Title and metadata floating overlay */}
        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-background via-background/80 to-transparent pt-8 pb-3 px-3.5 backdrop-blur-[1px]">
          <h3 className="text-[14px] font-semibold text-text-primary line-clamp-1 group-hover:text-primary transition-colors leading-tight">
            {title || "Tanpa Judul"}
          </h3>
          <div className="flex items-center gap-2 mt-1">
            <span className="text-[12px] text-text-secondary font-medium">{year}</span>
            <span className="text-white/20 text-xs">•</span>
            <div className="flex items-center gap-1 text-[12px] text-amber-400 font-medium">
              <Star className="w-3 h-3 fill-amber-400" />
              <span>{item.vote_average ? item.vote_average.toFixed(1) : "0.0"}</span>
            </div>
            <span className="text-white/20 text-xs">•</span>
            <span className="text-[10px] px-1 py-0.2 rounded bg-white/5 border border-white/10 text-white/40 uppercase">
              {isMovie ? "Movie" : "TV"}
            </span>
          </div>
        </div>
      </motion.div>
    </Link>
  );
};
