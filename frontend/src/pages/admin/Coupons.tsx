import { useMutation, useQueryClient } from '@tanstack/react-query';
import { couponService } from '../../services/couponService';
import { useAdminCoupons } from '../../hooks/useCoupons';
import { Coupon } from '../../types';
import { Button } from '../../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Plus, Edit, Trash2 } from 'lucide-react';
import { useState } from 'react';

export default function AdminCoupons() {
  const queryClient = useQueryClient();
  const [isEditing, setIsEditing] = useState(false);
  const [editingCoupon, setEditingCoupon] = useState<Partial<Coupon> | null>(null);

  const { data: coupons, isLoading } = useAdminCoupons();

  const deleteMutation = useMutation({
    mutationFn: couponService.deleteCoupon,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin_coupons'] });
    },
  });

  if (isLoading) return <div className="animate-pulse h-64 bg-muted rounded-xl" />;

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Quản lý Mã Giảm Giá</h1>
          <p className="text-muted-foreground">
            Thêm, sửa, xóa mã giảm giá các sàn thương mại điện tử.
          </p>
        </div>
        <Button
          onClick={() => {
            setEditingCoupon({});
            setIsEditing(true);
          }}
        >
          <Plus className="w-4 h-4 mr-2" /> Thêm Mã Mới
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Danh sách Mã Giảm Giá</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-xs text-muted-foreground uppercase bg-muted/50">
                <tr>
                  <th className="px-4 py-3">ID</th>
                  <th className="px-4 py-3">Tiêu đề</th>
                  <th className="px-4 py-3">Sàn</th>
                  <th className="px-4 py-3">Mã</th>
                  <th className="px-4 py-3">Ngày hết hạn</th>
                  <th className="px-4 py-3 text-right">Thao tác</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {coupons?.map((coupon: Coupon) => (
                  <tr key={coupon.id} className="hover:bg-muted/30 transition-colors">
                    <td className="px-4 py-3 font-mono">{coupon.id}</td>
                    <td className="px-4 py-3 font-medium line-clamp-1">{coupon.title}</td>
                    <td className="px-4 py-3 uppercase text-[10px] font-bold">{coupon.platform}</td>
                    <td className="px-4 py-3">
                      <code className="bg-muted px-1.5 py-0.5 rounded text-primary font-bold">
                        {coupon.code}
                      </code>
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">
                      {coupon.end_at ? new Date(coupon.end_at).toLocaleDateString('vi-VN') : '-'}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => {
                            setEditingCoupon(coupon);
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
                            if (confirm('Chắc chắn xóa?')) deleteMutation.mutate(coupon.id);
                          }}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
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
          <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <CardHeader>
              <CardTitle>{editingCoupon?.id ? 'Sửa Mã' : 'Thêm Mã Mới'}</CardTitle>
            </CardHeader>
            <CardContent>
              <form
                className="space-y-4"
                onSubmit={(e) => {
                  e.preventDefault();
                  setIsEditing(false);
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
