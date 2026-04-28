import { Helmet } from 'react-helmet-async';
import ArticlesSection from '../components/home/ArticlesSection';
import BrandGrid from '../components/home/BrandGrid';
import Hero from '../components/home/Hero';
import LatestCoupons from '../components/home/LatestCoupons';
import { useLatestArticles } from '../hooks/useArticles';
import { useLatestCoupons } from '../hooks/useCoupons';
import { BRANDS } from '../lib/brand-config';

export default function Home() {
  const { data: couponsData, isLoading: couponsLoading } = useLatestCoupons(9);
  const { data: articlesData, isLoading: articlesLoading } = useLatestArticles(6);

  const coupons = couponsData?.coupons;
  const articles = articlesData?.articles;

  // Convert BRANDS object to array for mapping
  const brandList = Object.values(BRANDS).map((brand) => ({
    ...brand,
    path: `/coupons?platform=${brand.id}`,
  }));

  return (
    <div className="space-y-20">
      <Helmet>
        <title>SanMaHot - Tổng hợp mã giảm giá Shopee, Lazada, Tiki mới nhất</title>
        <meta
          name="description"
          content="Săn mã giảm giá, deal hot, voucher khuyến mãi từ Shopee, Lazada, Tiki. Cập nhật liên tục mỗi ngày, giúp bạn mua sắm tiết kiệm nhất."
        />
      </Helmet>

      <Hero />

      <BrandGrid brands={brandList} />

      <LatestCoupons coupons={coupons || []} isLoading={couponsLoading} />

      <ArticlesSection articles={articles || []} isLoading={articlesLoading} />
    </div>
  );
}
