import { useParams, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { Badge } from '../components/ui/badge';
import { Calendar, ChevronLeft, BookOpen } from 'lucide-react';
import { useArticle } from '../hooks/useArticles';
import { formatDate } from '../lib/utils';

export default function GuideDetail() {
  const { slug } = useParams<{ slug: string }>();

  const { data: guide, isLoading, isError } = useArticle(slug || '');

  if (isLoading) {
    return (
      <div className="container max-w-4xl mx-auto px-4 py-8 animate-pulse space-y-4">
        <div className="h-10 bg-muted rounded w-3/4"></div>
        <div className="h-4 bg-muted rounded w-1/4 mb-8"></div>
        <div className="h-64 bg-muted rounded"></div>
      </div>
    );
  }

  if (isError || !guide) {
    return (
      <div className="container text-center py-20">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Không tìm thấy hướng dẫn!</h2>
        <Link to="/huong-dan" className="text-orange-600 font-bold hover:underline">
          Quay lại danh sách Hướng Dẫn
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-white min-h-screen pb-12">
      <Helmet>
        <title>{guide.title} - Hướng Dẫn SanMaHot</title>
        <meta name="description" content={guide.meta_description || guide.excerpt} />
      </Helmet>

      {/* Hero Header */}
      <div className="bg-orange-50/30 border-b border-orange-100">
        <div className="container max-w-4xl mx-auto px-4 pt-10 pb-12">
          <Link
            to="/huong-dan"
            className="inline-flex items-center text-sm font-bold text-gray-400 hover:text-orange-600 mb-6 transition-colors group"
          >
            <ChevronLeft className="w-4 h-4 mr-1 group-hover:-translate-x-1 transition-transform" />{' '}
            Trở về Trang Hướng Dẫn
          </Link>

          <div className="flex items-center gap-3 mb-6">
            <Badge className="bg-orange-600 hover:bg-orange-700 rounded-full px-4 text-[10px] font-black uppercase tracking-widest border-none shadow-lg shadow-orange-100">
              <BookOpen className="w-3 h-3 mr-1.5" /> Cẩm Nang
            </Badge>
            <div className="flex items-center gap-1.5 text-xs text-gray-400 font-bold uppercase tracking-wider">
              <Calendar className="w-3.5 h-3.5" />
              {guide.published_at ? formatDate(guide.published_at) : 'Mới cập nhật'}
            </div>
          </div>

          <h1 className="text-3xl md:text-5xl font-black tracking-tight text-gray-900 leading-tight mb-8">
            {guide.title}
          </h1>

          {guide.excerpt && (
            <p className="text-lg md:text-xl text-gray-500 leading-relaxed font-medium border-l-4 border-orange-200 pl-6">
              {guide.excerpt}
            </p>
          )}
        </div>
      </div>

      {/* Guide Content */}
      <div className="container max-w-4xl mx-auto px-4 mt-12">
        {guide.image_url && (
          <div className="mb-12 rounded-[2rem] overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.1)] border border-orange-50">
            <img
              src={guide.image_url}
              alt={guide.title}
              className="w-full h-auto object-cover max-h-[600px]"
            />
          </div>
        )}
        <article
          className="prose prose-lg md:prose-xl max-w-none prose-headings:font-black prose-headings:text-gray-900 prose-p:text-gray-600 prose-p:leading-relaxed prose-a:text-orange-600 prose-a:font-bold prose-img:rounded-2xl"
          dangerouslySetInnerHTML={{ __html: guide.content || '' }}
        />
      </div>
    </div>
  );
}
