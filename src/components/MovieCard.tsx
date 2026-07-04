import React from "react";
import { Link } from "react-router-dom";
import { motion } from "motion/react";
import { Star, Film, Tv } from "lucide-react";
import { MovieItem, getPosterUrl } from "../api/dayyapi";
import { useGenres } from "./GenreProvider";

interface MovieCardProps {
  item: MovieItem;
  mediaType?: "movie" | "tv"; // Overwrite if we know the context
}

export const MovieCard: React.FC<MovieCardProps> = ({ item, mediaType }) => {
  const { genresMap } = useGenres();

  // Determine actual media type
  const actualType = mediaType || item.media_type || (item.title || item.release_date ? "movie" : "tv");
  const isMovie = actualType === "movie";

  const title = isMovie ? item.title || item.original_title : item.name || item.original_name;
  const date = isMovie ? item.release_date : item.first_air_date;
  const year = date ? date.substring(0, 4) : "-";

  const posterUrl = item.poster_path ? getPosterUrl(item.poster_path) : null;

  // Get first genre name
  const firstGenre = item.genre_ids && item.genre_ids.length > 0 && genresMap[item.genre_ids[0]]
    ? genresMap[item.genre_ids[0]]
    : null;

  return (
    <Link to={`/${actualType}/${item.id}`} className="block select-none flex-shrink-0 w-[140px] md:w-[170px]" id={`card-${actualType}-${item.id}`}>
      <motion.div
        whileTap={{ scale: 0.96 }}
        transition={{ duration: 0.15, ease: "easeOut" }}
        className="group relative aspect-[2/3] w-full rounded-card overflow-hidden bg-surface shadow-md cursor-pointer border border-white/5"
      >
        {/* Poster Image */}
        {posterUrl ? (
          <img
            src={posterUrl}
            alt={title || "Poster"}
            loading="lazy"
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
            onError={(e) => {
              (e.target as HTMLImageElement).style.display = "none";
            }}
          />
        ) : (
          /* High-quality CSS fallback for missing posters */
          <div className="w-full h-full flex flex-col items-center justify-center p-4 bg-gradient-to-br from-surface to-[#1e2638] text-center">
            {isMovie ? (
              <Film className="w-8 h-8 text-primary/40 mb-2" />
            ) : (
              <Tv className="w-8 h-8 text-green-500/40 mb-2" />
            )}
            <span className="text-[11px] font-semibold text-text-secondary line-clamp-3">
              {title}
            </span>
          </div>
        )}

        {/* Hover overlay gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-3">
          <div className="flex items-center gap-1.5 text-xs text-white mb-1">
            <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
            <span className="font-semibold">{item.vote_average ? item.vote_average.toFixed(1) : "0.0"}</span>
          </div>
          {firstGenre && (
            <span className="text-[10px] text-text-secondary truncate">{firstGenre}</span>
          )}
        </div>

        {/* Floating Media Type Badge */}
        <div className="absolute top-2.5 right-2.5 z-10">
          {isMovie ? (
            <span className="text-[10px] font-bold px-2 py-1 rounded-full bg-primary/20 text-primary border border-primary/20 backdrop-blur-md">
              FILM
            </span>
          ) : (
            <span className="text-[10px] font-bold px-2 py-1 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/20 backdrop-blur-md">
              SERI
            </span>
          )}
        </div>

        {/* Quick rating top badge */}
        {item.vote_average > 0 && (
          <div className="absolute top-2.5 left-2.5 z-10 flex items-center gap-0.5 px-1.5 py-0.5 rounded-full bg-black/60 backdrop-blur-md border border-white/5 text-[10px] font-medium text-amber-400">
            <Star className="w-2.5 h-2.5 fill-amber-400" />
            <span>{item.vote_average.toFixed(1)}</span>
          </div>
        )}
      </motion.div>

      {/* Title and Metadata outside the card */}
      <div className="mt-2.5">
        <h3 className="text-[14px] font-semibold tracking-wide text-text-primary line-clamp-2 group-hover:text-primary transition-colors leading-tight min-h-[36px]">
          {title || "Tanpa Judul"}
        </h3>
        <p className="text-[12px] text-text-secondary mt-0.5 flex items-center justify-between">
          <span>{year}</span>
          <span className="text-[10px] px-1 py-0.2 rounded border border-white/10 text-white/40 uppercase">
            {item.original_language}
          </span>
        </p>
      </div>
    </Link>
  );
};
