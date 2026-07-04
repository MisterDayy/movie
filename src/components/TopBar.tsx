import React from "react";
import { Link } from "react-router-dom";
import { Search } from "lucide-react";

interface TopBarProps {
  title: string;
  brand?: boolean; // when true, renders the first letter in red (Watchly wordmark)
}

export const TopBar: React.FC<TopBarProps> = ({ title, brand }) => {
  return (
    <div className="px-4 md:px-10 pt-6 pb-1 flex items-center justify-between gap-4" id="page-top-bar">
      <h1 className="text-[26px] md:text-3xl font-black tracking-tight text-text-primary">
        {brand ? (
          <>
            <span className="text-primary">{title.charAt(0)}</span>
            {title.slice(1)}
          </>
        ) : (
          title
        )}
      </h1>
      <Link
        to="/search"
        className="flex items-center justify-center w-9 h-9 rounded-full text-white active:scale-90 transition-transform"
      >
        <Search className="w-5 h-5" />
      </Link>
    </div>
  );
};
