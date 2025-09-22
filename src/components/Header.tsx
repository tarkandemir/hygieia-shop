'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { useCart } from '../contexts/CartContext';
import { useCategories } from '../hooks/useCategories';
import { useLoading } from '../contexts/LoadingContext';
import { Phone, Search, ShoppingBag, ChevronDown, X } from 'lucide-react';

interface HeaderProps {
  activeLink?: string;
}

export default function Header({ activeLink }: HeaderProps) {
  const { getItemCount } = useCart();
  const { categories } = useCategories();
  const { startLoading } = useLoading();
  const router = useRouter();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [isClient, setIsClient] = useState(false);

  // Fix hydration mismatch by ensuring client-only rendering for dynamic content
  useEffect(() => {
    setIsClient(true);
  }, []);

  const itemCount = isClient ? getItemCount() : 0;

  const handleLinkClick = () => {
    startLoading();
    setIsDropdownOpen(false);
  };

  const handleSmoothScroll = (e: React.MouseEvent<HTMLAnchorElement>, targetId: string) => {
    e.preventDefault();
    setIsDropdownOpen(false);
    setIsSearchOpen(false);
    
    const targetElement = document.getElementById(targetId);
    if (targetElement) {
      targetElement.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      });
    }
  };

  const handleNavigationClick = (url: string) => {
    startLoading();
    setIsDropdownOpen(false);
    setIsSearchOpen(false);
    // Small delay to show loading before navigation
    setTimeout(() => {
      router.push(url);
    }, 100);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      handleNavigationClick(`/products?search=${encodeURIComponent(searchTerm.trim())}`);
    }
  };

  const handleSearchToggle = () => {
    setIsSearchOpen(!isSearchOpen);
    setIsDropdownOpen(false);
    if (!isSearchOpen) {
      // Focus search input when opening
      setTimeout(() => {
        const searchInput = document.querySelector('input[type="search"]') as HTMLInputElement;
        if (searchInput) {
          searchInput.focus();
        }
      }, 100);
    }
  };

  return (
    <header className="bg-[#000080] text-white">
      <div className="container mx-auto px-6">
        <div className="flex items-center justify-between py-4">
          {/* Logo */}
          <Link href="/" onClick={handleLinkClick}>
            <Image
              src="/logo.png"
              alt="Hygieia Logo"
              width={120}
              height={40}
              className="h-10 w-auto"
            />
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link 
              href="/" 
              onClick={handleLinkClick}
              className={`hover:text-[#6AF0D2] transition-colors ${
                activeLink === 'home' ? 'text-[#6AF0D2]' : ''
              }`}
            >
              Anasayfa
            </Link>

            {/* Products Dropdown */}
            <div className="relative">
              <button
                onClick={() => {
                  setIsDropdownOpen(!isDropdownOpen);
                  setIsSearchOpen(false);
                }}
                className={`flex items-center space-x-1 hover:text-[#6AF0D2] transition-colors ${
                  activeLink === 'products' ? 'text-[#6AF0D2]' : ''
                }`}
              >
                <span>Ürünler</span>
                <ChevronDown size={16} />
              </button>

              {isDropdownOpen && isClient && (
                <div className="absolute top-full left-0 mt-2 w-64 bg-white text-gray-900 rounded-lg shadow-lg z-50">
                  <div className="py-2">
                    <button
                      onClick={() => handleNavigationClick('/products')}
                      className="block w-full text-left px-4 py-2 hover:bg-gray-50 transition-colors"
                    >
                      <div className="flex items-center space-x-2">
                        <div className="w-6 h-6 bg-gray-200 rounded flex items-center justify-center">
                          <span className="text-xs">📦</span>
                        </div>
                        <span>Tüm Ürünler</span>
                      </div>
                    </button>
                    
                    {categories
                      .filter(category => category.productCount > 0)
                      .map((category) => (
                      <button
                        key={category._id}
                        onClick={() => handleNavigationClick(`/kategori/${category.slug}`)}
                        className="block w-full text-left px-4 py-2 hover:bg-gray-50 transition-colors"
                      >
                        <div className="flex items-center space-x-2">
                          <div 
                            className="w-6 h-6 rounded flex items-center justify-center text-white text-xs"
                            style={{ backgroundColor: category.color || '#6AF0D2' }}
                          >
                            {category.icon === 'cube' && '📦'}
                            {category.icon === 'cleaning' && '🧽'}
                            {category.icon === 'paper' && '📄'}
                            {category.icon === 'food' && '🍽️'}
                            {category.icon === 'office' && '🖥️'}
                          </div>
                          <span>{category.name}</span>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <a 
              href="#about" 
              onClick={(e) => handleSmoothScroll(e, 'about')}
              className="hover:text-[#6AF0D2] transition-colors"
            >
              Hakkımızda
            </a>
            
            <a 
              href="#services" 
              onClick={(e) => handleSmoothScroll(e, 'services')}
              className="hover:text-[#6AF0D2] transition-colors"
            >
              Hizmetlerimiz
            </a>
            
            <a 
              href="#contact" 
              onClick={(e) => handleSmoothScroll(e, 'contact')}
              className="hover:text-[#6AF0D2] transition-colors"
            >
              İletişim
            </a>
          </nav>

          {/* Right Side Actions */}
          <div className="flex items-center space-x-4">
            {/* Search */}
            <div className="relative">
              <button
                onClick={handleSearchToggle}
                className="p-2 hover:text-[#6AF0D2] transition-colors"
                aria-label="Arama"
              >
                {isSearchOpen ? <X size={20} /> : <Search size={20} />}
              </button>

              {isSearchOpen && isClient && (
                <div className="absolute top-full right-0 mt-2 w-80 bg-white text-gray-900 rounded-lg shadow-lg z-50 p-4">
                  <form onSubmit={handleSearchSubmit} className="flex space-x-2">
                    <input
                      type="search"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      placeholder="Ürün ara..."
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6AF0D2] focus:border-transparent"
                    />
                    <button
                      type="submit"
                      className="px-4 py-2 bg-[#000080] text-white rounded-lg hover:bg-[#000069] transition-colors"
                    >
                      Ara
                    </button>
                  </form>
                </div>
              )}
            </div>

            {/* Phone */}
            <a href="tel:+905551234567" className="hidden md:flex items-center space-x-2 hover:text-[#6AF0D2] transition-colors">
              <Phone size={20} />
              <span>0555 123 45 67</span>
            </a>

            {/* Cart */}
            <button
              onClick={() => handleNavigationClick('/cart')}
              className="relative p-2 hover:text-[#6AF0D2] transition-colors"
              aria-label="Sepet"
            >
              <ShoppingBag size={20} />
              {isClient && itemCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-[#6AF0D2] text-[#000080] text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                  {itemCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation (can be added later) */}
    </header>
  );
}
