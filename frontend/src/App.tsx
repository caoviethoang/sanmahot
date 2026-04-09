import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { HelmetProvider } from 'react-helmet-async';
import Layout from './components/Layout';
import Home from './pages/Home';
import Deals from './pages/Deals';
import Coupons from './pages/Coupons';
import Categories from './pages/Categories';
import CategoryDetail from './pages/CategoryDetail';
import DealDetail from './pages/DealDetail';
import Search from './pages/Search';
import Articles from './pages/Articles';
import ArticleDetail from './pages/ArticleDetail';
import Guides from './pages/Guides';
import GuideDetail from './pages/GuideDetail';
import AdminLayout from './components/AdminLayout';
import AdminLogin from './pages/admin/Login';
import AdminDashboard from './pages/admin/Dashboard';
import AdminDeals from './pages/admin/Deals';
import AdminCoupons from './pages/admin/Coupons';
import AdminArticles from './pages/admin/Articles';

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <HelmetProvider>
        <Router>
          <Routes>
            <Route path="/" element={<Layout />}>
              <Route index element={<Home />} />
              <Route path="deals" element={<Deals />} />
              <Route path="deals/:slug" element={<DealDetail />} />
              <Route path="coupons" element={<Coupons />} />
              <Route path="categories" element={<Categories />} />
              <Route path="categories/:slug" element={<CategoryDetail />} />
              <Route path="search" element={<Search />} />
              <Route path="tin-khuyen-mai" element={<Articles />} />
              <Route path="tin-khuyen-mai/:slug" element={<ArticleDetail />} />
              <Route path="huong-dan" element={<Guides />} />
              <Route path="huong-dan/:slug" element={<GuideDetail />} />
            </Route>

            <Route path="/admin/login" element={<AdminLogin />} />
            <Route path="/admin" element={<AdminLayout />}>
              <Route index element={<AdminDashboard />} />
              <Route path="deals" element={<AdminDeals />} />
              <Route path="coupons" element={<AdminCoupons />} />
              <Route path="articles" element={<AdminArticles />} />
              {/* Future admin routes like categories, articles management will go here */}
            </Route>
          </Routes>
        </Router>
      </HelmetProvider>
    </QueryClientProvider>
  );
}

export default App;
