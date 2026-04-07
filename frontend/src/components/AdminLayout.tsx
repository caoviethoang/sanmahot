import { Outlet, Navigate, Link, useNavigate } from 'react-router-dom';
import { Button } from './ui/button';
import { LayoutDashboard, LogOut, Tags, ShoppingBag, Ticket, FileText } from 'lucide-react';
import api from '../services/api';

export default function AdminLayout() {
  const navigate = useNavigate();
  const token = localStorage.getItem('admin_token');

  if (!token) {
    return <Navigate to="/admin/login" replace />;
  }

  const handleLogout = async () => {
    try {
      await api.delete('/admin/logout', {
        headers: { Authorization: `Bearer ${token}` }
      });
    } catch (e) {
      console.error(e);
    } finally {
      localStorage.removeItem('admin_token');
      navigate('/admin/login');
    }
  };

  return (
    <div className="min-h-screen bg-muted/20 flex flex-col md:flex-row">
      {/* Sidebar */}
      <aside className="w-full md:w-64 bg-background border-r p-4 flex flex-col justify-between">
        <div className="space-y-6">
          <Link to="/admin" className="block text-2xl font-bold text-primary px-2">
            SanMaHot Admin
          </Link>
          <nav className="space-y-1">
             <Link to="/admin" className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-accent hover:text-accent-foreground text-sm font-medium">
               <LayoutDashboard className="w-4 h-4" /> Tổng quan
             </Link>
             <Link to="/admin/deals" className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-accent hover:text-accent-foreground text-sm font-medium">
               <ShoppingBag className="w-4 h-4" /> Quản lý Deal
             </Link>
             <Link to="/admin/coupons" className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-accent hover:text-accent-foreground text-sm font-medium">
               <Ticket className="w-4 h-4" /> Mã Giảm Giá
             </Link>
             <Link to="/admin/categories" className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-accent hover:text-accent-foreground text-sm font-medium">
               <Tags className="w-4 h-4" /> Danh mục
             </Link>
             <Link to="/admin/articles" className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-accent hover:text-accent-foreground text-sm font-medium">
               <FileText className="w-4 h-4" /> Bài Viết SEO
             </Link>
          </nav>
        </div>
        <div>
          <Button variant="ghost" onClick={handleLogout} className="w-full justify-start text-destructive hover:text-destructive hover:bg-destructive/10">
            <LogOut className="w-4 h-4 mr-2" /> Đăng xuất
          </Button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6 md:p-10 overflow-y-auto">
        <Outlet />
      </main>
    </div>
  );
}
