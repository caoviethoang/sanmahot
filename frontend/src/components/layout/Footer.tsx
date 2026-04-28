import { Link } from 'react-router-dom';
import logo from '../../assets/sanmahot.png';

export default function Footer() {
  return (
    <footer className="bg-zinc-950 border-t border-white/5 mt-auto py-12">
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
              Săn mã giảm giá, voucher và deal hot nhất từ Shopee, Lazada, Tiki,... Tiết kiệm tối đa
              cho mỗi đơn hàng của bạn.
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
        <div className="pt-8 border-t border-white/5 text-center text-xs font-medium text-gray-500">
          © {new Date().getFullYear()} SanMaHot. All rights reserved. Built with premium aesthetics.
        </div>
      </div>
    </footer>
  );
}
