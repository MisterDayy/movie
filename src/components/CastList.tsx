import React from "react";
import { User } from "lucide-react";
import { CastMember, getProfileUrl } from "../api/dayyapi";

interface CastListProps {
  cast: CastMember[];
}

export const CastList: React.FC<CastListProps> = ({ cast }) => {
  // Take up to 15 first cast members as requested
  const displayCast = cast.slice(0, 15);

  if (!displayCast || displayCast.length === 0) {
    return (
      <div className="py-4 text-text-secondary text-sm">
        Informasi daftar pemain belum tersedia.
      </div>
    );
  }

  return (
    <div className="w-full">
      <div className="flex gap-4 overflow-x-auto pb-4 no-scrollbar -mx-5 px-5 md:-mx-10 md:px-10 snap-x snap-mandatory scroll-smooth">
        {displayCast.map((actor) => {
          const avatarUrl = actor.profile_path ? getProfileUrl(actor.profile_path) : null;

          return (
            <div
              key={actor.id}
              className="flex-shrink-0 w-[100px] text-center snap-start"
              id={`cast-${actor.id}`}
            >
              {/* Squircle Image container */}
              <div className="w-[84px] h-[84px] mx-auto rounded-2xl overflow-hidden bg-surface border border-white/5 shadow-md flex items-center justify-center">
                {avatarUrl ? (
                  <img
                    src={avatarUrl}
                    alt={actor.name}
                    loading="lazy"
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover object-center transition-transform duration-300 hover:scale-105"
                    onError={(e) => {
                      (e.target as HTMLImageElement).style.display = "none";
                    }}
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-[#121824] to-[#1e2638] flex items-center justify-center">
                    <User className="w-8 h-8 text-text-secondary/30" />
                  </div>
                )}
              </div>

              {/* Actor Meta text */}
              <div className="mt-2.5 px-0.5">
                <p className="text-[12px] font-bold text-text-primary line-clamp-1 leading-tight">
                  {actor.name}
                </p>
                <p className="text-[10px] text-text-secondary line-clamp-1 mt-0.5 leading-tight">
                  {actor.character || "Pemain"}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
