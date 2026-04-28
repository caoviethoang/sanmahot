import { Link } from 'react-router-dom';
import { Search, Home, ShoppingCart, Flame, FileText } from 'lucide-react';
import logo from '../../assets/sanmahot.png';
import { NAV_LINKS, QUICK_PLATFORMS } from './constants';

interface MobileSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  handleSearch: (e: React.KeyboardEvent<HTMLInputElement>) => void;
}

export default function MobileSidebar({
  isOpen,
  onClose,
  searchQuery,
  setSearchQuery,
  handleSearch,
}: MobileSidebarProps) {
  return (
    <div
      className={`fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] lg:hidden transition-opacity duration-300 ${
        isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
      }`}
      onClick={onClose}
    >
      <div
        className={`absolute right-0 top-0 bottom-0 w-[85vw] max-w-[320px] bg-white shadow-2xl p-6 transition-transform duration-500 ease-out ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
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
            onClick={onClose}
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
              if (e.key === 'Enter') onClose();
            }}
            className="bg-transparent border-none focus:ring-0 text-base ml-2 w-full outline-none text-gray-800"
          />
        </div>

        {/* Mobile Links */}
        <div className="space-y-2">
          {NAV_LINKS.slice(0, 2).map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className="flex items-center gap-3 p-4 rounded-2xl text-gray-700 font-bold hover:bg-orange-50 hover:text-orange-600 transition-all active:scale-95"
              onClick={onClose}
            >
              {link.to === '/' ? (
                <Home className="w-5 h-5" />
              ) : (
                <Flame className="w-5 h-5 text-orange-500" />
              )}
              {link.label}
            </Link>
          ))}

          <div className="pt-4 pb-2">
            <div className="flex items-center gap-3 px-4 py-2 font-bold text-gray-400 uppercase text-xs tracking-wider">
              Mã Giảm Giá
            </div>
            <div className="grid grid-cols-2 gap-2 mt-2">
              {QUICK_PLATFORMS.map((item, idx) => (
                <Link
                  key={idx}
                  to={`/coupons${item.to}`}
                  className={`p-3 rounded-xl font-semibold text-sm text-center border transition-colors ${
                    item.name === 'Shopee'
                      ? 'bg-orange-50 border-orange-100 text-orange-600'
                      : item.name === 'Lazada'
                        ? 'bg-blue-50 border-blue-100 text-blue-600'
                        : 'bg-sky-50 border-sky-100 text-sky-600'
                  }`}
                  onClick={onClose}
                >
                  {item.name}
                </Link>
              ))}
              <Link
                to="/coupons"
                className="bg-orange-50 p-3 rounded-xl font-semibold text-sm text-center border border-orange-200 text-orange-600 transition-colors"
                onClick={onClose}
              >
                Xem tất cả
              </Link>
            </div>
          </div>

          {NAV_LINKS.slice(2).map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className="flex items-center gap-3 p-4 rounded-2xl text-gray-700 font-bold hover:bg-orange-50 hover:text-orange-600 transition-all active:scale-95 mt-4"
              onClick={onClose}
            >
              {link.to === '/tin-khuyen-mai' ? (
                <ShoppingCart className="w-5 h-5" />
              ) : (
                <FileText className="w-5 h-5" />
              )}
              {link.label}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
