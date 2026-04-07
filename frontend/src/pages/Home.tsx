import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import {
  ShopeeLogo, LazadaLogo, TikiLogo, ShopeeFoodLogo, SendoLogo,
  NguyenKimLogo, DienMayXanhLogo, FahasaLogo, GrabLogo,
  FptShopLogo, WatsonsLogo, VnpayLogo
} from '../components/BrandLogos';

const BRANDS = [
  { id: 'shopee',      name: 'Shopee',         path: '/shopee',      Logo: ShopeeLogo },
  { id: 'lazada',      name: 'Lazada',          path: '/lazada',      Logo: LazadaLogo },
  { id: 'tiki',        name: 'Tiki',            path: '/tiki',        Logo: TikiLogo },
  { id: 'shopeefood',  name: 'ShopeeFood',      path: '/shopeefood',  Logo: ShopeeFoodLogo },
  { id: 'sendo',       name: 'Sendo.vn',        path: '/sendo',       Logo: SendoLogo },
  { id: 'nguyenkim',   name: 'Nguyễn Kim',      path: '/nguyenkim',   Logo: NguyenKimLogo },
  { id: 'dienmayxanh', name: 'Điện Máy Xanh',   path: '/dienmayxanh', Logo: DienMayXanhLogo },
  { id: 'fahasa',      name: 'Fahasa',           path: '/fahasa',      Logo: FahasaLogo },
  { id: 'grab',        name: 'Grab',             path: '/grab',        Logo: GrabLogo },
  { id: 'fptshop',     name: 'FPT Shop',         path: '/fptshop',     Logo: FptShopLogo },
  { id: 'watsons',     name: "Watson's",         path: '/watsons',     Logo: WatsonsLogo },
  { id: 'vnpay',       name: 'VNPAY',            path: '/vnpay',       Logo: VnpayLogo },
];

const PROMOTIONS = [
  { id: 1, title: 'Mã giảm giá K Coffee – Tháng 4/2026', type: 'TIN KHUYẾN MÃI', image: 'https://placehold.co/600x300/3e2723/ffffff?text=VOUCHER+K-COFFEE' },
  { id: 2, title: 'Mã giảm giá Long Châu – Cập nhật tháng 4/2026', type: 'TIN KHUYẾN MÃI', image: 'https://placehold.co/600x300/00bcd4/ffffff?text=Nhà+thuốc+FPT+Long+Châu' },
  { id: 3, title: 'Mã giảm giá CellphoneS, voucher Cellphone S tháng 4.2026', type: 'TIN KHUYẾN MÃI', image: 'https://placehold.co/600x300/e0e0e0/dd2c00?text=Cellphone+S' },
  { id: 4, title: 'Mã giảm giá Fado – Mua hàng quốc tế cao cấp', type: 'TIN KHUYẾN MÃI', image: 'https://placehold.co/600x300/81d4fa/ffffff?text=FADO' },
  { id: 5, title: 'VNPAY Khuyến Mãi Khủng', type: 'TIN KHUYẾN MÃI', image: 'https://placehold.co/600x300/e53935/ffffff?text=VNPAY' },
  { id: 6, title: 'Khuyến mãi khủng Shopee', type: 'TIN KHUYẾN MÃI', image: 'https://placehold.co/600x300/ff5722/ffffff?text=SHOPEE' },
];

