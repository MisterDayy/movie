import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Film, Search, TrendingUp, Compass, PlaySquare, Calendar, Menu, X } from "lucide-react";

export const Header: React.FC = () => {
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navItems = [
    { label: "Beranda", path: "/", icon: PlaySquare },
    { label: "Trending", path: "/browse/trending", icon: TrendingUp },
    { label: "Populer", path: "/browse/popular", icon: Compass },
    { label: "Sedang Tayang", path: "/browse/now-playing", icon: Film },
    { label: "Mendatang", path: "/browse/upcoming", icon: Calendar },
    { label: "Pencarian", path: "/search", icon: Search },
  ];

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  return (
    <header className="sticky top-0 z-40 bg-background/85 backdrop-blur-md border-b border-white/5 px-5 md:px-10 py-4 flex items-center justify-between" id="global-header">
      {/* Logo */}
      <Link to="/" className="flex items-center gap-2 group">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#FF3B30] to-primary flex items-center justify-center shadow-lg shadow-primary/20 transition-transform duration-300 group-hover:scale-105">
          <Film className="w-5.5 h-5.5 text-white" />
        </div>
        <div>
          <span className="text-lg font-bold tracking-tight text-text-primary group-hover:text-primary transition-colors">
            Watch<span className="text-primary font-black">ly</span>
          </span>
          <span className="block text-[9px] text-text-secondary tracking-widest uppercase font-bold leading-none mt-0.5">
            Streaming Hub
          </span>
        </div>
      </Link>

      {/* Desktop Navigation */}
      <nav className="hidden lg:flex items-center gap-1">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`px-4 py-2 rounded-full text-xs font-bold tracking-wide transition-all flex items-center gap-1.5 hover:text-white ${
                isActive
                  ? "bg-primary text-white shadow-lg shadow-primary/15"
                  : "text-text-secondary hover:bg-white/5"
              }`}
            >
              <item.icon className="w-3.5 h-3.5" />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* Search Bar Shortcut (Desktop only) */}
      <div className="hidden lg:flex items-center">
        <Link
          to="/search"
          className="p-2.5 rounded-full bg-surface border border-white/5 text-text-secondary hover:text-white hover:bg-white/5 transition-colors"
          title="Cari film atau serial"
        >
          <Search className="w-4 h-4" />
        </Link>
      </div>

      {/* Mobile Menu Trigger */}
      <button
        onClick={toggleMenu}
        className="lg:hidden p-2 rounded-xl bg-surface border border-white/5 text-text-secondary hover:text-white focus:outline-none cursor-pointer"
        aria-label="Toggle Menu"
      >
        {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
      </button>

      {/* Mobile Drawer (Menu) */}
      {isMenuOpen && (
        <div className="lg:hidden absolute top-full left-0 right-0 bg-surface/95 backdrop-blur-xl border-b border-white/5 shadow-2xl p-5 space-y-3 z-50">
          <div className="grid grid-cols-2 gap-2">
            {navItems.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setIsMenuOpen(false)}
                  className={`px-4 py-3 rounded-xl text-xs font-bold flex items-center gap-2 transition-all ${
                    isActive
                      ? "bg-primary text-white shadow-lg shadow-primary/15"
                      : "bg-background/40 text-text-secondary hover:bg-background/80"
                  }`}
                >
                  <item.icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </div>
        </div>
      )}
    </header>
  );
};
