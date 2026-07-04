import React from "react";
import { HashRouter, Routes, Route, Link } from "react-router-dom";
import { GenreProvider } from "./components/GenreProvider";
import { BottomNav } from "./components/BottomNav";
import { Home } from "./pages/Home";
import { Ranking } from "./pages/Ranking";
import { Mine } from "./pages/Mine";
import { Browse } from "./pages/Browse";
import { Search } from "./pages/Search";
import { Detail } from "./pages/Detail";
import { Watch } from "./pages/Watch";
import { Onboarding } from "./pages/Onboarding";
import { Play, Flame, Film, Tv, Compass, ShieldAlert } from "lucide-react";

const ONBOARDING_SESSION_KEY = "watchly_onboarding_seen";

// Menampilkan splash screen (Onboarding) sekali per sesi browser di path "/".
// Setelah pernah dilihat pada sesi yang sama, langsung tampilkan Home.
// sessionStorage otomatis kosong lagi saat tab/browser ditutup.
function RootGate() {
  const [seen] = React.useState(() => {
    try {
      return sessionStorage.getItem(ONBOARDING_SESSION_KEY) === "1";
    } catch {
      return true; // kalau storage tidak tersedia, jangan blokir akses
    }
  });

  return seen ? <Home /> : <Onboarding />;
}

export default function App() {
  return (
    <GenreProvider>
      <HashRouter>
        <div className="min-h-screen flex flex-col bg-background text-text-primary">

          {/* Main Content Area */}
          <main className="flex-grow pb-24">
            <Routes>
              <Route path="/" element={<RootGate />} />
              <Route path="/ranking" element={<Ranking />} />
              <Route path="/mine" element={<Mine />} />
              <Route path="/browse/:category" element={<Browse />} />
              <Route path="/search" element={<Search />} />
              <Route path="/:type/:id" element={<Detail />} />
              <Route path="/watch/:type/:id" element={<Watch />} />
              
              {/* Fallback Error 404 Route */}
              <Route 
                path="*" 
                element={
                  <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-5">
                    <ShieldAlert className="w-14 h-14 text-primary mb-4 animate-bounce" />
                    <h2 className="text-xl font-bold">Halaman Tidak Ditemukan (404)</h2>
                    <p className="text-sm text-text-secondary mt-2 max-w-sm">
                      Maaf, halaman yang Anda cari tidak tersedia atau telah dipindahkan.
                    </p>
                    <Link to="/" className="mt-6 px-6 py-2.5 bg-primary text-white rounded-full text-xs font-semibold hover:bg-primary/95 transition-all">
                      Kembali ke Beranda
                    </Link>
                  </div>
                } 
              />
            </Routes>
          </main>

          {/* Minimalist Footer (desktop only — mobile uses bottom tab nav) */}
          <footer className="hidden md:block bg-surface/30 border-t border-white/5 py-8 px-5 md:px-10 text-center text-xs text-text-secondary space-y-3" id="global-footer">
            <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 font-bold tracking-wide uppercase text-[10px] text-text-secondary">
              <Link to="/browse/trending" className="hover:text-primary transition-colors">Trending</Link>
              <Link to="/browse/popular" className="hover:text-primary transition-colors">Terpopuler</Link>
              <Link to="/browse/now-playing" className="hover:text-primary transition-colors">Sedang Diputar</Link>
              <Link to="/browse/upcoming" className="hover:text-primary transition-colors">Mendatang</Link>
              <Link to="/search" className="hover:text-primary transition-colors">Cari</Link>
            </div>
            
            <p className="max-w-md mx-auto text-[11px] leading-relaxed">
              Materi film, gambar, dan detail bersumber dari TMDB melalui DayyAPI. Hak cipta seluruh konten milik produser masing-masing.
            </p>
            
            <p className="text-[10px] text-text-secondary/60">
              © {new Date().getFullYear()} Watchly. Dibuat dengan dedikasi penuh untuk Sobat Nonton.
            </p>
          </footer>

          {/* Global Bottom Tab Navigation (mobile app style) */}
          <BottomNav />

        </div>
      </HashRouter>
    </GenreProvider>
  );
}
