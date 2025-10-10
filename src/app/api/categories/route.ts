import { NextResponse } from 'next/server';
import { Categories, Products } from '../../../lib/filedb';

export async function GET() {
  try {
    // Cache headers for better performance
    const headers = {
      'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600',
    };
    
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
    
    return NextResponse.json(categoriesWithCounts, { headers });
    
  } catch (error) {
    console.error('Error fetching categories:', error);
    return NextResponse.json(
      { error: 'Failed to fetch categories' },
      { status: 500 }
    );
  }
}
