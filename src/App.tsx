import React from "react";
import { HashRouter, Routes, Route, Link } from "react-router-dom";
import { GenreProvider } from "./components/GenreProvider";
import { Header } from "./components/Header";
import { Home } from "./pages/Home";
import { Browse } from "./pages/Browse";
import { Search } from "./pages/Search";
import { Detail } from "./pages/Detail";
import { Watch } from "./pages/Watch";
import { Play, Flame, Film, Tv, Compass, ShieldAlert } from "lucide-react";

export default function App() {
  return (
    <GenreProvider>
      <HashRouter>
        <div className="min-h-screen flex flex-col bg-background text-text-primary">
          
          {/* Global Sticky Navigation Header */}
          <Header />

          {/* Main Content Area */}
          <main className="flex-grow">
            <Routes>
              <Route path="/" element={<Home />} />
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

          {/* Minimalist Footer */}
          <footer className="bg-surface/30 border-t border-white/5 py-8 px-5 md:px-10 text-center text-xs text-text-secondary space-y-3" id="global-footer">
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

        </div>
      </HashRouter>
    </GenreProvider>
  );
}