export default function Home() {
  return (
    <div className="space-y-20">
      <Helmet>
        <title>SanMaHot - Tổng hợp mã giảm giá Shopee, Lazada, Tiki mới nhất</title>
        <meta name="description" content="Săn mã giảm giá, deal hot, voucher khuyến mãi từ Shopee, Lazada, Tiki. Cập nhật liên tục mỗi ngày, giúp bạn mua sắm tiết kiệm nhất." />
      </Helmet>

      {/* Hero Section */}
      <section className="relative rounded-[40px] overflow-hidden bg-gray-900 px-6 py-12 text-center">
        <div className="absolute inset-0 bg-gradient-to-br from-[#ff416c]/40 via-[#ff4b2b]/40 to-black/60 z-0"></div>
        <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-20 pointer-events-none"></div>
        
        <div className="relative z-10 max-w-3xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-1000">
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md px-4 py-2 rounded-full border border-white/20 text-white text-xs font-bold tracking-widest uppercase mb-4">
             <span className="w-2 h-2 rounded-full bg-red-500 animate-ping"></span> CẬP NHẬT TRONG NGÀY
          </div>
          <h1 className="text-4xl md:text-7xl font-black text-white tracking-tighter leading-none mb-6">
            MÃ GIẢM GIÁ <br /> 
            <span className="gradient-text-rainbow">SIÊU HOT</span> HÔM NAY
          </h1>
          <p className="text-gray-300 text-lg md:text-xl font-medium max-w-2xl mx-auto leading-relaxed opacity-90">
            Tổng hợp đầy đủ nhất mã Shopee, Lazada, Tiki... Giúp bạn mua sắm không lo về giá. Ưu đãi đến 70% mỗi ngày!
          </p>
        </div>
      </section>

      {/* Nhà Cung Cấp Nổi Bật Section */}
      <section className="max-w-7xl mx-auto px-4 lg:px-0">
        <div className="flex items-end justify-between mb-10 pb-4 border-b border-gray-100">
           <div>
              <h2 className="text-3xl md:text-4xl font-black text-gray-900 tracking-tighter mb-2">
                NHÀ THƯƠNG HIỆU
              </h2>
              <p className="text-gray-500 font-medium italic">Lựa chọn mã giảm giá từ các sàn thương mại điện tử hàng đầu</p>
           </div>
           <Link to="/categories" className="text-sm font-black text-primary hover:opacity-80 transition-opacity hidden md:block">XEM TẤT CẢ →</Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {BRANDS.map(({ id, path, name, Logo }) => (
            <Link
              key={id}
              to={path}
              title={name}
              className="group relative bg-white rounded-[24px] border border-gray-100 shadow-[0_10px_40px_rgb(0,0,0,0.04)] hover:shadow-[0_25px_60px_rgba(0,0,0,0.15)] hover:-translate-y-3 px-6 md:px-8 py-8 md:py-10 flex items-center justify-center aspect-[3/2] overflow-hidden will-change-[transform,box-shadow] transition-[transform,box-shadow] duration-500 transform-gpu"
            >
              {/* Logo in background on hover */}
              <div className="w-full h-full flex items-center justify-center relative z-10 transition-[opacity,transform] duration-500 group-hover:opacity-10 group-hover:scale-90 ease-out will-change-[opacity,transform] transform-gpu">
                <Logo />
              </div>

              {/* Text overlay on hover */}
              <div className="absolute inset-0 flex flex-col items-center justify-center p-6 opacity-0 group-hover:opacity-100 transition-[opacity,transform] duration-500 translate-y-4 group-hover:translate-y-0 z-20 will-change-[opacity,transform] transform-gpu">
                <span className="text-red-700 font-bold text-base md:text-xl leading-tight text-center">
                  Mã Giảm Giá<br />
                  <span className="text-gray-900">{name}</span>
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Tin Khuyến Mãi Section */}
      <section className="max-w-7xl mx-auto px-4 lg:px-0 pb-20">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 pb-4 border-b border-gray-100 gap-4">
           <div>
              <h2 className="text-3xl md:text-4xl font-black text-gray-900 tracking-tighter mb-2">
                TIN KHUYẾN MÃI
              </h2>
              <p className="text-gray-500 font-medium italic">Cập nhật tin tức flash sale và sự kiện mua sắm mới nhất</p>
           </div>
           <div className="flex gap-2">
              <span className="px-5 py-2.5 rounded-full bg-red-50 text-primary font-black text-xs cursor-pointer">TIN HOT</span>
              <span className="px-5 py-2.5 rounded-full bg-gray-50 text-gray-400 font-black text-xs cursor-pointer border border-transparent hover:border-gray-100 transition-all">HƯỚNG DẪN</span>
           </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {PROMOTIONS.map(promo => (
            <Link 
              key={promo.id} 
              to={`/promo/${promo.id}`}
              className="bg-white rounded-[32px] overflow-hidden shadow-[0_4px_25px_-5px_rgba(0,0,0,0.04)] border border-gray-50 group flex flex-col hover:shadow-[0_30px_60px_-15px_rgba(0,0,0,0.1)] transition-all duration-500 hover:-translate-y-2 h-full"
            >
              {/* Image Container */}
              <div className="relative aspect-[16/10] w-full overflow-hidden bg-gray-100">
                <img 
                  src={promo.image} 
                  alt={promo.title} 
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-in-out"
                />
                <div className="absolute top-4 right-4 gradient-hot text-white text-[10px] font-black px-4 py-2 rounded-full shadow-xl shadow-red-500/20 tracking-widest uppercase">
                  {promo.type}
                </div>
              </div>

              {/* Text Content */}
              <div className="p-6 md:p-8 flex-1 flex flex-col">
                <h3 className="text-gray-900 font-extrabold text-xl leading-tight group-hover:text-primary transition-colors duration-300 line-clamp-3">
                  {promo.title}
                </h3>
                <div className="mt-auto pt-6 flex items-center justify-between text-xs font-bold text-gray-400">
                   <span className="flex items-center gap-1.5 hover:text-gray-600 transition-colors">ĐỌC THÊM →</span>
                   <span className="opacity-50">#SanMaHot</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
