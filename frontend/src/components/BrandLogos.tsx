// Brand logos as accurate image components referencing metadata in brand-config.ts
import { BRANDS } from '../lib/brand-config';

const LogoImage = ({ src, alt }: { src: string; alt: string }) => (
  <img src={src} alt={alt} className="w-full h-full object-contain" loading="lazy" />
);

export const ShopeeLogo = () => <LogoImage src={BRANDS.shopee.image} alt={BRANDS.shopee.name} />;
export const LazadaLogo = () => <LogoImage src={BRANDS.lazada.image} alt={BRANDS.lazada.name} />;
export const TikiLogo = () => <LogoImage src={BRANDS.tiki.image} alt={BRANDS.tiki.name} />;
export const ShopeeFoodLogo = () => (
  <LogoImage src={BRANDS.shopeefood.image} alt={BRANDS.shopeefood.name} />
);
export const SendoLogo = () => <LogoImage src={BRANDS.sendo.image} alt={BRANDS.sendo.name} />;
export const NguyenKimLogo = () => (
  <LogoImage src={BRANDS.nguyenkim.image} alt={BRANDS.nguyenkim.name} />
);
export const DienMayXanhLogo = () => (
  <LogoImage src={BRANDS.dienmayxanh.image} alt={BRANDS.dienmayxanh.name} />
);
export const FahasaLogo = () => <LogoImage src={BRANDS.fahasa.image} alt={BRANDS.fahasa.name} />;
export const GrabLogo = () => <LogoImage src={BRANDS.grab.image} alt={BRANDS.grab.name} />;
export const FptShopLogo = () => <LogoImage src={BRANDS.fptshop.image} alt={BRANDS.fptshop.name} />;
export const XanhsmLogo = () => <LogoImage src={BRANDS.xanhsm.image} alt={BRANDS.xanhsm.name} />;
export const VnpayLogo = () => <LogoImage src={BRANDS.vnpay.image} alt={BRANDS.vnpay.name} />;
