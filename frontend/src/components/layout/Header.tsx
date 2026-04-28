import { Link } from 'react-router-dom';
import { Search, ChevronDown, Menu, Flame } from 'lucide-react';
import logo from '../../assets/sanmahot.png';
import { NAV_LINKS, QUICK_PLATFORMS } from './constants';

interface HeaderProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  handleSearch: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  setMobileMenuOpen: (open: boolean) => void;
}

export default function Header({
  searchQuery,
  setSearchQuery,
  handleSearch,
  setMobileMenuOpen,
}: HeaderProps) {
  return (
    <div className="fixed inset-x-0 z-50 flex justify-center px-4 lg:px-8 pointer-events-none max-w-7xl mx-auto">
      <div className="pointer-events-auto w-full max-w-7xl relative group/navbar">
        {/* Animated Glow Border */}
        <div className="absolute -inset-[1px] bg-gradient-to-r from-orange-500/50 via-pink-500/50 to-orange-500/50 rounded-[2rem] opacity-30 group-hover/navbar:opacity-60 blur-md transition duration-1000 group-hover/navbar:duration-300"></div>

        <header className="relative w-full bg-[#0B1120]/80 backdrop-blur-3xl border border-white/10 shadow-[0_30px_60px_-15px_rgba(0,0,0,0.6)] rounded-[2rem] transition-all duration-300">
          {/* Ambient Aurora Orbs Container */}
          <div className="absolute inset-0 overflow-hidden rounded-[2rem] pointer-events-none">
            <div className="absolute top-0 left-[20%] w-[500px] h-[500px] bg-orange-500/10 rounded-full blur-[80px] -translate-y-1/2 pointer-events-none"></div>
            <div className="absolute bottom-0 right-[20%] w-[500px] h-[500px] bg-pink-500/10 rounded-full blur-[80px] translate-y-1/2 pointer-events-none"></div>
          </div>

          <div className="px-5 lg:px-8 h-16 md:h-[72px] flex items-center justify-between gap-4 relative z-10">
            {/* Logo */}
            <Link to="/" className="flex items-center shrink-0 group flex-1">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-orange-500 to-pink-500 blur-md opacity-0 group-hover:opacity-60 transition-opacity duration-500 rounded-full"></div>
                <img
                  src={logo}
                  alt="SanMaHot"
                  className="h-8 md:h-11 w-auto object-contain relative z-10 group-hover:scale-105 transition-transform duration-500 ease-out"
                />
              </div>
              <span className="font-black tracking-tighter text-white hidden sm:block drop-shadow-lg gradient-text-rainbow">
                SANMAHOT
              </span>
            </Link>

            {/* Nav Menu (Desktop) */}
            <nav className="hidden lg:flex items-center gap-1.5 bg-white/5 p-1.5 rounded-full shadow-inner backdrop-blur-md shrink-0">
              {NAV_LINKS.slice(0, 2).map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  className={`px-4 xl:px-6 py-2 rounded-full font-bold text-sm transition-all flex items-center gap-2 whitespace-nowrap ${
                    link.isHot
                      ? 'text-orange-200 hover:text-white hover:bg-orange-500/20 hover:shadow-[0_0_15px_rgba(249,115,22,0.3)]'
                      : 'text-gray-300 hover:text-white hover:bg-white/10 hover:shadow-[0_0_15px_rgba(255,255,255,0.1)]'
                  } group`}
                >
                  {link.label}
                  {link.isHot && (
                    <Flame className="w-4 h-4 text-orange-500 group-hover:scale-125 transition-transform duration-300" />
                  )}
                </Link>
              ))}

              {/* Dropdown Menu */}
              <div className="relative group">
                <button className="px-4 xl:px-6 py-2 rounded-full font-bold text-sm text-gray-300 hover:text-white hover:bg-white/10 hover:shadow-[0_0_15_rgba(255,255,255,0.1)] transition-all flex items-center gap-2 whitespace-nowrap">
                  Mã Giảm Giá
                  <ChevronDown className="w-3.5 h-3.5 opacity-60 group-hover:rotate-180 transition-transform duration-300" />
                </button>

                {/* Dropdown Panel */}
                <div className="absolute top-full left-1/2 -translate-x-1/2 pt-3 w-[260px] opacity-0 translate-y-4 pointer-events-none group-hover:opacity-100 group-hover:translate-y-0 group-hover:pointer-events-auto transition-all duration-300 ease-out z-50">
                  <div className="bg-[#0B1120]/95 backdrop-blur-3xl border border-white/10 shadow-[0_20px_40px_-15px_rgba(0,0,0,0.8)] rounded-2xl p-2 relative overflow-hidden">
                    {QUICK_PLATFORMS.map((item, idx) => (
                      <Link
                        key={idx}
                        to={`/coupons${item.to}`}
                        className="flex items-center px-4 py-3 rounded-xl hover:bg-white/10 text-gray-300 hover:text-white transition-colors text-sm font-semibold group/item whitespace-nowrap"
                      >
                        <span
                          className={`w-2 h-2 rounded-full ${item.color} mr-3 group-hover/item:scale-150 group-hover/item:shadow-[0_0_10px_currentColor] transition-all`}
                        ></span>
                        Mã Giảm Giá <span className="ml-1 text-white">{item.name}</span>
                      </Link>
                    ))}
                    <div className="h-px bg-white/10 my-2 mx-3"></div>
                    <Link
                      to="/coupons"
                      className="flex items-center justify-center px-4 py-3 rounded-xl hover:bg-white/10 text-orange-400 hover:text-orange-300 transition-colors text-sm font-bold whitespace-nowrap"
                    >
                      Xem tất cả mã giảm giá →
                    </Link>
                  </div>
                </div>
              </div>

              {NAV_LINKS.slice(2).map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  className="px-4 xl:px-6 py-2 rounded-full font-bold text-sm text-gray-300 hover:text-white hover:bg-white/10 hover:shadow-[0_0_15px_rgba(255,255,255,0.1)] transition-all flex items-center gap-2 whitespace-nowrap"
                >
                  {link.label}
                </Link>
              ))}
            </nav>

            {/* Search & Mobile Menu Toggle */}
            <div className="flex items-center justify-end gap-3 flex-1">
              {/* Search Bar */}
              <div className="hidden md:flex items-center bg-[#1e293b]/50 rounded-full px-4 py-2.5 border border-white/10 hover:border-white/20 hover:bg-white/5 focus-within:border-orange-500/50 focus-within:bg-[#1e293b] focus-within:shadow-[0_0_20px_rgba(249,115,22,0.2)] transition-all ease-out duration-300 w-56 lg:w-64 group">
                <Search className="w-4 h-4 text-gray-400 group-focus-within:text-orange-400 transition-colors" />
                <input
                  type="text"
                  placeholder="Tìm voucher..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={handleSearch}
                  className="bg-transparent border-none focus:ring-0 text-sm ml-2 w-full outline-none text-white font-medium placeholder:text-gray-500"
                />
              </div>

              {/* Mobile Toggle Button */}
              <button
                className="lg:hidden w-11 h-11 rounded-full bg-white/10 border border-white/5 flex items-center justify-center hover:bg-white/20 text-white transition-colors active:scale-95"
                onClick={() => setMobileMenuOpen(true)}
              >
                <Menu className="w-5 h-5" />
              </button>
            </div>
          </div>
        </header>
      </div>
    </div>
  );
}
