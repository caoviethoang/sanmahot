import { useParams, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { Badge } from '../components/ui/badge';
import { Calendar, ChevronLeft } from 'lucide-react';
import { useArticle } from '../hooks/useArticles';
import { formatDate } from '../lib/utils';

export default function ArticleDetail() {
  const { slug } = useParams<{ slug: string }>();

  const { data: article, isLoading, isError } = useArticle(slug || '');

  if (isLoading) {
    return (
      <div className="container max-w-4xl mx-auto px-4 py-8 animate-pulse space-y-4">
        <div className="h-10 bg-muted rounded w-3/4"></div>
        <div className="h-4 bg-muted rounded w-1/4 mb-8"></div>
        <div className="h-64 bg-muted rounded"></div>
      </div>
    );
  }

  if (isError || !article) {
    return (
      <div className="container text-center py-20">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Không tìm thấy bài viết!</h2>
        <Link to="/tin-khuyen-mai" className="text-orange-600 font-bold hover:underline">
          Quay lại danh sách Tin Khuyến Mãi
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-white min-h-screen pb-12">
      <Helmet>
        <title>{article.title} - SanMaHot</title>
        <meta name="description" content={article.meta_description || article.excerpt} />
      </Helmet>

      {/* Hero Header */}
      <div className="bg-gray-50/50 border-b border-gray-100">
        <div className="container max-w-4xl mx-auto px-4 pt-10 pb-12">
          <Link
            to="/tin-khuyen-mai"
            className="inline-flex items-center text-sm font-bold text-gray-400 hover:text-orange-600 mb-6 transition-colors group"
          >
            <ChevronLeft className="w-4 h-4 mr-1 group-hover:-translate-x-1 transition-transform" />{' '}
            Trở về Tin Khuyến Mãi
          </Link>

          <div className="flex items-center gap-3 mb-6">
            <Badge className="bg-orange-600 hover:bg-orange-700 rounded-full px-4 text-[10px] font-black uppercase tracking-widest border-none">
              Tin Mới
            </Badge>
            <div className="flex items-center gap-1.5 text-xs text-gray-400 font-bold uppercase tracking-wider">
              <Calendar className="w-3.5 h-3.5" />
              {article.published_at ? formatDate(article.published_at) : 'Mới cập nhật'}
            </div>
          </div>

          <h1 className="text-3xl md:text-5xl font-black tracking-tight text-gray-900 leading-tight mb-8">
            {article.title}
          </h1>

          {article.excerpt && (
            <p className="text-lg md:text-xl text-gray-500 leading-relaxed font-medium border-l-4 border-orange-200 pl-6">
              {article.excerpt}
            </p>
          )}
        </div>
      </div>

      {/* Article Content */}
      <div className="container max-w-4xl mx-auto px-4 mt-12">
        {article.image_url && (
          <div className="mb-12 rounded-[2rem] overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.1)] border border-gray-100">
            <img
              src={article.image_url}
              alt={article.title}
              className="w-full h-auto object-cover max-h-[600px]"
            />
          </div>
        )}
        <article
          className="prose prose-lg md:prose-xl max-w-none prose-headings:font-black prose-headings:text-gray-900 prose-p:text-gray-600 prose-p:leading-relaxed prose-a:text-orange-600 prose-a:font-bold prose-img:rounded-2xl"
          dangerouslySetInnerHTML={{ __html: article.content || '' }}
        />
      </div>
    </div>
  );
}
