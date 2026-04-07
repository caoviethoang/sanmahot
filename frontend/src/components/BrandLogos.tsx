// Brand logos as accurate image components referencing official assets in /public/logos/

const LogoImage = ({ src, alt }: { src: string; alt: string }) => (
  <img src={src} alt={alt} className="w-full h-full object-contain" loading="lazy" />
);

export const ShopeeLogo = () => <LogoImage src="/logos/shopee.jpg" alt="Shopee" />;
export const LazadaLogo = () => <LogoImage src="/logos/lazada.jpg" alt="Lazada" />;
export const TikiLogo = () => <LogoImage src="/logos/tiki.jpg" alt="Tiki" />;
export const ShopeeFoodLogo = () => <LogoImage src="/logos/shopeefood.png" alt="ShopeeFood" />;
export const SendoLogo = () => <LogoImage src="/logos/sendo.jpg" alt="Sendo" />;
export const NguyenKimLogo = () => <LogoImage src="/logos/nguyenkim.jpg" alt="Nguyễn Kim" />;
export const DienMayXanhLogo = () => <LogoImage src="/logos/dienmayxanh.jpg" alt="Điện Máy Xanh" />;
export const FahasaLogo = () => <LogoImage src="/logos/fahasa.png" alt="Fahasa" />;
export const GrabLogo = () => <LogoImage src="/logos/grab.png" alt="Grab" />;
export const FptShopLogo = () => <LogoImage src="/logos/fptshop.webp" alt="FPT Shop" />;
export const XanhsmLogo = () => <LogoImage src="/logos/xanhsm.png" alt="XanhSM" />;
export const VnpayLogo = () => <LogoImage src="/logos/vnpay.webp" alt="VNPAY" />;
