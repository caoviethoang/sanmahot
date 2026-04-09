import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../../services/api';
import { Button } from '../../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { Plus, Edit, Trash2, ExternalLink, Sparkles, Loader2 } from 'lucide-react';
import { useState } from 'react';

export default function AdminArticles() {
  const queryClient = useQueryClient();
  const token = localStorage.getItem('admin_token');
  const [isEditing, setIsEditing] = useState(false);
  const [editingArticle, setEditingArticle] = useState<any>(null);

  // Form states
  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [excerpt, setExcerpt] = useState('');
  const [content, setContent] = useState('');
  const [status, setStatus] = useState('draft');
  const [prompt, setPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

  const { data: articles, isLoading } = useQuery({
    queryKey: ['admin_articles'],
    queryFn: async () => {
      const response = await api.get('/admin/articles', {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data;
    },
  });

  const saveMutation = useMutation({
    mutationFn: async (data: any) => {
      if (data.id) {
        return api.put(
          `/admin/articles/${data.id}`,
          { article: data },
          {
            headers: { Authorization: `Bearer ${token}` },
          },
        );
      }
      return api.post(
        '/admin/articles',
        { article: data },
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin_articles'] });
      setIsEditing(false);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      await api.delete(`/admin/articles/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin_articles'] });
    },
  });

  const handleGenerateAI = async () => {
    if (!prompt) return alert('Vui lòng nhập dữ liệu nguồn để AI dựa vào đó viết bài.');
    setIsGenerating(true);
    try {
      const resp = await api.post(
        '/admin/articles/generate',
        { prompt },
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      if (resp.data.content) {
        setContent(resp.data.content);
      }
    } catch (e) {
      alert('Có lỗi xảy ra khi tạo AI content.');
    } finally {
      setIsGenerating(false);
    }
  };

  const openEditor = (article?: any) => {
    if (article) {
      setEditingArticle(article);
      setTitle(article.title || '');
      setSlug(article.slug || '');
      setExcerpt(article.excerpt || '');
      setContent(article.content || '');
      setStatus(article.status || 'draft');
    } else {
      setEditingArticle({ id: null });
      setTitle('');
      setSlug('');
      setExcerpt('');
      setContent('');
      setStatus('draft');
    }
    setPrompt('');
    setIsEditing(true);
  };

  if (isLoading) return <div className="animate-pulse h-64 bg-muted rounded-xl" />;

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Quản lý Tin Khuyến Mãi</h1>
          <p className="text-muted-foreground">Viet bài, quản lý các tin hot, sự kiện giảm giá.</p>
        </div>
        <Button onClick={() => openEditor()}>
          <Plus className="w-4 h-4 mr-2" /> Thêm Bài Viết
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Danh sách Bài viết</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-xs text-muted-foreground uppercase bg-muted/50">
                <tr>
                  <th className="px-4 py-3">ID</th>
                  <th className="px-4 py-3">Tiêu đề - Slug</th>
                  <th className="px-4 py-3">Trạng thái</th>
                  <th className="px-4 py-3 text-right">Thao tác</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {articles?.map((a: any) => (
                  <tr key={a.id} className="hover:bg-muted/30 transition-colors">
                    <td className="px-4 py-3 font-mono">{a.id}</td>
                    <td className="px-4 py-3 font-medium">
                      <div className="line-clamp-1">{a.title}</div>
                      <div className="text-xs text-muted-foreground font-mono mt-1">{a.slug}</div>
                    </td>
                    <td className="px-4 py-3">
                      <Badge variant={a.status === 'published' ? 'default' : 'secondary'}>
                        {a.status}
                      </Badge>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex justify-end gap-2">
                        <Button variant="ghost" size="icon" onClick={() => openEditor(a)}>
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-destructive hover:bg-destructive/10"
                          onClick={() => {
                            if (confirm('Chắc chắn xóa bài viết này?')) deleteMutation.mutate(a.id);
                          }}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                        <a href={`/tin-khuyen-mai/${a.slug}`} target="_blank" rel="noreferrer">
                          <Button variant="ghost" size="icon">
                            <ExternalLink className="w-4 h-4" />
                          </Button>
                        </a>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {isEditing && (
        <div className="fixed inset-0 bg-black/50 z-[100] flex items-center justify-center p-4">
          <Card className="w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <CardHeader>
              <CardTitle>{editingArticle?.id ? 'Sửa Bài Viết' : 'Thêm Bài Viết Mới'}</CardTitle>
            </CardHeader>
            <CardContent>
              <form
                className="space-y-4"
                onSubmit={(e) => {
                  e.preventDefault();
                  saveMutation.mutate({
                    id: editingArticle.id,
                    title,
                    slug,
                    excerpt,
                    content,
                    status,
                  });
                }}
              >
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Tiêu đề</label>
                    <input
                      className="w-full p-2 border rounded-md"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Đường dẫn tĩnh (Slug)</label>
                    <input
                      className="w-full p-2 border rounded-md"
                      value={slug}
                      onChange={(e) => setSlug(e.target.value)}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Tóm tắt (Excerpt)</label>
                  <textarea
                    className="w-full p-2 border rounded-md"
                    rows={2}
                    value={excerpt}
                    onChange={(e) => setExcerpt(e.target.value)}
                  />
                </div>

                <div className="border border-purple-200 bg-purple-50 rounded-xl p-4 space-y-3">
                  <div className="flex items-center gap-2 text-purple-700 font-semibold mb-2">
                    <Sparkles className="w-5 h-5" /> <span>Trợ lý AI - Viết bài tự động</span>
                  </div>
                  <p className="text-xs text-purple-600 mb-2">
                    Nhập dữ liệu gốc (vd: list mã giảm giá, outline brief) vào ô bên dưới, AI sẽ
                    viết thành một bài blog hoàn chỉnh cho bạn.
                  </p>
                  <textarea
                    className="w-full p-2 border border-purple-300 focus:ring-purple-500 rounded-md bg-white"
                    rows={3}
                    placeholder="VD: Viết bài tổng hợp mã giảm giá Shopee 5.5 gồm mã Hoàn 15%, freeship 0Đ..."
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                  />
                  <Button
                    type="button"
                    variant="secondary"
                    className="w-full bg-purple-600 text-white hover:bg-purple-700"
                    onClick={handleGenerateAI}
                    disabled={isGenerating}
                  >
                    {isGenerating ? (
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    ) : (
                      <Sparkles className="w-4 h-4 mr-2" />
                    )}
                    {isGenerating ? 'AI đang viết...' : 'Tạo Content Bằng AI'}
                  </Button>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Nội dung HTML</label>
                  <textarea
                    className="w-full p-2 border rounded-md font-mono text-sm"
                    rows={12}
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Trạng thái</label>
                  <select
                    className="w-full p-2 border rounded-md"
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                  >
                    <option value="draft">Bản nháp (Draft)</option>
                    <option value="published">Đã Xuất bản (Published)</option>
                  </select>
                </div>

                <div className="flex justify-end gap-3 pt-4">
                  <Button type="button" variant="outline" onClick={() => setIsEditing(false)}>
                    Hủy
                  </Button>
                  <Button type="submit" disabled={saveMutation.isPending}>
                    {saveMutation.isPending ? 'Đang lưu...' : 'Lưu lại'}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
