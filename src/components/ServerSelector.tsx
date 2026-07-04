import React, { useState, useEffect } from "react";
import { getServers, ServerItem } from "../api/dayyapi";
import { Play, Server, AlertCircle } from "lucide-react";
import { Skeleton } from "./Skeleton";

interface ServerSelectorProps {
  type: "movie" | "tv";
  id: string | number;
}

export const ServerSelector: React.FC<ServerSelectorProps> = ({ type, id }) => {
  const [servers, setServers] = useState<ServerItem[]>([]);
  const [selectedServer, setSelectedServer] = useState<ServerItem | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    setIsLoading(true);
    setError(null);

    async function fetchServerList() {
      try {
        const data = await getServers(type, id);
        if (!active) return;

        if (data && data.servers && data.servers.length > 0) {
          setServers(data.servers);
          setSelectedServer(data.servers[0]); // Default to first server
        } else {
          // If no servers are found in the response, we construct fallback embeds!
          // This is incredibly robust in case upstream TMDB proxy doesn't return list
          const fallbacks: ServerItem[] = [
            { name: "VIDSRC", url: `https://vidsrc.to/embed/${type}/${id}` },
            { name: "VIDEASY", url: `https://player.vidsrc.to/embed/${type}/${id}` }
          ];
          setServers(fallbacks);
          setSelectedServer(fallbacks[0]);
        }
      } catch (err) {
        console.warn("Failed to load servers, building default fallbacks:", err);
        if (!active) return;
        // Build fallback standard embeds directly so the streaming feature ALWAYS works
        const fallbacks: ServerItem[] = [
          { name: "VIDSRC", url: `https://vidsrc.to/embed/${type}/${id}` },
          { name: "VIDLINK", url: `https://vidlink.pro/embed/${type}/${id}` }
        ];
        setServers(fallbacks);
        setSelectedServer(fallbacks[0]);
      } finally {
        if (active) setIsLoading(false);
      }
    }

    fetchServerList();

    return () => {
      active = false;
    };
  }, [type, id]);

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="w-full aspect-video rounded-2xl bg-surface animate-shimmer" />
        <div className="flex gap-2">
          <Skeleton className="h-10 w-24 rounded-full" />
          <Skeleton className="h-10 w-24 rounded-full" />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 w-full" id="streaming-player-section">
      {/* Video Iframe Container */}
      <div className="relative w-full aspect-video rounded-2xl overflow-hidden bg-black border border-white/5 shadow-2xl">
        {selectedServer ? (
          <iframe
            src={selectedServer.url}
            title={`Streaming Player - ${selectedServer.name}`}
            className="w-full h-full border-0 absolute inset-0"
            allowFullScreen
            referrerPolicy="no-referrer"
            scrolling="no"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center p-6 text-center text-text-secondary bg-[#080b13]">
            <AlertCircle className="w-12 h-12 text-[#FF3B30] mb-3 animate-bounce" />
            <p className="font-semibold text-text-primary text-base">Streaming Server Tidak Ditemukan</p>
            <p className="text-xs mt-1">Gagal memuat player video untuk konten ini.</p>
          </div>
        )}
      </div>

      {/* Server/Mirror list switcher */}
      <div className="bg-surface rounded-2xl p-4 border border-white/5">
        <div className="flex items-center gap-2 mb-3">
          <Server className="w-4 h-4 text-primary animate-pulse" />
          <h3 className="text-sm font-semibold text-text-primary uppercase tracking-wider">
            Pilih Server Pemutaran
          </h3>
        </div>

        <div className="flex flex-wrap gap-2.5">
          {servers.map((server, idx) => {
            const isSelected = selectedServer?.url === server.url;
            return (
              <button
                key={idx}
                onClick={() => setSelectedServer(server)}
                className={`px-4 py-2.5 rounded-full text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer hover:scale-103 active:scale-95 ${
                  isSelected
                    ? "bg-primary text-white shadow-lg shadow-primary/20"
                    : "bg-white/5 text-text-secondary hover:bg-white/10 hover:text-white"
                }`}
              >
                <Play className={`w-3 h-3 ${isSelected ? "fill-white text-white" : ""}`} />
                <span>{server.name}</span>
                {isSelected && (
                  <span className="w-1.5 h-1.5 rounded-full bg-white block animate-ping ml-1" />
                )}
              </button>
            );
          })}
        </div>

        <div className="mt-4 pt-3.5 border-t border-white/5 flex flex-col gap-1">
          <p className="text-[11px] text-text-secondary leading-relaxed">
            💡 <span className="text-text-primary">Tips:</span> Jika pemutaran lambat atau macet, silakan coba beralih ke server cermin (mirror server) lain di atas. Beberapa server mungkin memiliki pemutar iklan bawaan dari pihak ketiga, silakan tutup jika muncul pop-up.
          </p>
        </div>
      </div>
    </div>
  );
};
