import { connectToDatabase } from '../../lib/mongodb';
import Category from '../../models/Category';
import Product from '../../models/Product';
import { ICategory, IProduct } from '../../types';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import Breadcrumb from '../../components/Breadcrumb';
import CategoryIcon from '../../components/CategoryIcon';
// import ProductCard from './../components/ProductCard';
import ProductsClient from './ProductsClient';

async function getCategoriesWithProductCounts(): Promise<(ICategory & { productCount: number })[]> {
  await connectToDatabase();
  const categories = await Category.find({ isActive: true }).sort({ order: 1 }).lean();
  
  // Get product counts for each category
  const categoriesWithCounts = await Promise.all(
    categories.map(async (category) => {
      const productCount = await Product.countDocuments({ 
        category: category.name, // Products store category as string name, not ObjectId
        status: 'active' 
      });
      return {
        ...category,
        productCount
      };
    })
  );
  
  return JSON.parse(JSON.stringify(categoriesWithCounts));
}

async function getProducts(categoryId?: string, search?: string): Promise<IProduct[]> {
  await connectToDatabase();
  
  const query: Record<string, unknown> = { status: 'active' };
  
  if (categoryId) {
    // Find the category name by ID first
    const category = await Category.findById(categoryId).lean();
    if (category) {
      query.category = category.name; // Products store category as string name, not ObjectId
    }
  }
  
  if (search) {
    query.$or = [
      { name: { $regex: search, $options: 'i' } },
      { description: { $regex: search, $options: 'i' } },
      { tags: { $in: [new RegExp(search, 'i')] } },
    ];
  }
  
  const products = await Product.find(query).sort({ createdAt: -1 }).lean();
  return JSON.parse(JSON.stringify(products));
}

interface ProductsPageProps {
  searchParams: Promise<{
    category?: string;
    search?: string;
  }>;
}

export default async function ProductsPage({ searchParams }: ProductsPageProps) {
  const { category: categoryId, search } = await searchParams;
  
  const [categories, products] = await Promise.all([
    getCategoriesWithProductCounts(),
    getProducts(categoryId, search),
  ]);

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
      />

      <Footer />
    </div>
  );
}
