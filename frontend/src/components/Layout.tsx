import { Outlet, Link, useNavigate } from 'react-router-dom';
import { Search, Home, ShoppingCart, ChevronDown, Menu, Flame, FileText } from 'lucide-react';
import { useState } from 'react';

import logo from '../assets/sanmahot.png';

export default function Layout() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  const handleSearch = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
    }
  };

  return (
    <div className="min-h-screen font-sans antialiased flex flex-col text-gray-800">
      {/* Header - Floating Dark Island with Aurora Glow */}
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
                <span className="font-black tracking-tighter text-white hidden sm:block drop-shadow-lg">
                  SANMAHOT
                </span>
              </Link>

              {/* Nav Menu (Desktop) */}
              <nav className="hidden lg:flex items-center gap-1.5 bg-white/5 p-1.5 rounded-full shadow-inner backdrop-blur-md shrink-0">
                <Link
                  to="/"
                  className="px-4 xl:px-6 py-2 rounded-full font-bold text-sm text-gray-300 hover:text-white hover:bg-white/10 hover:shadow-[0_0_15px_rgba(255,255,255,0.1)] transition-all flex items-center gap-2 whitespace-nowrap"
                >
                  Trang Chủ
                </Link>

                <Link
                  to="/deals"
                  className="px-4 xl:px-6 py-2 rounded-full font-bold text-sm text-orange-200 hover:text-white hover:bg-orange-500/20 hover:shadow-[0_0_15px_rgba(249,115,22,0.3)] transition-all flex items-center gap-2 group whitespace-nowrap"
                >
                  Deal Ngon
                  <Flame className="w-4 h-4 text-orange-500 group-hover:scale-125 transition-transform duration-300" />
                </Link>

                {/* Dropdown Menu */}
                <div className="relative group">
                  <button className="px-4 xl:px-6 py-2 rounded-full font-bold text-sm text-gray-300 hover:text-white hover:bg-white/10 hover:shadow-[0_0_15px_rgba(255,255,255,0.1)] transition-all flex items-center gap-2 whitespace-nowrap">
                    Mã Giảm Giá
                    <ChevronDown className="w-3.5 h-3.5 opacity-60 group-hover:rotate-180 transition-transform duration-300" />
                  </button>

                  {/* Dropdown Panel */}
                  <div className="absolute top-full left-1/2 -translate-x-1/2 pt-3 w-[260px] opacity-0 translate-y-4 pointer-events-none group-hover:opacity-100 group-hover:translate-y-0 group-hover:pointer-events-auto transition-all duration-300 ease-out z-50">
                    <div className="bg-[#0B1120]/95 backdrop-blur-3xl border border-white/10 shadow-[0_20px_40px_-15px_rgba(0,0,0,0.8)] rounded-2xl p-2 relative overflow-hidden">
                      {[
                        { to: '?platform=shopee', name: 'Shopee', color: 'bg-orange-500' },
                        { to: '?platform=lazada', name: 'Lazada', color: 'bg-blue-600' },
                        { to: '?platform=tiki', name: 'Tiki', color: 'bg-sky-500' },
                      ].map((item, idx) => (
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

                <Link
                  to="/tin-khuyen-mai"
                  className="px-4 xl:px-6 py-2 rounded-full font-bold text-sm text-gray-300 hover:text-white hover:bg-white/10 hover:shadow-[0_0_15px_rgba(255,255,255,0.1)] transition-all flex items-center gap-2 whitespace-nowrap"
                >
                  Tin Khuyến Mãi
                </Link>

                <Link
                  to="/huong-dan"
                  className="px-4 xl:px-6 py-2 rounded-full font-bold text-sm text-gray-300 hover:text-white hover:bg-white/10 hover:shadow-[0_0_15px_rgba(255,255,255,0.1)] transition-all flex items-center gap-2 whitespace-nowrap"
                >
                  Hướng Dẫn
                </Link>
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

      {/* Mobile Sidebar Navigation */}
      <div
        className={`fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] lg:hidden transition-opacity duration-300 ${
          mobileMenuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
        onClick={() => setMobileMenuOpen(false)}
      >
        <div
          className={`absolute right-0 top-0 bottom-0 w-[85vw] max-w-[320px] bg-white shadow-2xl p-6 transition-transform duration-500 ease-out ${
            mobileMenuOpen ? 'translate-x-0' : 'translate-x-full'
          }`}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex items-center justify-between mb-8 pb-4 border-b border-gray-100">
            <div className="flex items-center">
              <img src={logo} alt="SanMaHot" className="h-8 w-auto" />
              <span className="ml-2 text-xl font-black bg-clip-text text-transparent bg-gradient-to-r from-orange-500 to-pink-500">
                SANMAHOT
              </span>
            </div>
            <button
              className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 text-gray-600 hover:bg-red-100 hover:text-red-500 transition-colors"
              onClick={() => setMobileMenuOpen(false)}
            >
              ✕
            </button>
          </div>

          {/* Mobile Search */}
          <div className="flex items-center bg-gray-50 rounded-2xl px-4 py-3 mb-8 border border-gray-100 focus-within:border-orange-500 focus-within:bg-white transition-all">
            <Search className="w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Tìm mã giảm giá..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => {
                handleSearch(e);
                if (e.key === 'Enter') setMobileMenuOpen(false);
              }}
              className="bg-transparent border-none focus:ring-0 text-base ml-2 w-full outline-none text-gray-800"
            />
          </div>

          {/* Mobile Links */}
          <div className="space-y-2">
            <Link
              to="/"
              className="flex items-center gap-3 p-4 rounded-2xl text-gray-700 font-bold hover:bg-orange-50 hover:text-orange-600 transition-all active:scale-95"
              onClick={() => setMobileMenuOpen(false)}
            >
              <Home className="w-5 h-5" /> Trang Chủ
            </Link>
            <Link
              to="/deals"
              className="flex items-center gap-3 p-4 rounded-2xl text-gray-700 font-bold hover:bg-orange-50 hover:text-orange-600 transition-all active:scale-95"
              onClick={() => setMobileMenuOpen(false)}
            >
              <Flame className="w-5 h-5 text-orange-500" /> Deal Ngon
            </Link>

            <div className="pt-4 pb-2">
              <div className="flex items-center gap-3 px-4 py-2 font-bold text-gray-400 uppercase text-xs tracking-wider">
                Mã Giảm Giá
              </div>
              <div className="grid grid-cols-2 gap-2 mt-2">
                <Link
                  to="/coupons?platform=shopee"
                  className="bg-gray-50 p-3 rounded-xl font-semibold text-sm text-center border border-gray-100 hover:border-orange-300 hover:text-orange-600 transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Shopee
                </Link>
                <Link
                  to="/coupons?platform=lazada"
                  className="bg-gray-50 p-3 rounded-xl font-semibold text-sm text-center border border-gray-100 hover:border-blue-400 hover:text-blue-600 transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Lazada
                </Link>
                <Link
                  to="/coupons?platform=tiki"
                  className="bg-gray-50 p-3 rounded-xl font-semibold text-sm text-center border border-gray-100 hover:border-sky-400 hover:text-sky-600 transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Tiki
                </Link>
                <Link
                  to="/coupons"
                  className="bg-orange-50 p-3 rounded-xl font-semibold text-sm text-center border border-orange-200 text-orange-600 transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Xem tất cả
                </Link>
              </div>
            </div>

            <Link
              to="/tin-khuyen-mai"
              className="flex items-center gap-3 p-4 rounded-2xl text-gray-700 font-bold hover:bg-orange-50 hover:text-orange-600 transition-all active:scale-95 mt-4"
              onClick={() => setMobileMenuOpen(false)}
            >
              <ShoppingCart className="w-5 h-5" /> Tin Khuyến Mãi
            </Link>
            <Link
              to="/huong-dan"
              className="flex items-center gap-3 p-4 rounded-2xl text-gray-700 font-bold hover:bg-orange-50 hover:text-orange-600 transition-all active:scale-95"
              onClick={() => setMobileMenuOpen(false)}
            >
              <FileText className="w-5 h-5" /> Hướng Dẫn
            </Link>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="container max-w-7xl mx-auto px-4 lg:px-8 flex-1 pt-28 md:pt-36 pb-12">
        <Outlet />
      </main>

      <footer
        className="bg-white border-t border-gray-100 mt-auto py-12"
        style={{ backgroundColor: '#001c38' }}
      >
        <div className="container max-w-7xl mx-auto px-4 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mb-10 text-center md:text-left">
            <div className="space-y-4">
              <div className="flex items-center justify-center md:justify-start">
                <img src={logo} alt="SanMaHot" className="h-10 w-auto" />
                <span className="ml-2 text-xl font-black tracking-tighter gradient-text-rainbow">
                  SANMAHOT
                </span>
              </div>
              <p className="text-gray-500 text-sm leading-relaxed max-w-xs mx-auto md:mx-0">
                Săn mã giảm giá, voucher và deal hot nhất từ Shopee, Lazada, Tiki,... Tiết kiệm tối
                đa cho mỗi đơn hàng của bạn.
              </p>
            </div>
            <div>
              <h4 className="font-bold text-white mb-4">Mã Giảm Giá</h4>
              <ul className="space-y-2 text-sm text-gray-500">
                <li>
                  <Link to="/coupons?platform=shopee" className="hover:text-primary">
                    Mã giảm giá Shopee
                  </Link>
                </li>
                <li>
                  <Link to="/coupons?platform=lazada" className="hover:text-primary">
                    Mã giảm giá Lazada
                  </Link>
                </li>
                <li>
                  <Link to="/coupons?platform=tiki" className="hover:text-primary">
                    Mã giảm giá Tiki
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-white mb-4">Thông Tin</h4>
              <ul className="space-y-2 text-sm text-gray-500">
                <li>
                  <Link to="/huong-dan" className="hover:text-primary">
                    Hướng dẫn sử dụng
                  </Link>
                </li>
                <li>
                  <Link to="/tin-khuyen-mai" className="hover:text-primary">
                    Tin khuyến mãi
                  </Link>
                </li>
                <li>
                  <Link to="/about" className="hover:text-primary">
                    Về chúng tôi
                  </Link>
                </li>
              </ul>
            </div>
          </div>
          <div className="pt-8 border-t border-gray-50 text-center text-xs font-medium text-gray-400">
            © 2026 SanMaHot. All rights reserved. Built with premium aesthetics.
          </div>
        </div>
      </footer>
    </div>
  );
}
