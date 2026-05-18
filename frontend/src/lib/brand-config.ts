import {
  ShopeeLogo,
  LazadaLogo,
  TikiLogo,
  SendoLogo,
  NguyenKimLogo,
  ShopeeFoodLogo,
  DienMayXanhLogo,
  GrabLogo,
  FptShopLogo,
  XanhsmLogo,
  VnpayLogo,
  FahasaLogo,
} from '../components/BrandLogos';
import { DefaultLogo } from '../components/DefaultLogo';

export interface BrandConfig {
  id: string;
  name: string;
  Logo: React.ComponentType;
  color: string;
  bg: string;
  lightBg: string;
  border: string;
  image: string;
}

export const BRANDS: Record<string, BrandConfig> = {
  shopee: {
    id: 'shopee',
    name: 'Shopee',
    Logo: ShopeeLogo,
    color: 'text-[#ee4d2d]',
    bg: 'bg-[#ee4d2d]',
    lightBg: 'bg-[#ee4d2d]/5',
    border: 'border-[#ee4d2d]/20',
    image: '/logos/shopee.jpg',
  },
  lazada: {
    id: 'lazada',
    name: 'Lazada',
    Logo: LazadaLogo,
    color: 'text-[#0f136d]',
    bg: 'bg-[#0f136d]',
    lightBg: 'bg-[#0f136d]/5',
    border: 'border-[#0f136d]/20',
    image: '/logos/lazada.jpg',
  },
  tiki: {
    id: 'tiki',
    name: 'Tiki',
    Logo: TikiLogo,
    color: 'text-[#1a94ff]',
    bg: 'bg-[#1a94ff]',
    lightBg: 'bg-[#1a94ff]/5',
    border: 'border-[#1a94ff]/20',
    image: '/logos/tiki.jpg',
  },
  shopeefood: {
    id: 'shopeefood',
    name: 'ShopeeFood',
    Logo: ShopeeFoodLogo,
    color: 'text-[#ee4d2d]',
    bg: 'bg-[#ee4d2d]',
    lightBg: 'bg-[#ee4d2d]/5',
    border: 'border-[#ee4d2d]/20',
    image: '/logos/shopeefood.png',
  },
  sendo: {
    id: 'sendo',
    name: 'Sendo',
    Logo: SendoLogo,
    color: 'text-[#ee2624]',
    bg: 'bg-[#ee2624]',
    lightBg: 'bg-[#ee2624]/5',
    border: 'border-[#ee2624]/20',
    image: '/logos/sendo.jpg',
  },
  nguyenkim: {
    id: 'nguyenkim',
    name: 'Nguyenkim',
    Logo: NguyenKimLogo,
    color: 'text-[#ed1c24]',
    bg: 'bg-[#ed1c24]',
    lightBg: 'bg-[#ed1c24]/5',
    border: 'border-[#ed1c24]/20',
    image: '/logos/nguyenkim.jpg',
  },
  dienmayxanh: {
    id: 'dienmayxanh',
    name: 'Điện Máy Xanh',
    Logo: DienMayXanhLogo,
    color: 'text-[#005faa]',
    bg: 'bg-[#005faa]',
    lightBg: 'bg-[#005faa]/5',
    border: 'border-[#005faa]/20',
    image: '/logos/dienmayxanh.jpg',
  },
  grab: {
    id: 'grab',
    name: 'Grab',
    Logo: GrabLogo,
    color: 'text-[#00b14f]',
    bg: 'bg-[#00b14f]',
    lightBg: 'bg-[#00b14f]/5',
    border: 'border-[#00b14f]/20',
    image: '/logos/grab.png',
  },
  fptshop: {
    id: 'fptshop',
    name: 'FPT Shop',
    Logo: FptShopLogo,
    color: 'text-[#ed1c24]',
    bg: 'bg-[#ed1c24]',
    lightBg: 'bg-[#ed1c24]/5',
    border: 'border-[#ed1c24]/20',
    image: '/logos/fptshop.webp',
  },
  xanhsm: {
    id: 'xanhsm',
    name: 'XanhSM',
    Logo: XanhsmLogo,
    color: 'text-[#00a69a]',
    bg: 'bg-[#00a69a]',
    lightBg: 'bg-[#00a69a]/5',
    border: 'border-[#00a69a]/20',
    image: '/logos/xanhsm.png',
  },
  vnpay: {
    id: 'vnpay',
    name: 'VNPAY',
    Logo: VnpayLogo,
    color: 'text-[#005baa]',
    bg: 'bg-[#005baa]',
    lightBg: 'bg-[#005baa]/5',
    border: 'border-[#005baa]/20',
    image: '/logos/vnpay.webp',
  },
  fahasa: {
    id: 'fahasa',
    name: 'Fahasa',
    Logo: FahasaLogo,
    color: 'text-[#c92127]',
    bg: 'bg-[#c92127]',
    lightBg: 'bg-[#c92127]/5',
    border: 'border-[#c92127]/20',
    image: '/logos/fahasa.png',
  },
};

export const getBrandConfig = (platform?: string): BrandConfig => {
  const normalized = platform?.toLowerCase() || '';
  return (
    BRANDS[normalized] || {
      id: normalized || 'default',
      name: platform || 'Săn Mã Hot',
      Logo: DefaultLogo,
      color: 'text-primary',
      bg: 'bg-primary',
      lightBg: 'bg-primary/5',
      border: 'border-primary/20',
      image: `/logos/${normalized}.jpg`,
    }
  );
};
