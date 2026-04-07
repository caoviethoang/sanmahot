import { Outlet, Link } from 'react-router-dom';
import { Search, Home, Tag, List, ShoppingCart, ChevronDown, Menu } from 'lucide-react';
import { useState } from 'react';
import { Button } from './ui/button';

import logo from '../assets/sanmahot.png';

export default function Layout() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#fafafa] font-sans antialiased flex flex-col text-gray-800">
      {/* Header */}
      <header className="glass-header transform-gpu shadow-sm">
        <div className="container max-w-7xl mx-auto px-4 lg:px-8 h-18 md:h-22 flex items-center justify-between">
          
          {/* Logo */}
          <Link to="/" className="flex items-center shrink-0 hover:opacity-90 transition-opacity">
            <img src={logo} alt="SanMaHot" className="h-10 md:h-14 w-auto object-contain" />
            <span className="ml-2 text-xl md:text-2xl font-black tracking-tighter gradient-text-rainbow hidden sm:block">SANMAHOT</span>
          </Link>

          {/* Nav Menu (Desktop) */}
          <nav className="hidden lg:flex items-center gap-1 xl:gap-2 text-gray-500 font-semibold text-[14px]">
            <Link to="/" className="px-4 py-2 rounded-xl hover:bg-red-50 hover:text-primary transition-all flex items-center gap-2">
              <Home className="w-4 h-4" /> Trang Chủ
            </Link>

            {/* Dropdown Menu */}
            <div className="relative group">
              <button className="px-4 py-2 rounded-xl hover:bg-red-50 hover:text-primary transition-all flex items-center gap-2">
                <Tag className="w-4 h-4" /> Mã Giảm Giá <ChevronDown className="w-3.5 h-3.5 opacity-60 ml-0.5 group-hover:rotate-180 transition-transform" />
              </button>
              
              <div className="absolute top-full left-0 mt-1 bg-white/95 backdrop-blur-xl border border-gray-100 shadow-2xl rounded-2xl min-w-[240px] opacity-0 translate-y-2 invisible group-hover:opacity-100 group-hover:translate-y-0 group-hover:visible transition-all duration-300 z-50 py-3 overflow-hidden">
                 <Link to="/shopee" className="flex items-center px-6 py-3 hover:bg-red-50 text-gray-600 hover:text-primary transition-colors text-sm">
                   <span className="w-1.5 h-1.5 rounded-full bg-orange-500 mr-3"></span> Mã Giảm Giá Shopee
                 </Link>
                 <Link to="/lazada" className="flex items-center px-6 py-3 hover:bg-red-50 text-gray-600 hover:text-primary transition-colors text-sm">
                   <span className="w-1.5 h-1.5 rounded-full bg-blue-700 mr-3"></span> Mã Giảm Giá Lazada
                 </Link>
                 <Link to="/tiki" className="flex items-center px-6 py-3 hover:bg-red-50 text-gray-600 hover:text-primary transition-colors text-sm">
                   <span className="w-1.5 h-1.5 rounded-full bg-sky-500 mr-3"></span> Mã Giảm Giá Tiki
                 </Link>
                 <div className="h-px bg-gray-50 my-1"></div>
                 <Link to="/shopeefood" className="flex items-center px-6 py-3 hover:bg-red-50 text-gray-600 hover:text-primary transition-colors text-sm">
                   <span className="w-1.5 h-1.5 rounded-full bg-red-500 mr-3"></span> ShopeeFood
                 </Link>
                 <Link to="/nguyenkim" className="flex items-center px-6 py-3 hover:bg-red-50 text-gray-600 hover:text-primary transition-colors text-sm">
                   <span className="w-1.5 h-1.5 rounded-full bg-red-600 mr-3"></span> Nguyễn Kim
                 </Link>
              </div>
            </div>

            <Link to="/huong-dan" className="px-4 py-2 rounded-xl hover:bg-red-50 hover:text-primary transition-all flex items-center gap-2">
              <List className="w-4 h-4" /> Hướng Dẫn
            </Link>
            
            <Link to="/tin-khuyen-mai" className="px-4 py-2 rounded-xl hover:bg-red-50 hover:text-primary transition-all flex items-center gap-2">
              <ShoppingCart className="w-4 h-4" /> Tin Khuyến Mãi
            </Link>
          </nav>

          {/* Search bar (Desktop) & CTA */}
          <div className="flex items-center gap-4">
            <div className="hidden md:flex items-center bg-gray-50 rounded-full px-4 py-2 border border-gray-200 focus-within:border-primary/40 focus-within:bg-white focus-within:shadow-[0_0_0_4px_rgba(239,68,68,0.1)] transition-all w-48 lg:w-80">
              <Search className="w-4 h-4 text-gray-400 shrink-0" />
              <input type="text" placeholder="Tìm mã giảm giá..." className="bg-transparent border-none focus:ring-0 text-sm ml-2 w-full outline-none text-gray-700" />
            </div>
            
            <Button variant="ghost" size="icon" className="lg:hidden hover:bg-red-50" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
              <Menu className="w-6 h-6 text-gray-700" />
            </Button>
          </div>
        </div>

        {/* Mobile menu overlay */}
        {mobileMenuOpen && (
           <div className="lg:hidden absolute top-full left-0 w-full bg-white border-t border-gray-100 p-6 space-y-4 shadow-2xl animate-in slide-in-from-top duration-300">
              <Link to="/" className="block text-lg font-bold text-gray-800" onClick={() => setMobileMenuOpen(false)}>Trang Chủ</Link>
              <Link to="/shopee" className="block text-lg font-bold text-primary" onClick={() => setMobileMenuOpen(false)}>Mã Giảm Giá</Link>
              <Link to="/tin-khuyen-mai" className="block text-lg font-bold text-gray-800" onClick={() => setMobileMenuOpen(false)}>Tin Khuyến Mãi</Link>
              <Link to="/huong-dan" className="block text-lg font-bold text-gray-800" onClick={() => setMobileMenuOpen(false)}>Hướng Dẫn</Link>
           </div>
        )}
      </header>

      {/* Main Content */}
      <main className="container max-w-7xl mx-auto px-4 lg:px-8 py-8 lg:py-16 flex-1">
        <Outlet />
      </main>

      <footer className="bg-white border-t border-gray-100 mt-auto py-12" style={{backgroundColor: '#001c38'}}>
        <div className="container max-w-7xl mx-auto px-4 lg:px-8">
           <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mb-10 text-center md:text-left">
              <div className="space-y-4">
                 <div className="flex items-center justify-center md:justify-start">
                    <img src={logo} alt="SanMaHot" className="h-10 w-auto" />
                    <span className="ml-2 text-xl font-black tracking-tighter gradient-text-rainbow">SANMAHOT</span>
                 </div>
                 <p className="text-gray-500 text-sm leading-relaxed max-w-xs mx-auto md:mx-0">
                    Săn mã giảm giá, voucher và deal hot nhất từ Shopee, Lazada, Tiki. Tiết kiệm tối đa cho mỗi đơn hàng của bạn.
                 </p>
              </div>
              <div>
                 <h4 className="font-bold text-white mb-4">Mã Giảm Giá</h4>
                 <ul className="space-y-2 text-sm text-gray-500">
                    <li><Link to="/shopee" className="hover:text-primary">Mã giảm giá Shopee</Link></li>
                    <li><Link to="/lazada" className="hover:text-primary">Mã giảm giá Lazada</Link></li>
                    <li><Link to="/tiki" className="hover:text-primary">Mã giảm giá Tiki</Link></li>
                 </ul>
              </div>
              <div>
                 <h4 className="font-bold text-white mb-4">Thông Tin</h4>
                 <ul className="space-y-2 text-sm text-gray-500">
                    <li><Link to="/huong-dan" className="hover:text-primary">Hướng dẫn sử dụng</Link></li>
                    <li><Link to="/tin-khuyen-mai" className="hover:text-primary">Tin khuyến mãi</Link></li>
                    <li><Link to="/about" className="hover:text-primary">Về chúng tôi</Link></li>
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
