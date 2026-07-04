import React from "react";
import { Link } from "react-router-dom";
import { TopBar } from "../components/TopBar";
import { User, TrendingUp, Compass, Film, Calendar, ChevronRight } from "lucide-react";

export const Mine: React.FC = () => {
  const links = [
    { label: "Trending", path: "/browse/trending", icon: TrendingUp },
    { label: "Terpopuler", path: "/browse/popular", icon: Compass },
    { label: "Sedang Tayang", path: "/browse/now-playing", icon: Film },
    { label: "Mendatang", path: "/browse/upcoming", icon: Calendar },
  ];

  return (
    <div className="space-y-8" id="mine-page">
      <TopBar title="Mine" />

      <div className="px-5 md:px-10 flex items-center gap-4">
        <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-primary to-[#8a0000] flex items-center justify-center shadow-lg shadow-primary/20">
          <User className="w-7 h-7 text-white" />
        </div>
        <div>
          <h2 className="text-lg font-bold text-text-primary">Sobat Nonton</h2>
          <p className="text-xs text-text-secondary mt-0.5">Selamat datang kembali di Watchly</p>
        </div>
      </div>

      <div className="px-5 md:px-10 space-y-2">
        {links.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className="flex items-center justify-between bg-surface border border-white/5 rounded-md px-4 py-3.5 hover:bg-surface-2 transition-colors"
          >
            <div className="flex items-center gap-3">
              <item.icon className="w-4 h-4 text-primary" />
              <span className="text-sm font-semibold text-text-primary">{item.label}</span>
            </div>
            <ChevronRight className="w-4 h-4 text-text-secondary" />
          </Link>
        ))}
      </div>

      <p className="px-5 md:px-10 text-[11px] text-text-secondary/60 text-center pt-4">
        Konten bersumber dari TMDB melalui DayyAPI.
      </p>
    </div>
  );
};
