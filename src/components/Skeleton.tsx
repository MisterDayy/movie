import React from "react";

export const Skeleton: React.FC<{ className?: string }> = ({ className = "" }) => {
  return (
    <div 
      className={`animate-shimmer rounded bg-surface ${className}`}
      style={{ backgroundSize: "200% 100%" }}
    />
  );
};

export const CardSkeleton: React.FC = () => {
  return (
    <div className="flex-shrink-0 w-[140px] md:w-[170px]">
      <div className="aspect-[2/3] w-full rounded-card overflow-hidden bg-surface animate-shimmer" />
      <div className="mt-2.5 space-y-1">
        <div className="h-4 w-4/5 rounded bg-surface animate-shimmer" />
        <div className="h-3 w-1/2 rounded bg-surface animate-shimmer" />
      </div>
    </div>
  );
};

export const LandscapeSkeleton: React.FC = () => {
  return (
    <div className="flex-shrink-0 w-[240px] md:w-[320px]">
      <div className="aspect-[16/9] w-full rounded-card overflow-hidden bg-surface animate-shimmer" />
      <div className="mt-2.5 space-y-1">
        <div className="h-4 w-2/3 rounded bg-surface animate-shimmer" />
        <div className="h-3 w-1/3 rounded bg-surface animate-shimmer" />
      </div>
    </div>
  );
};

export const BannerSkeleton: React.FC = () => {
  return (
    <div className="w-full aspect-[2/1] min-h-[220px] md:min-h-[380px] rounded-promo overflow-hidden bg-surface animate-shimmer" />
  );
};

export const GridSkeleton: React.FC<{ count?: number }> = ({ count = 12 }) => {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-x-3 gap-y-6">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="flex flex-col">
          <div className="aspect-[2/3] w-full rounded-card overflow-hidden bg-surface animate-shimmer" />
          <div className="mt-2.5 space-y-1.5">
            <div className="h-4 w-11/12 rounded bg-surface animate-shimmer" />
            <div className="h-3.5 w-7/12 rounded bg-surface animate-shimmer" />
          </div>
        </div>
      ))}
    </div>
  );
};
