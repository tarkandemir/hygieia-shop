import { notFound } from 'next/navigation';
import { connectToDatabase } from '../../../lib/mongodb';
import Category from '../../../models/Category';
import Product from '../../../models/Product';
import { ICategory, IProduct } from '../../../types';
import Header from '../../../components/Header';
import Footer from '../../../components/Footer';
import Breadcrumb from '../../../components/Breadcrumb';
import ProductCard from '../../../components/ProductCard';

async function getCategory(slug: string): Promise<ICategory | null> {
  await connectToDatabase();
  const category = await Category.findOne({ slug, isActive: true }).lean();
  return category ? JSON.parse(JSON.stringify(category)) : null;
}

async function getProducts(categoryName: string): Promise<IProduct[]> {
  await connectToDatabase();
  const products = await Product.find({
    category: categoryName,
    status: 'active'
  }).sort({ createdAt: -1 }).lean();
  
  return JSON.parse(JSON.stringify(products));
}

interface CategoryPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { slug } = await params;
  
  const category = await getCategory(slug);
  
  if (!category) {
    notFound();
  }

  const products = await getProducts(category.name);

  const breadcrumbItems = [
    { label: 'Anasayfa', href: '/' },
    { label: 'Tüm Ürünler', href: '/products' },
    { label: category.name },
  ];

  return (
    <div className="min-h-screen bg-white">
      <Header activeLink="products" />

      {/* Banner Section */}
      <section className="bg-[#000069] text-white py-16">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl">
            <h1 className="text-3xl lg:text-4xl font-semibold mb-4">
              {category.name}
            </h1>
            <p className="text-lg opacity-90">
              {category.description || `${category.name} kategorisindeki tüm ürünlerimizi keşfedin.`}
            </p>
          </div>
        </div>
      </section>

      <Breadcrumb items={breadcrumbItems} />

      {/* Products Section */}
      <section className="py-8">
        <div className="container mx-auto px-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-8">
            <div>
              <h2 className="text-2xl font-semibold text-gray-900 mb-2">
                {category.name} Ürünleri
              </h2>
              <p className="text-gray-600">
                {products.length} Ürün
              </p>
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
                Bu kategoride henüz ürün yok
              </h3>
              <p className="text-gray-600 mb-6">
                {category.name} kategorisine yakında ürünler eklenecek.
              </p>
              <a
                href="/products"
                className="bg-[#000069] text-white px-6 py-3 rounded-lg hover:bg-[#000080] transition-colors"
              >
                Tüm Ürünleri Görüntüle
              </a>
            </div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
}

// Generate metadata for SEO
export async function generateMetadata({ params }: CategoryPageProps) {
  const { slug } = await params;
  const category = await getCategory(slug);
  
  if (!category) {
    return {
      title: 'Kategori Bulunamadı - Hygieia',
    };
  }

  return {
    title: `${category.name} - Hygieia`,
    description: category.description || `${category.name} kategorisindeki ürünleri Hygieia'dan satın alın. En uygun fiyatlar ve hızlı teslimat.`,
    keywords: `${category.name}, hygieia, temizlik ürünleri, kağıt ürünleri`,
  };
}
