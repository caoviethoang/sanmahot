import { useState } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import api from '../../services/api';
import { Button } from '../../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '../../components/ui/card';

export default function AdminLogin() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const token = localStorage.getItem('admin_token');
  if (token) {
    return <Navigate to="/admin" replace />;
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const response = await api.post('/admin/login', { admin: { email, password } });
      const authHeader = response.headers['authorization'];
      
      if (authHeader) {
        const token = authHeader.split(' ')[1];
        localStorage.setItem('admin_token', token);
        navigate('/admin');
      } else {
        setError('Token not provided by server.');
      }
    } catch (err: any) {
      setError(err.response?.data || 'Đăng nhập thất bại. Vui lòng kiểm tra lại.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-muted/30 flex items-center justify-center p-4">
      <Card className="w-full max-w-md shadow-xl border-t-4 border-t-primary">
        <CardHeader className="text-center space-y-2">
          <CardTitle className="text-3xl font-extrabold tracking-tight text-primary">SanMaHot Admin</CardTitle>
          <CardDescription>Đăng nhập để quản lý hệ thống</CardDescription>
        </CardHeader>
        <form onSubmit={handleLogin}>
          <CardContent className="space-y-4">
            {error && (
              <div className="p-3 text-sm bg-red-100 text-red-600 rounded-md">
                {typeof error === 'string' ? error : 'Đăng nhập thất bại'}
              </div>
            )}
            <div className="space-y-2">
              <label className="text-sm font-medium leading-none">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                placeholder="admin@example.com"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium leading-none">Mật khẩu</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              />
            </div>
          </CardContent>
          <CardFooter>
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? 'Đang đăng nhập...' : 'Đăng nhập'}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
