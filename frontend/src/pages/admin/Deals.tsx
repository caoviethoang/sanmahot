import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../../services/api';
import { Button } from '../../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { Plus, Edit, Trash2, ExternalLink } from 'lucide-react';
import { useState } from 'react';

export default function AdminDeals() {
  const queryClient = useQueryClient();
  const token = localStorage.getItem('admin_token');
  const [isEditing, setIsEditing] = useState(false);
  const [editingDeal, setEditingDeal] = useState<any>(null);

  const { data: deals, isLoading } = useQuery({
    queryKey: ['admin_deals'],
    queryFn: async () => {
      const response = await api.get('/admin/deals', {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data;
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      await api.delete(`/admin/deals/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin_deals'] });
    },
  });

  if (isLoading) return <div className="animate-pulse h-64 bg-muted rounded-xl" />;

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Quản lý Deal</h1>
          <p className="text-muted-foreground">Thêm, sửa, xóa các deal khuyến mãi trên hệ thống.</p>
        </div>
        <Button
          onClick={() => {
            setEditingDeal({});
            setIsEditing(true);
          }}
        >
          <Plus className="w-4 h-4 mr-2" /> Thêm Deal Mới
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Danh sách Deal</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-xs text-muted-foreground uppercase bg-muted/50">
                <tr>
                  <th className="px-4 py-3">ID</th>
                  <th className="px-4 py-3">Tiêu đề</th>
                  <th className="px-4 py-3">Sàn</th>
                  <th className="px-4 py-3">Giảm giá</th>
                  <th className="px-4 py-3">Trạng thái</th>
                  <th className="px-4 py-3 text-right">Thao tác</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {deals?.map((deal: any) => (
                  <tr key={deal.id} className="hover:bg-muted/30 transition-colors">
                    <td className="px-4 py-3 font-mono">{deal.id}</td>
                    <td className="px-4 py-3 font-medium">
                      <div className="flex items-center gap-3">
                        {deal.image_url && (
                          <img
                            src={deal.image_url}
                            alt=""
                            className="w-8 h-8 rounded object-cover"
                          />
                        )}
                        <span className="line-clamp-1">{deal.title}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 uppercase text-[10px] font-bold">
                      {deal.source_platform}
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-red-600 font-bold">-{deal.discount_percent}%</span>
                    </td>
                    <td className="px-4 py-3">
                      <Badge variant={deal.status === 'active' ? 'default' : 'secondary'}>
                        {deal.status}
                      </Badge>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => {
                            setEditingDeal(deal);
                            setIsEditing(true);
                          }}
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-destructive hover:text-destructive hover:bg-destructive/10"
                          onClick={() => {
                            if (confirm('Chắc chắn xóa?')) deleteMutation.mutate(deal.id);
                          }}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                        <a href={`/deals/${deal.slug}`} target="_blank" rel="noreferrer">
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

      {/* Form implementation would go here (or separate page) */}
      {isEditing && (
        <div className="fixed inset-0 bg-black/50 z-[100] flex items-center justify-center p-4">
          <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <CardHeader>
              <CardTitle>{editingDeal?.id ? 'Sửa Deal' : 'Thêm Deal Mới'}</CardTitle>
            </CardHeader>
            <CardContent>
              <form
                className="space-y-4"
                onSubmit={(e) => {
                  e.preventDefault();
                  /* form logic */ setIsEditing(false);
                }}
              >
                <p className="text-muted-foreground italic text-sm">Form logic: coming soon...</p>
                <div className="flex justify-end gap-3 pt-4">
                  <Button variant="outline" onClick={() => setIsEditing(false)}>
                    Hủy
                  </Button>
                  <Button type="submit">Lưu lại</Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
