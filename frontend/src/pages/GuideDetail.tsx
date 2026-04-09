import { useQuery } from '@tanstack/react-query';
import { useParams, Link } from 'react-router-dom';
import api from '../services/api';
import { Helmet } from 'react-helmet-async';
import { Badge } from '../components/ui/badge';
import { Calendar, ChevronLeft, BookOpen } from 'lucide-react';

const formatDate = (dateString: string) => {
  return new Intl.DateTimeFormat('vi-VN').format(new Date(dateString));
};

export default function GuideDetail() {
  const { slug } = useParams();

  const {
    data: guide,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ['public_guide', slug],
    queryFn: async () => {
      const response = await api.get(`/articles/${slug}`);
      return response.data;
    },
  });

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
        <h2 className="text-2xl font-bold">Không tìm thấy hướng dẫn!</h2>
        <Link to="/huong-dan" className="text-orange-600 hover:underline mt-4 inline-block">
          Quay lại danh sách Hướng Dẫn
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-orange-50/30 min-h-screen pb-12">
      <Helmet>
        <title>{guide.title} - Hướng Dẫn SanMaHot</title>
        <meta name="description" content={guide.meta_description || guide.excerpt} />
      </Helmet>

      {/* Hero Header */}
      <div className="bg-white border-b border-orange-100">
        <div className="container max-w-4xl mx-auto px-4 pt-10 pb-12">
          <Link
            to="/huong-dan"
            className="inline-flex items-center text-sm text-muted-foreground hover:text-orange-600 mb-6 transition-colors"
          >
            <ChevronLeft className="w-4 h-4 mr-1" /> Trở về Trang Hướng Dẫn
          </Link>

          <div className="flex items-center gap-3 mb-4">
            <Badge className="bg-orange-600 hover:bg-orange-700">
              <BookOpen className="w-3 h-3 mr-1" /> Cẩm Nang Mua Sắm
            </Badge>
            <div className="flex items-center gap-1 text-sm text-gray-500 font-medium">
              <Calendar className="w-4 h-4" />
              {guide.published_at ? formatDate(guide.published_at) : 'Mới cập nhật'}
            </div>
          </div>

          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-gray-900 leading-tight mb-6">
            {guide.title}
          </h1>

          {guide.excerpt && (
            <p className="text-xl text-gray-600 leading-relaxed font-medium">{guide.excerpt}</p>
          )}
        </div>
      </div>

      {/* Guide Content */}
      <div className="container max-w-4xl mx-auto px-4 mt-8">
        {guide.image_url && (
          <div className="mb-8 rounded-2xl overflow-hidden shadow-lg border border-orange-100">
            <img
              src={guide.image_url}
              alt={guide.title}
              className="w-full h-auto object-cover max-h-[500px]"
            />
          </div>
        )}
        <article
          className="prose prose-2xl max-w-none prose-headings:font-bold prose-headings:text-orange-900 prose-p:text-gray-900 prose-p:leading-relaxed prose-a:text-orange-600 prose-a:font-bold bg-white p-8 md:p-12 rounded-2xl shadow-sm border border-orange-100"
          style={{ fontSize: '1.5rem', lineHeight: '1.6' }}
          dangerouslySetInnerHTML={{ __html: guide.content }}
        />
      </div>
    </div>
  );
}
