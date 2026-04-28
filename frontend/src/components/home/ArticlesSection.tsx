import { Link } from 'react-router-dom';

import type { Article } from '../../types';

interface ArticlesSectionProps {
  articles: Article[];
  isLoading: boolean;
}

export default function ArticlesSection({ articles, isLoading }: ArticlesSectionProps) {
  return (
    <section className="max-w-7xl mx-auto px-4 lg:px-0 pb-20">
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 pb-4 border-b border-gray-100 gap-4">
        <div>
          <h2 className="text-3xl md:text-4xl font-black text-gray-900 tracking-tighter mb-2">
            TIN KHUYẾN MÃI
          </h2>
          <p className="text-gray-500 font-medium italic">
            Cập nhật tin tức flash sale và sự kiện mua sắm mới nhất
          </p>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex gap-2">
            <span className="px-5 py-2.5 rounded-full bg-red-50 text-primary font-black text-xs cursor-pointer">
              TIN HOT
            </span>
            <span className="px-5 py-2.5 rounded-full bg-gray-50 text-gray-400 font-black text-xs cursor-pointer border border-transparent hover:border-gray-100 transition-all">
              HƯỚNG DẪN
            </span>
          </div>
          <Link
            to="/tin-khuyen-mai"
            className="text-sm font-black text-primary hover:opacity-80 transition-opacity hidden md:block"
          >
            XEM TẤT CẢ →
          </Link>
        </div>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-3 gap-8">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-80 bg-gray-100 animate-pulse rounded-[32px]" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-3 gap-8">
          {articles?.map((article: any) => (
            <Link
              key={article.id}
              to={`/tin-khuyen-mai/${article.slug}`}
              className="bg-white rounded-[32px] overflow-hidden shadow-[0_4px_25px_-5px_rgba(0,0,0,0.04)] border border-gray-50 group flex flex-col hover:shadow-[0_30px_60px_-15px_rgba(0,0,0,0.1)] transition-all duration-500 hover:-translate-y-2 h-full"
            >
              <div className="relative aspect-[16/10] w-full overflow-hidden bg-gray-100">
                <img
                  src={
                    article.image_url ||
                    'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?q=80&w=2070'
                  }
                  alt={article.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-in-out"
                />
                <div className="absolute top-4 right-4 gradient-hot text-white text-[10px] font-black px-4 py-2 rounded-full shadow-xl shadow-red-500/20 tracking-widest uppercase">
                  {article.category || 'TIN KHUYẾN MÃI'}
                </div>
              </div>

              <div className="p-6 md:p-8 flex-1 flex flex-col">
                <h3 className="text-gray-900 font-extrabold text-xl leading-tight group-hover:text-primary transition-colors duration-300 line-clamp-3">
                  {article.title}
                </h3>
                <div className="mt-auto pt-6 flex items-center justify-between text-xs font-bold text-gray-400">
                  <span className="flex items-center gap-1.5 hover:text-gray-600 transition-colors">
                    ĐỌC THÊM →
                  </span>
                  <span className="opacity-50">#SanMaHot</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </section>
  );
}
