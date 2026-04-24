import { useArticle } from '../hooks/useArticles';
import { Article } from '../types';
import { useParams, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { Badge } from '../components/ui/badge';
import { Calendar, ChevronLeft } from 'lucide-react';

const formatDate = (dateString: string) => {
  return new Intl.DateTimeFormat('vi-VN').format(new Date(dateString));
};

export default function ArticleDetail() {
  const { slug } = useParams();

  const {
    data: article,
    isLoading,
    isError,
  } = useArticle(slug || '');

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
        <h2 className="text-2xl font-bold">Không tìm thấy bài viết!</h2>
        <Link to="/tin-khuyen-mai" className="text-purple-600 hover:underline mt-4 inline-block">
          Quay lại danh sách Tin Khuyến Mãi
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-gray-50/50 min-h-screen pb-12">
      <Helmet>
        <title>{article.title} - SanMaHot</title>
        <meta name="description" content={article.meta_description || article.excerpt} />
      </Helmet>

      {/* Hero Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="container max-w-4xl mx-auto px-4 pt-10 pb-12">
          <Link
            to="/tin-khuyen-mai"
            className="inline-flex items-center text-sm text-muted-foreground hover:text-purple-600 mb-6 transition-colors"
          >
            <ChevronLeft className="w-4 h-4 mr-1" /> Trở về Tin Khuyến Mãi
          </Link>

          <div className="flex items-center gap-3 mb-4">
            <Badge className="bg-purple-600 hover:bg-purple-700">Khuyến Mãi Mới</Badge>
            <div className="flex items-center gap-1 text-sm text-gray-500 font-medium">
              <Calendar className="w-4 h-4" />
              {article.published_at ? formatDate(article.published_at) : 'Mới cập nhật'}
            </div>
          </div>

          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-gray-900 leading-tight mb-6">
            {article.title}
          </h1>

          {article.excerpt && (
            <p className="text-xl text-gray-600 leading-relaxed font-medium">{article.excerpt}</p>
          )}
        </div>
      </div>

      {/* Article Content */}
      <div className="container max-w-4xl mx-auto px-4 mt-8">
        {article.image_url && (
          <div className="mb-8 rounded-2xl overflow-hidden shadow-lg border border-gray-100">
            <img
              src={article.image_url}
              alt={article.title}
              className="w-full h-auto object-cover max-h-[500px]"
            />
          </div>
        )}
        <article
          className="prose prose-2xl max-w-none prose-headings:font-bold prose-p:text-gray-900 prose-p:leading-relaxed prose-a:text-blue-600 prose-a:font-bold bg-white p-8 md:p-12 rounded-2xl shadow-sm border border-gray-100"
          style={{ fontSize: '1.5rem', lineHeight: '1.6' }}
          dangerouslySetInnerHTML={{ __html: article.content }}
        />
      </div>
    </div>
  );
}
