import { Outlet, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import Header from './layout/Header';
import Footer from './layout/Footer';
import MobileSidebar from './layout/MobileSidebar';

export default function Layout() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  const handleSearch = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
    }
  };

  return (
    <div className="min-h-screen font-sans antialiased flex flex-col text-gray-800">
      <Header
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        handleSearch={handleSearch}
        setMobileMenuOpen={setMobileMenuOpen}
      />

      <MobileSidebar
        isOpen={mobileMenuOpen}
        onClose={() => setMobileMenuOpen(false)}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        handleSearch={handleSearch}
      />

      {/* Main Content */}
      <main className="container max-w-7xl mx-auto px-4 lg:px-8 flex-1 pt-28 md:pt-36 pb-12">
        <Outlet />
      </main>

      <Footer />
    </div>
  );
}
