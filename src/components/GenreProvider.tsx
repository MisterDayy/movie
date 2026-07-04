import React, { createContext, useContext, useEffect, useState } from "react";
import { getGenres, getApiStatus, StatusResponse } from "../api/dayyapi";

interface GenreContextType {
  genresMap: { [id: number]: string };
  apiStatus: StatusResponse | null;
  isLoading: boolean;
}

const GenreContext = createContext<GenreContextType>({
  genresMap: {},
  apiStatus: null,
  isLoading: true,
});

export const useGenres = () => useContext(GenreContext);

export const GenreProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [genresMap, setGenresMap] = useState<{ [id: number]: string }>({});
  const [apiStatus, setApiStatus] = useState<StatusResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let active = true;

    async function init() {
      try {
        // Fetch genre data and api status in parallel
        const [genresRes, statusRes] = await Promise.allSettled([
          getGenres(),
          getApiStatus()
        ]);

        if (!active) return;

        const newMap: { [id: number]: string } = {};
        if (genresRes.status === "fulfilled") {
          genresRes.value.genres.forEach((genre) => {
            newMap[genre.id] = genre.name;
          });
        } else {
          console.warn("Gagal memuat daftar genre", genresRes.reason);
        }

        if (statusRes.status === "fulfilled") {
          setApiStatus(statusRes.value);
        } else {
          // If status endpoint fails, assume online or log error
          console.warn("Gagal memuat status API", statusRes.reason);
          setApiStatus({ online: true, upstream: "https://dayyapi.vercel.app" });
        }

        setGenresMap(newMap);
      } catch (err) {
        console.error("Error in GenreProvider", err);
      } finally {
        if (active) setIsLoading(false);
      }
    }

    init();

    // Check status periodically every 60 seconds
    const interval = setInterval(async () => {
      try {
        const statusRes = await getApiStatus();
        if (active) setApiStatus(statusRes);
      } catch (e) {
        console.warn("Status check failed", e);
      }
    }, 60000);

    return () => {
      active = false;
      clearInterval(interval);
    };
  }, []);

  return (
    <GenreContext.Provider value={{ genresMap, apiStatus, isLoading }}>
      {/* Show API Warning Banner if offline */}
      {apiStatus && !apiStatus.online && (
        <div className="bg-[#FF3B30] text-white py-2.5 px-4 text-center text-sm font-medium z-50 flex items-center justify-center gap-2 sticky top-0 shadow-lg animate-pulse" id="api-status-warning">
          <span className="w-2 h-2 rounded-full bg-white block animate-ping"></span>
          <span>⚠️ Server DayyAPI sedang gangguan atau luring (Offline). Beberapa konten streaming mungkin tidak tersedia saat ini.</span>
        </div>
      )}
      {children}
    </GenreContext.Provider>
  );
};
