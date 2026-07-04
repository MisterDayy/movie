import React from "react";
import { Link, useLocation } from "react-router-dom";
import { Clapperboard, Crown, Search, User } from "lucide-react";

const tabs = [
  { label: "Movie", path: "/", icon: Clapperboard, match: (p: string) => p === "/" },
  { label: "Ranking", path: "/ranking", icon: Crown, match: (p: string) => p.startsWith("/ranking") },
  { label: "Find", path: "/search", icon: Search, match: (p: string) => p.startsWith("/search") },
  { label: "Mine", path: "/mine", icon: User, match: (p: string) => p.startsWith("/mine") },
];

export const BottomNav: React.FC = () => {
  const location = useLocation();

  return (
    <nav
      id="global-bottom-nav"
      className="fixed bottom-0 left-0 right-0 z-40 bg-surface/95 backdrop-blur-xl border-t border-white/5 px-2 pt-2 pb-[max(0.5rem,env(safe-area-inset-bottom))]"
    >
      <div className="max-w-md mx-auto flex items-center justify-between">
        {tabs.map((tab) => {
          const isActive = tab.match(location.pathname);
          return (
            <Link
              key={tab.path}
              to={tab.path}
              className="flex-1 flex flex-col items-center gap-1 py-1.5 rounded-xl transition-colors"
            >
              <tab.icon
                className={`w-5 h-5 transition-colors ${
                  isActive ? "text-primary" : "text-text-secondary"
                }`}
                strokeWidth={isActive ? 2.4 : 2}
              />
              <span
                className={`text-[10px] font-semibold tracking-wide transition-colors ${
                  isActive ? "text-primary" : "text-text-secondary"
                }`}
              >
                {tab.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
};
