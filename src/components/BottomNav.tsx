import React from "react";
import { Link, useLocation } from "react-router-dom";
import { Home, Crown, Search, User } from "lucide-react";

const tabs = [
  { label: "Home", path: "/", icon: Home, match: (p: string) => p === "/" },
  { label: "Charts", path: "/ranking", icon: Crown, match: (p: string) => p.startsWith("/ranking") },
  { label: "Search", path: "/search", icon: Search, match: (p: string) => p.startsWith("/search") },
  { label: "Profile", path: "/mine", icon: User, match: (p: string) => p.startsWith("/mine") },
];

// Icon-only bottom tab bar on solid black, red-active — matches the
// reference app's minimal bottom navigation styling.
export const BottomNav: React.FC = () => {
  const location = useLocation();

  return (
    <nav
      id="global-bottom-nav"
      className="fixed bottom-0 left-0 right-0 z-40 bg-[#0A0A0A]/97 backdrop-blur-xl border-t border-white/10 px-2 pt-2.5 pb-[max(0.65rem,env(safe-area-inset-bottom))]"
    >
      <div className="max-w-md mx-auto flex items-center justify-between">
        {tabs.map((tab) => {
          const isActive = tab.match(location.pathname);
          return (
            <Link
              key={tab.path}
              to={tab.path}
              className="flex-1 flex flex-col items-center gap-1 py-1 rounded-xl transition-colors"
            >
              <tab.icon
                className={`w-6 h-6 transition-colors ${
                  isActive ? "text-primary" : "text-text-secondary"
                }`}
                strokeWidth={isActive ? 2.3 : 1.8}
              />
              <span
                className={`text-[9px] font-semibold tracking-wide transition-colors ${
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
