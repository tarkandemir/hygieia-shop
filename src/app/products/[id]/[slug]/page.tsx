import { notFound } from 'next/navigation';
import { Products, Categories } from '../../../../lib/filedb';
import { IProduct, ICategory } from '../../../../types';
import Header from '../../../../components/Header';
import Footer from '../../../../components/Footer';
import Breadcrumb from '../../../../components/Breadcrumb';
import ProductDetailClient from './ProductDetailClient';

async function getProduct(id: string): Promise<IProduct | null> {
  const product = await Products.findById(id).lean();
  return product;
}

async function getSimilarProducts(categoryName: string, excludeId: string): Promise<IProduct[]> {
  const allProducts = await Products.find({
    category: categoryName,
    status: 'active'
  }).lean();
  
  const products = allProducts
    .filter((p: any) => p._id !== excludeId)
    .slice(0, 3);
  
  return products;
}

async function getCategory(categoryName: string): Promise<ICategory | null> {
  const category = await Categories.findOne({ name: categoryName }).lean();
  return category;
}

interface ProductDetailPageProps {
  params: Promise<{
    id: string;
    slug: string;
  }>;
}

export default async function ProductDetailPage({ params }: ProductDetailPageProps) {
  const { id } = await params;
  
  // Single optimized query for product
  const product = await getProduct(id);
  
  if (!product) {
    notFound();
  }

  // Only fetch similar products, skip category for now
  const similarProducts = await getSimilarProducts(product.category, product._id);

  const breadcrumbItems = [
    { label: 'Anasayfa', href: '/' },
    { label: 'Tüm Ürünler', href: '/products' },
    { label: product.category },
    { label: product.name },
  ];

  return (
    <div className="min-h-screen bg-white">
      <Header activeLink="products" />
      <Breadcrumb items={breadcrumbItems} />
      
      <ProductDetailClient 
        product={product}
        similarProducts={similarProducts}
        category={null}
      />
      
      <Footer />
    </div>
  );
}

// Generate metadata for SEO
export async function generateMetadata({ params }: ProductDetailPageProps) {
  try {
    const { id } = await params;
    const product = await Products.findById(id).lean();
    
    if (!product) {
      return {
        title: 'Ürün Bulunamadı - Hygieia',
      };
    }

    return {
      title: `${product.name} - Hygieia`,
      description: `${product.name} ürününü Hygieia'dan satın alın. En uygun fiyatlar ve hızlı teslimat.`,
    };
  } catch (error) {
    console.error('Metadata generation error:', error);
    return {
      title: 'Ürün - Hygieia',
    };
  }
}
