import { notFound } from 'next/navigation';
import { connectToDatabase } from '../../../../lib/mongodb';
import Product from '../../../../models/Product';
import Category from '../../../../models/Category';
import { IProduct, ICategory } from '../../../../types';
import Header from '../../../../components/Header';
import Footer from '../../../../components/Footer';
import Breadcrumb from '../../../../components/Breadcrumb';
import ProductDetailClient from './ProductDetailClient';

async function getProduct(id: string): Promise<IProduct | null> {
  await connectToDatabase();
  const product = await Product.findById(id).lean();
  return product ? JSON.parse(JSON.stringify(product)) : null;
}

async function getSimilarProducts(categoryId: string, excludeId: string): Promise<IProduct[]> {
  await connectToDatabase();
  const products = await Product.find({
    category: categoryId,
    _id: { $ne: excludeId },
    status: 'active'
  })
  .limit(6)
  .lean();
  
  return JSON.parse(JSON.stringify(products));
}

async function getCategory(categoryName: string): Promise<ICategory | null> {
  await connectToDatabase();
  const category = await Category.findOne({ name: categoryName }).lean();
  return category ? JSON.parse(JSON.stringify(category)) : null;
}

interface ProductDetailPageProps {
  params: Promise<{
    id: string;
    slug: string;
  }>;
}

export default async function ProductDetailPage({ params }: ProductDetailPageProps) {
  const { id } = await params;
  
  const product = await getProduct(id);
  
  if (!product) {
    notFound();
  }

  const [category, similarProducts] = await Promise.all([
    getCategory(product.category),
    getSimilarProducts(product.category, product._id),
  ]);

  const breadcrumbItems = [
    { label: 'Anasayfa', href: '/' },
    { label: 'Tüm Ürünler', href: '/products' },
    ...(category ? [{ label: category.name, href: `/kategori/${category.slug}` }] : []),
    { label: product.name },
  ];

  return (
    <div className="min-h-screen bg-white">
      <Header activeLink="products" />
      <Breadcrumb items={breadcrumbItems} />
      
      <ProductDetailClient 
        product={product}
        similarProducts={similarProducts}
        category={category}
      />
      
      <Footer />
    </div>
  );
}

// Generate metadata for SEO
export async function generateMetadata({ params }: ProductDetailPageProps) {
  const { id } = await params;
  const product = await getProduct(id);
  
  if (!product) {
    return {
      title: 'Ürün Bulunamadı - Hygieia',
    };
  }

  return {
    title: `${product.name} - Hygieia`,
    description: product.description || `${product.name} ürününü Hygieia'dan satın alın. En uygun fiyatlar ve hızlı teslimat.`,
  };
}
