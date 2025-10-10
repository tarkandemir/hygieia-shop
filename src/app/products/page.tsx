import { Products, Categories } from '../../lib/filedb';
import { ICategory, IProduct } from '../../types';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import Breadcrumb from '../../components/Breadcrumb';
import CategoryIcon from '../../components/CategoryIcon';
// import ProductCard from './../components/ProductCard';
import ProductsClient from './ProductsClient';

async function getCategoriesWithProductCounts(): Promise<(ICategory & { productCount: number })[]> {
  const categories = await Categories.find({ isActive: true }).sort({ order: 1 }).lean();
  const products = await Products.find({ status: 'active' }).lean();
  
  // Count products per category
  const countMap = new Map();
  products.forEach((product: any) => {
    const count = countMap.get(product.category) || 0;
    countMap.set(product.category, count + 1);
  });

  // Combine categories with counts
  const categoriesWithCounts = categories.map((category: any) => ({
    ...category,
    productCount: countMap.get(category.name) || 0
  }));
  
  return categoriesWithCounts;
}

async function getProducts(categoryId?: string, search?: string, page: number = 1, limit: number = 20): Promise<{ products: IProduct[]; totalCount: number; totalPages: number }> {
  let products = await Products.find({ status: 'active' }).lean();
  
  if (categoryId) {
    // Find the category name by ID first
    const category = await Categories.find({ _id: categoryId }).lean();
    if (category && category[0]) {
      products = products.filter((p: any) => p.category === category[0].name);
    }
  }
  
  if (search) {
    const searchLower = search.toLowerCase();
    products = products.filter((p: any) => 
      p.name.toLowerCase().includes(searchLower) ||
      p.description?.toLowerCase().includes(searchLower) ||
      p.tags?.some((tag: string) => tag.toLowerCase().includes(searchLower))
    );
  }
  
  // Sort by createdAt (newest first)
  products.sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  
  // Get total count for pagination
  const totalCount = products.length;
  const totalPages = Math.ceil(totalCount / limit);
  
  // Apply pagination
  const paginatedProducts = products.slice((page - 1) * limit, page * limit);
    
  return {
    products: paginatedProducts,
    totalCount,
    totalPages
  };
}

interface ProductsPageProps {
  searchParams: Promise<{
    category?: string;
    search?: string;
    page?: string;
  }>;
}

export default async function ProductsPage({ searchParams }: ProductsPageProps) {
  const { category: categoryId, search, page: pageParam } = await searchParams;
  const page = parseInt(pageParam || '1', 10);
  
  const [categories, productsData] = await Promise.all([
    getCategoriesWithProductCounts(),
    getProducts(categoryId, search, page, 20),
  ]);
  
  const { products, totalCount, totalPages } = productsData;

  const selectedCategory = categoryId 
    ? categories.find(cat => cat._id === categoryId)
    : null;

  const breadcrumbItems: Array<{ label: string; href?: string }> = [
    { label: 'Anasayfa', href: '/' },
    { label: 'Tüm Ürünler' },
  ];

  if (selectedCategory) {
    breadcrumbItems[1] = { label: 'Tüm Ürünler', href: '/products' };
    breadcrumbItems.push({ label: selectedCategory.name });
  }

  return (
    <div className="min-h-screen bg-white">
      <Header activeLink="products" />

      {/* Banner Section */}
      <section className="bg-[#000069] text-white py-16">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl">
            <h1 className="text-3xl lg:text-4xl font-semibold mb-4">
              {selectedCategory ? selectedCategory.name : 'Temizlik Ürünleri'}
            </h1>
            <p className="text-lg opacity-90">
              {selectedCategory 
                ? selectedCategory.description 
                : 'Hygieia, Türkiye\'de üretilen veya yurt dışından ithal edilen her türlü temizlik malzemesinin tedariğini sağlamaktadır.'
              }
            </p>
          </div>
        </div>
      </section>

      <Breadcrumb items={breadcrumbItems} />

      {/* Categories Section */}
      <section className="py-8 bg-gray-50">
        <div className="container mx-auto px-6">
          <div className="overflow-x-auto">
            <div className="flex space-x-6 pb-4" style={{ minWidth: 'max-content' }}>
              {categories
                .filter(category => category.productCount > 0)
                .map((category) => (
                <a
                  key={category._id}
                  href={`/kategori/${category.slug}`}
                  className={`flex-shrink-0 block p-6 rounded-lg border transition-all hover:shadow-md w-80 ${
                    categoryId === category._id
                      ? 'bg-[#E9FDF8] border-[#6AF0D2]'
                      : 'bg-white border-gray-200 hover:border-[#6AF0D2]'
                  }`}
                >
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="font-semibold text-[#000069] mb-1">
                        {category.name}
                      </h3>
                      <p className="text-sm text-gray-600">
                        {category.productCount} Ürün
                      </p>
                    </div>
                    <div 
                      className="w-16 h-16 rounded-lg flex items-center justify-center"
                      style={{ backgroundColor: `${category.color}20` }}
                    >
                      <CategoryIcon 
                        icon={category.icon} 
                        color={category.color} 
                        size={32}
                      />
                    </div>
                  </div>
                </a>
              ))}
            </div>
          </div>
        </div>
      </section>

      <ProductsClient 
        initialProducts={products}
        categories={categories}
        selectedCategoryId={categoryId}
        initialSearch={search}
        currentPage={page}
        totalPages={totalPages}
        totalCount={totalCount}
      />

      <Footer />
    </div>
  );
}
