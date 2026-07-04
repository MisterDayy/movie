import React from "react";
import { Link } from "react-router-dom";
import { Search } from "lucide-react";

interface TopBarProps {
  title: string;
}

export const TopBar: React.FC<TopBarProps> = ({ title }) => {
  return (
    <div className="px-5 md:px-10 pt-6 pb-2 flex items-center justify-between gap-4" id="page-top-bar">
      <h1 className="text-[26px] md:text-3xl font-bold tracking-tight text-text-primary">
        {title}
      </h1>
      <Link
        to="/search"
        className="flex items-center gap-2 bg-surface border border-white/5 rounded-full px-4 py-2.5 text-text-secondary hover:text-white transition-colors shadow-md"
      >
        <Search className="w-4 h-4" />
        <span className="text-xs font-medium hidden sm:inline">Search</span>
      </Link>
    </div>
  );
};
