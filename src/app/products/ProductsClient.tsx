'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { ICategory, IProduct } from '../../types';
import ProductCard from '../../components/ProductCard';
import CategoryIcon from '../../components/CategoryIcon';
import { Search, Filter, ChevronDown, ChevronUp } from 'lucide-react';

interface ProductsClientProps {
  initialProducts: IProduct[];
  categories: (ICategory & { productCount: number })[];
  selectedCategoryId?: string;
  initialSearch?: string;
}

export default function ProductsClient({ 
  initialProducts, 
  categories, 
  selectedCategoryId,
  initialSearch 
}: ProductsClientProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const [products, setProducts] = useState(initialProducts);
  const [searchTerm, setSearchTerm] = useState(initialSearch || '');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [sortBy, setSortBy] = useState('newest');
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set());

  const selectedCategory = selectedCategoryId 
    ? categories.find(cat => cat._id === selectedCategoryId)
    : null;

  // Filter and sort products
  useEffect(() => {
    let filteredProducts = [...initialProducts];

    // Apply search filter
    if (searchTerm) {
      filteredProducts = filteredProducts.filter(product =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    // Apply sorting
    switch (sortBy) {
      case 'price-low':
        filteredProducts.sort((a, b) => a.retailPrice - b.retailPrice);
        break;
      case 'price-high':
        filteredProducts.sort((a, b) => b.retailPrice - a.retailPrice);
        break;
      case 'name':
        filteredProducts.sort((a, b) => a.name.localeCompare(b.name, 'tr'));
        break;
      case 'newest':
      default:
        filteredProducts.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        break;
    }

    setProducts(filteredProducts);
  }, [initialProducts, searchTerm, sortBy]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams(searchParams.toString());
    if (searchTerm) {
      params.set('search', searchTerm);
    } else {
      params.delete('search');
    }
    router.push(`/products?${params.toString()}`);
  };

  const handleCategoryClick = (categoryId: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (categoryId === '' || categoryId === selectedCategoryId) {
      params.delete('category');
    } else {
      params.set('category', categoryId);
    }
    router.push(`/products?${params.toString()}`);
  };

  const toggleCategoryExpansion = (categoryId: string) => {
    const newExpanded = new Set(expandedCategories);
    if (newExpanded.has(categoryId)) {
      newExpanded.delete(categoryId);
    } else {
      newExpanded.add(categoryId);
    }
    setExpandedCategories(newExpanded);
  };

  return (
    <div className="container mx-auto px-6 py-8">
      <div className="grid lg:grid-cols-4 gap-8">
        {/* Sidebar Filter */}
        <div className="lg:col-span-1">
          <div className="sticky top-4">
            {/* Mobile Filter Toggle */}
            <button
              onClick={() => setIsFilterOpen(!isFilterOpen)}
              className="lg:hidden w-full flex items-center justify-between p-4 bg-white border border-gray-200 rounded-lg mb-4"
            >
              <span className="font-medium">İlgili Kategoriler</span>
              <Filter size={20} />
            </button>

            {/* Filter Content */}
            <div className={`bg-white border border-[#E9ECEF] rounded-lg p-2 ${isFilterOpen ? 'block' : 'hidden lg:block'}`}>
              <div className="mb-0">
                {/* İlgili Kategoriler Header */}
                <div className="flex items-center justify-between p-2 border-b border-gray-100 mb-3">
                  <h3 className="text-sm font-normal text-[#000069]">Tüm Ürünler</h3>
                  <ChevronUp size={16} className="text-[#000069]" />
                </div>
                
                <div className="space-y-0">
                  {/* All Products Link */}
                  <div className="py-2 px-2 hover:bg-gray-50 rounded-lg transition-colors">
                    <a
                      href="/products"
                      className={`flex items-center space-x-3 text-left text-sm transition-colors ${
                        !selectedCategoryId ? 'font-semibold text-[#000069]' : 'text-[#000069] hover:font-semibold'
                      }`}
                    >
                      {/* All Products Icon */}
                      <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-gray-100">
                        <CategoryIcon 
                          icon="cube" 
                          color="#000069" 
                          size={16}
                        />
                      </div>
                      
                      {/* Text */}
                      <div className="flex-1">
                        <div className="font-medium">Tüm Ürünler</div>
                      </div>
                    </a>
                  </div>
                  
                  {categories
                    .filter(category => category.productCount > 0)
                    .map((category) => {
                    const isSelected = selectedCategoryId === category._id;
                    const isExpanded = expandedCategories.has(category._id);
                    
                    return (
                      <div key={category._id}>
                        <div className="flex items-center justify-between py-2 px-2 hover:bg-gray-50 rounded-lg transition-colors">
                          <a
                            href={`/kategori/${category.slug}`}
                            className={`flex items-center space-x-3 text-left text-sm transition-colors flex-1 ${
                              isSelected ? 'font-semibold text-[#000069]' : 'text-[#000069] hover:font-semibold'
                            }`}
                          >
                            {/* Category Icon with Background */}
                            <div 
                              className="w-8 h-8 rounded-lg flex items-center justify-center"
                              style={{ backgroundColor: `${category.color}20` }}
                            >
                              <CategoryIcon 
                                icon={category.icon} 
                                color={category.color} 
                                size={16}
                              />
                            </div>
                            
                            {/* Category Name and Count */}
                            <div className="flex-1">
                              <div className="font-medium">{category.name}</div>
                              <div className="text-xs text-gray-500">
                                {category.productCount} ürün
                              </div>
                            </div>
                          </a>
                          
                          <button
                            onClick={() => toggleCategoryExpansion(category._id)}
                            className="p-1 hover:bg-gray-100 rounded transition-colors"
                          >
                            {isExpanded ? <ChevronUp size={16} className="text-[#000069]" /> : <ChevronDown size={16} className="text-[#000069]" />}
                          </button>
                        </div>
                        
                        {isExpanded && (
                          <div className="ml-2 space-y-1 border-l-2 pl-4 mt-2" style={{ borderColor: `${category.color}40` }}>
                            <div className="text-sm text-[#000069] py-2 font-bold">
                              Genel Temizlik ({Math.floor(category.productCount * 0.6)} Ürün)
                            </div>
                            <div className="text-sm text-[#000069] py-2">
                              Bulaşık & Çamaşır Temizliği ({Math.floor(category.productCount * 0.25)} Ürün)
                            </div>
                            <div className="text-sm text-[#000069] py-2">
                              Koku & Hijyen Ürünleri ({Math.floor(category.productCount * 0.35)} Ürün)
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Products Grid */}
        <div className="lg:col-span-3">
          {/* Title and Controls */}
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-8 space-y-4 lg:space-y-0">
            <div>
              <h2 className="text-2xl font-semibold text-gray-900 mb-2">
                {selectedCategory ? `${selectedCategory.name}` : 'Genel Temizlik Ürünleri'}
              </h2>
              <p className="text-gray-600">
                {products.length} Ürün
              </p>
            </div>

            <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
              {/* Search */}
              <form onSubmit={handleSearch} className="relative">
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Sayfa içerisinde ürün ara..."
                  className="w-full sm:w-64 pl-4 pr-12 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6AF0D2] focus:border-transparent"
                />
                <button
                  type="submit"
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[#000069]"
                >
                  <Search size={20} />
                </button>
              </form>

              {/* Sort */}
              <div className="relative">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="appearance-none bg-white border border-gray-200 rounded-lg px-4 py-3 pr-10 focus:outline-none focus:ring-2 focus:ring-[#6AF0D2] focus:border-transparent"
                >
                  <option value="newest">Seçtiklerimiz</option>
                  <option value="price-low">Fiyat (Düşük-Yüksek)</option>
                  <option value="price-high">Fiyat (Yüksek-Düşük)</option>
                  <option value="name">İsim (A-Z)</option>
                </select>
                <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none" size={16} />
              </div>
            </div>
          </div>

          {/* Products Grid */}
          {products.length > 0 ? (
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {products.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <div className="text-6xl mb-4">📦</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Ürün bulunamadı
              </h3>
              <p className="text-gray-600 mb-6">
                Aradığınız kriterlere uygun ürün bulunamadı. Lütfen filtreleri değiştirerek tekrar deneyin.
              </p>
              <button
                onClick={() => {
                  setSearchTerm('');
                  router.push('/products');
                }}
                className="bg-[#000069] text-white px-6 py-3 rounded-lg hover:bg-[#000080] transition-colors"
              >
                Tüm Ürünleri Görüntüle
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
