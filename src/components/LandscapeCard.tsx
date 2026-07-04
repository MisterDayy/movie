import React from "react";
import { Link } from "react-router-dom";
import { motion } from "motion/react";
import { Star, Play } from "lucide-react";
import { MovieItem, getBackdropUrl } from "../api/dayyapi";

interface LandscapeCardProps {
  item: MovieItem;
  mediaType?: "movie" | "tv";
  badge?: string;
}

export const LandscapeCard: React.FC<LandscapeCardProps> = ({ item, mediaType, badge }) => {
  const actualType = mediaType || item.media_type || (item.title || item.release_date ? "movie" : "tv");
  const isMovie = actualType === "movie";

  const title = isMovie ? item.title || item.original_title : item.name || item.original_name;
  const backdropUrl = item.backdrop_path ? getBackdropUrl(item.backdrop_path) : null;
  const date = isMovie ? item.release_date : item.first_air_date;
  const year = date ? date.substring(0, 4) : "-";

  return (
    <Link to={`/${actualType}/${item.id}`} className="block select-none flex-shrink-0 w-[220px] md:w-[300px]" id={`landscape-${actualType}-${item.id}`}>
      <motion.div
        whileTap={{ scale: 0.96 }}
        transition={{ duration: 0.15, ease: "easeOut" }}
        className="group relative aspect-[16/9] w-full rounded-card overflow-hidden bg-surface shadow-md cursor-pointer ring-1 ring-white/5"
      >
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
          <div className="w-full h-full bg-gradient-to-br from-[#181818] to-[#0A0A0A] flex items-center justify-center p-4">
            <span className="text-xs font-semibold text-text-secondary text-center line-clamp-2">
              {title}
            </span>
          </div>
        )}

        {/* Top-left tag chip, e.g. "New Episodes" — matches the reference's
            Featured-row badge treatment */}
        {badge && (
          <div className="absolute top-2 left-2 bg-white text-black text-[10px] font-bold px-2 py-1 rounded">
            {badge}
          </div>
        )}

        <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
          <div className="w-11 h-11 rounded-full bg-primary flex items-center justify-center shadow-lg transform scale-90 group-hover:scale-100 transition-transform duration-300">
            <Play className="w-5 h-5 fill-white text-white ml-1" />
          </div>
        </div>

        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black via-black/70 to-transparent pt-8 pb-2.5 px-3">
          <h3 className="text-[13px] font-bold text-text-primary line-clamp-1 leading-tight">
            {title || "Tanpa Judul"}
          </h3>
          <div className="flex items-center gap-1.5 mt-1">
            <span className="text-[11px] text-white/70 font-medium">{year}</span>
            <span className="text-white/20 text-xs">•</span>
            <div className="flex items-center gap-1 text-[11px] text-amber-400 font-medium">
              <Star className="w-3 h-3 fill-amber-400" />
              <span>{item.vote_average ? item.vote_average.toFixed(1) : "0.0"}</span>
            </div>
          </div>
        </div>
      </motion.div>
    </Link>
  );
};
